import { google } from 'googleapis';
import dotenv from 'dotenv';

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

export const logMessageToSheet = async (message) => {
    if (!auth) {
        await initializeAuth();
    }

    if (!auth) {
        console.error('Google Sheets authentication is not initialized.');
        return;
    }

    const sheets = google.sheets({ version: 'v4', auth });

    const values = [
        [
            new Date().toISOString(),
            message.from,
            message.text,
            message.metadata.type,
            message.audio ? 'Yes' : 'No',
            JSON.stringify(message.metadata || {})
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
        from: 'testUser',
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
