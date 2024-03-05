import WhatsApp from "whatsapp";

console.log("initializing whatsapp with", process.env.WA_PHONE_NUMBER_ID);
const wa = new WhatsApp(process.env.WA_PHONE_NUMBER_ID);

const sendMessage = async (message, recipientNumber, mediaUrl = '') => {
  console.log(`Sending message to ${recipientNumber}: ${message} with media URL: ${mediaUrl}`);
  const sentMessage = mediaUrl
    ? wa.messages.audio({ link: mediaUrl}, recipientNumber)
    : wa.messages.text({ body: message }, recipientNumber);

  try {
    const result = await sentMessage;
    console.log("Message sent successfully:");
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};

export { sendMessage };
