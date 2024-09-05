import connectMongo from "@/lib/db";
import { Development } from "@/models/post";
import { NextResponse } from "next/server";


export async function POST(request) {
    await connectMongo();
  
    try {
      const { selectedTitle, title } = await request.json();
      const titles = decodeURIComponent(selectedTitle).split(' > ');
  
      // Fetch all Hrs
      const Hrs = await Development.find();
  
      // Flatten sections to easily search
      const sections = Hrs.flatMap(Hr => Hr.section);
  
      // Initialize the parent section and update path
      let parentSection = null;
      let updatePath = "";
  
      // Find the parent section based on the title hierarchy
      if (titles[0] === 'Please select a section') {
        const newHr = new Development({
          section: [{
            title,
            content: [],
            subSection: []
          }]
        });
      
        // Save the new Hr to the database
        await newHr.save();
      
        return NextResponse.json({ success: true, message: "New Hr created successfully." });
      }
     else if (titles.length === 1) {
        parentSection = sections.find(section => section.title === titles[0]);
        updatePath = "section.$[parentSection].subSection";
      } else if (titles.length === 2) {
        parentSection = sections.find(section =>
          section.title === titles[0] &&
          section.subSection.some(sub => sub.title === titles[1])
        );
        updatePath = "section.$[parentSection].subSection.$[childSection].subSection1";
      } else if (titles.length === 3) {
        parentSection = sections.find(section =>
          section.title === titles[0] &&
          section.subSection.some(sub =>
            sub.title === titles[1] &&
            sub.subSection1.some(sub1 => sub1.title === titles[2])
          )
        );
        updatePath = "section.$[parentSection].subSection.$[childSection].subSection1.$[grandChildSection].subSection2";
      }
  
      if (!parentSection) {
        return NextResponse.json({ success: false, message: "Failed to find the matching section." });
      }
  
      // Create the new section object
      const newSection = {
        title,
        content: [],
        subSection: [],
      };
  
      // Update the document by pushing the new section in the appropriate location
      const updateResult = await Development.updateOne(
        { 'section.title': titles[0] }, // No need for `_id`, match based on the root section title
        { $push: { [updatePath]: newSection } },
        {
          arrayFilters: [
            { 'parentSection.title': titles[0] },
            titles.length > 1 ? { 'childSection.title': titles[1] } : null,
            titles.length > 2 ? { 'grandChildSection.title': titles[2] } : null,
          ].filter(Boolean),
        }
      );
  
      if (updateResult.modifiedCount === 0) {
        return NextResponse.json({ success: false, message: "Failed to add the new section, no matching document found." });
      }
  
      return NextResponse.json({ success: true, message: "New section added successfully." });
  
    } catch (error) {
      console.error("Error saving post:", error);
      return NextResponse.json({ success: false, error: "Failed to save Hr." });
    }
  }