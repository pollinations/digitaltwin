import { google } from 'googleapis';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

let auth = null;

const initializeAuth = async () => {
    try {
        auth = new google.auth.JWT(
            process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            null,
            process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
            SCOPES
        );
    } catch (error) {
        console.error('Error initializing Google Sheets authentication:', error);
    }
};

/**
 * Logs a message to the Google Sheet.
 * @param {Object} message - The message object containing details to log.
 */
export const logMessageToSheet = async (message) => {
    if (!auth) {
        await initializeAuth();
    }

    if (!auth) {
        console.error('Google Sheets authentication is not initialized.');
        return;
    }

    const sheets = google.sheets({ version: 'v4', auth });

    const countryCode = message.from.slice(0, 2);
    const hash = crypto.createHash('md5').update(message.from).digest('hex').slice(0, 4);

    const values = [
        [
            new Date().toISOString(),
            countryCode,
            hash,
            message.text,
            message.type,
            message.audio ? 'Yes' : 'No',
            JSON.stringify(message.metadata || {}),
            message.name // Ensure name is logged
        ]
    ];

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1', // Adjust if your sheet has a different name
            valueInputOption: 'USER_ENTERED',
            resource: { values },
        });
        console.log('Message logged to Google Sheet');
    } catch (error) {
        console.error('Error logging to Google Sheet:', error);
    }
};

// Test function to log a sample message to the sheet
const testLogMessageToSheet = async () => {
    const testMessage = {
        channel: 'testUser', // Renamed from 'from' to 'channel'
        text: 'This is a test message',
        audio: false,
        metadata: { type: 'test' }
    };

    await logMessageToSheet(testMessage);
};

// // Run the test function if this file is executed directly
// if (require.main === module) {
// testLogMessageToSheet();
// }