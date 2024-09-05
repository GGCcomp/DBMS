import connectMongo from "@/lib/db";
import { Hr } from "@/models/post";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectMongo();
  const { searchParams } = new URL(request.url);
  const selectedTitle = searchParams.get('selectedTitle');

  try {
    const posts = await Hr.find();
    const sections = posts.flatMap(sec => sec.section);
    
    const titles = decodeURIComponent(selectedTitle).split(' > ');

    const pipeline = [
      { $unwind: '$section' },
      { $match: { 'section.title': titles[0] } },
    ];

    if (titles.length > 1) {
      pipeline.push({ $unwind: '$section.subSection' });
      pipeline.push({ $match: { 'section.subSection.title': titles[1] } });
    }
    if (titles.length > 2) {
      pipeline.push({ $unwind: '$section.subSection.subSection1' });
      pipeline.push({ $match: { 'section.subSection.subSection1.title': titles[2] } });
    }
    if (titles.length > 3) {
      pipeline.push({ $unwind: '$section.subSection.subSection1.subSection2' });
      pipeline.push({ $match: { 'section.subSection.subSection1.subSection2.title': titles[3] } });
    }

    // Final stage: Project the content based on the last level found
    pipeline.push({
      $project: {
        content: titles.length === 1
          ? '$section.content'
          : titles.length === 2
            ? '$section.subSection.content'
            : titles.length === 3
              ? '$section.subSection.subSection1.content'
              : '$section.subSection.subSection1.subSection2.content',
      }
    });

    const content = await Hr.aggregate(pipeline);

    // Return the matched content, or null if nothing was found
    const data = content.length > 0 ? content[0].content : null;


    return NextResponse.json({ section: sections, content: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message });
  }
}

export async function POST(request) {
  await connectMongo();

  try {
    const { selectedTitle, content } = await request.json();
    
    const titles = decodeURIComponent(selectedTitle).split(' > ');

    // Construct the base query
    const updateQuery = { 'section.title': titles[0] };
    let updateField = 'section.$.content';

    if (titles.length > 1) {
      updateQuery['section.subSection.title'] = titles[1];
      updateField = 'section.$[i].subSection.$[j].content';
    }
    if (titles.length > 2) {
      updateQuery['section.subSection.subSection1.title'] = titles[2];
      updateField = 'section.$[i].subSection.$[j].subSection1.$[k].content';
    }
    if (titles.length > 3) {
      updateQuery['section.subSection.subSection1.subSection2.title'] = titles[3];
      updateField = 'section.$[i].subSection.$[j].subSection1.$[k].subSection2.$[l].content';
    }

    // Define the array filters for nested updates
    const arrayFilters = [
      { 'i.title': titles[0] },
      titles.length > 1 ? { 'j.title': titles[1] } : null,
      titles.length > 2 ? { 'k.title': titles[2] } : null,
      titles.length > 3 ? { 'l.title': titles[3] } : null,
    ].filter(Boolean); // remove null values

    
      let result = await Hr.updateOne(
        updateQuery,
        { $push: { [updateField]: content } },
        { arrayFilters }
      );
 
      if (result.nModified > 0) {
        return NextResponse.json({ success: true, message: 'Content added to existing section' });
      } else {
        return NextResponse.json({ success: false, error: "Failed to find the section to update" });
      }
    
  } catch (error) {
    console.error("Error saving post:", error);
    return NextResponse.json({ success: false, error: "Failed to save post" });
  }
}

