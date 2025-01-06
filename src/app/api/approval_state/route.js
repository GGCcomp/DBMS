import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Helper function to get the path to the JSON file storing the approval state
const getApprovalStateFilePath = () => {
  return path.join(process.cwd(), "data", "approvalState.json");
};

// Helper function to ensure the directory and file exist
const ensureFileExists = async (filePath, defaultData) => {
  const directoryPath = path.dirname(filePath);
  
  try {
    // Ensure the directory exists
    await fs.access(directoryPath);
  } catch {
    // Create the directory if it doesn't exist
    await fs.mkdir(directoryPath, { recursive: true });
  }

  try {
    // Check if the file exists
    await fs.access(filePath);
  } catch {
    // Create the file with default data if it doesn't exist
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
  }
};

export async function GET() {
  const filePath = getApprovalStateFilePath();

  // Default approval state
  const defaultState = {
    userA: false,
    userB: false,
    userC: false,
  };

  // Ensure the file and directory exist
  await ensureFileExists(filePath, defaultState);

  try {
    // Read the current approval state
    const data = await fs.readFile(filePath, "utf8");
    const approvalState = JSON.parse(data);

    return NextResponse.json((approvalState), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error reading approval state:", error);
    return NextResponse.json(({ message: "Failed to read approval state" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  const filePath = getApprovalStateFilePath();

  // Default approval state
  const defaultState = {
    userA: false,
    userB: false,
    userC: false,
  };

  // Ensure the file and directory exist
  await ensureFileExists(filePath, defaultState);

  try {
    const updatedState = await req.json();

    // Validate the input
    if (
      typeof updatedState.userA !== "boolean" ||
      typeof updatedState.userB !== "boolean" ||
      typeof updatedState.userC !== "boolean"
    ) {
      return NextResponse.json(({ message: "Invalid approval state format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Save the updated state to the file
    await fs.writeFile(filePath, JSON.stringify(updatedState, null, 2));

    return NextResponse.json(({ message: "Approval state updated successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating approval state:", error);
    return NextResponse.json(({ message: "Failed to update approval state" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
