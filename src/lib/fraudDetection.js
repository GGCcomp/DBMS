export async function detectFraud(userId, email, reason) {
  try {
    const response = await fetch(`http://localhost:3000/api/fraud-log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        email,
        reason,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to log fraud: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fraud detection error:", error);
  }
}
