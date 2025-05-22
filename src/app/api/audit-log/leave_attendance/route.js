import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import { AuditLog } from "@/models/user";


export async function GET(req) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const dateFilter = searchParams.get('date'); // Expected format: 'YYYY-MM-DD'
    console.log(dateFilter);
    

    // Construct the match stage based on the presence of a date filter
    const matchStage = {
      action: { $in: ['Login', 'Logout'] },
    };

    if (dateFilter) {
      const start = new Date(`${dateFilter}T00:00:00.000Z`);
      const end = new Date(`${dateFilter}T23:59:59.999Z`);
      matchStage.createdAt = { $gte: start, $lte: end };
    }

    // Aggregation pipeline to compute attendance logs
    const pipeline = [
      { $match: matchStage },
      {
        $project: {
          name: '$user.name',
          department: '$user.department',
          role: '$user.role',
          action: 1,
          createdAt: 1,
          date: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
        },
      },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: {
            name: '$name',
            date: '$date',
          },
          department: { $first: '$department' },
          role: { $first: '$role' },
          logins: {
            $push: {
              action: '$action',
              createdAt: '$createdAt',
            },
          },
        },
      },
      {
        $project: {
          name: '$_id.name',
          date: '$_id.date',
          department: 1,
          role: 1,
          firstLogin: {
            $first: {
              $filter: {
                input: '$logins',
                as: 'log',
                cond: { $eq: ['$$log.action', 'Login'] },
              },
            },
          },
          lastLogout: {
            $last: {
              $filter: {
                input: '$logins',
                as: 'log',
                cond: { $eq: ['$$log.action', 'Logout'] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          status: {
            $cond: {
              if: {
                $and: [
                  { $ifNull: ['$firstLogin.createdAt', false] },
                  { $ifNull: ['$lastLogout.createdAt', false] },
                  {
                    $gte: [
                      {
                        $subtract: [
                          '$lastLogout.createdAt',
                          '$firstLogin.createdAt',
                        ],
                      },
                      6 * 60 * 60 * 1000, // 6 hours in milliseconds
                    ],
                  },
                ],
              },
              then: 'Present',
              else: 'Absent',
            },
          },
        },
      },
      { $sort: { date: -1 } },
    ];

    const logs = await AuditLog.aggregate(pipeline);

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}