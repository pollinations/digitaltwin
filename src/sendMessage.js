import WhatsApp from "whatsapp";

// Splitting admin numbers from environment variable and storing them in an array
const ADMIN_NUMBERS = process.env.ADMIN_NUMBERS.split(",")

// Logging the initialization of WhatsApp with the phone number ID from environment variables
console.log("initializing whatsapp with", process.env.WA_PHONE_NUMBER_ID);
// Creating a new WhatsApp instance with the phone number ID
const wa = new WhatsApp(process.env.WA_PHONE_NUMBER_ID);

// Function to send a text message to a specific number
const sendTextMessage = async (number, msg) => {
  
  console.log(`Sending text message to ${number}: ${msg}`);
  await wa.messages.text({ body: msg }, number);
};

// Function to send an audio message to a specific number
const sendAudioMessage = async (number, url) => {
  console.log(`Sending audio message to ${number}: ${url}`);
  await wa.messages.audio({ link: url }, number);
};

// Function to send messages to admin numbers
const sendMessageToAdmins = async (userId, message, {mediaUrl = '', direction='->'}) => {
  
  const filteredAdminNumbers = ADMIN_NUMBERS.filter(no => no !== userId);
  // Preparing the message to be sent to admin numbers for logging
  const adminMessage = `${direction} ${userId}\n${message}`;

  try {
    await Promise.all(filteredAdminNumbers.map(async number => {
      console.log(`Sending admin message to ${number}: ${adminMessage}`);
      
      if (mediaUrl) {
        console.log(`Sending admin media message to ${number}: ${mediaUrl}`);
        await sendAudioMessage(number, mediaUrl);
      }
      else 
        await sendTextMessage(number, adminMessage);

    }));
    console.log("Admin notification success");
  } catch (error) {
    console.error("Failed to notify admins:", error);
  }
};

// Function to send a message, optionally with a media URL, to a recipient number
const sendMessage = async (message, recipientNumber, mediaUrl = '') => {
  // Logging the message being sent, including the media URL if present
  console.log(`Sending message to ${recipientNumber}: ${message} with media URL: ${mediaUrl}`);
  try {

    // Checking if a media URL is provided to decide between sending an audio or text message
    if (mediaUrl) {
      // Sending an audio message to the recipient
      await sendAudioMessage(recipientNumber, mediaUrl);
    } else {
      // Sending a text message to the recipient
      await sendTextMessage(recipientNumber, message);
    }
    // Logging success upon successful message delivery
    console.log("Message sent successfully to", recipientNumber);
  } catch (error) {
    // Logging an error message in case of failure to send the message
    console.error("Failed to send message to", recipientNumber, ":", error);
  }
};

// Exporting the sendMessage and sendMessageToAdmins function for use in other parts of the application
export { sendMessage, sendMessageToAdmins };

