const WhatsApp = require("whatsapp");
const wa = new WhatsApp(process.env.WA_PHONE_NUMBER_ID);

const sendMessage = async (message, recipientNumber, mediaUrl = '') => {
  console.log(`Sending message to ${recipientNumber}: ${message} with media URL: ${mediaUrl}`);
  try {
    let sentMessage;
    if (mediaUrl) {
      sentMessage = wa.messages.audio({ link: mediaUrl }, recipientNumber);
    } else {
      sentMessage = wa.messages.text({ body: message }, recipientNumber);
    }

    await sentMessage.then((res) => {
      console.log("success");
    });
  } catch (e) {
    console.log("error", e);
  }
};


module.exports = { sendMessage };