import CryptoJS from 'crypto-js';
import { encryptedSecrets } from './encryptedSecrets.js';

/**
 * Decrypts the secrets using the provided password
 * @param {string} password - The password used for decryption
 * @returns {Object} - The decrypted secrets as an object
 */
export function decryptSecrets(password) {
    const bytes = CryptoJS.AES.decrypt(encryptedSecrets, password);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
}
