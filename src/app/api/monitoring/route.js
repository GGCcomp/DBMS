import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = process.env.VERCEL_API_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;

    if (!token || !projectId) {
      return NextResponse.json({ success: false, error: "Missing API credentials" }, { status: 500 });
    }

    const headers = { Authorization: `Bearer ${token}` };

    // Check if API is reachable
    const testRes = await fetch("https://api.vercel.com/v1/uptime", { headers });
    const testText = await testRes.text();
    //console.log("🔹 Uptime API Response:", testText); // Debug log

    // Fetch deployment info
    const deploymentRes = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}`, { headers });
    const deploymentText = await deploymentRes.text();
    //console.log("🔹 Deployment API Response:", deploymentText); // Debug log
    const deploymentData = JSON.parse(deploymentText);

    if (!deploymentData.deployments?.length) {
      return NextResponse.json({ success: false, error: "No deployments found" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: deploymentData });
  } catch (error) {
    console.error("❌ Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
