import WhatsApp from "whatsapp";

const wa = new WhatsApp(process.env.WA_PHONE_NUMBER_ID);

const sendMessage = async (message, recipientNumber, mediaUrl = '') => {
  console.log(`Sending message to ${recipientNumber}: ${message} with media URL: ${mediaUrl}`);
  try {
    const sentMessage = mediaUrl
      ? wa.messages.audio({ link: mediaUrl }, recipientNumber)
      : wa.messages.text({ body: message }, recipientNumber);

    await sentMessage.then(() => {
      console.log("success");
    });
  } catch (e) {
    console.log("error", e);
  }
};

export { sendMessage };
