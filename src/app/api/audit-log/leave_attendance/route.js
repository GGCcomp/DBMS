import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import { AuditLog } from "@/models/user";


export async function GET(req) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 5;
    const skip = parseInt(searchParams.get('skip')) || 0;

    const totalCountAgg = await AuditLog.aggregate([
  {
    $match: {
      action: { $in: ['Login', 'Logout'] },
    },
  },
  {
    $project: {
      name: '$user.name',
      date: {
        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
      },
    },
  },
  {
    $group: {
      _id: {
        name: '$name',
        date: '$date',
      },
    },
  },
  {
    $count: 'total',
  },
]);

const total = totalCountAgg[0]?.total || 0;

    const pipeline = [
      {
        $match: {
          action: { $in: ['Login', 'Logout'] },
        },
      },
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
      {
        $sort: { createdAt: 1 }
      },
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
                      6 * 60 * 60 * 1000, // 6 hours in ms
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
      
      {
        $sort: { date: -1 }
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    const logs = await AuditLog.aggregate(pipeline);

    return NextResponse.json({ logs, total });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}