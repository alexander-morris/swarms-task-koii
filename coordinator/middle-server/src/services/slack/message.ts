export async function sendMessageToSlack(message: string): Promise<void> {
  try {
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!slackWebhookUrl) {
      throw new Error("SLACK_WEBHOOK_URL is not set");
    }

    const payload = {
      text: message,
    };

    const response = await fetch(slackWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to send message to Slack");
    }
  } catch (error) {
    console.error("Error sending message to Slack:", error);
    throw error;
  }
}
