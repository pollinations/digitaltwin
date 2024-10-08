import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import os from 'os';
import path from 'path';

const execAsync = util.promisify(exec);
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

export const audioEffects = async ({ buffer }, backgroundFilePath) => {
  try {
    // Write the buffer to a temporary file
    const tempFilePath = path.join(os.tmpdir(), `temp_audio_${Date.now()}.mp3`);
    await writeFileAsync(tempFilePath, buffer);

    const backgroundArg = backgroundFilePath ? ` "${backgroundFilePath}"` : "";
    // Execute the Python script using the temporary file path
    const { stdout } = await execAsync(`python3 audio_processing/mix_bg_and_tts.py "${tempFilePath}"` + backgroundArg);
    const outputPath = stdout.trim(); // The Python script outputs the path of the processed file

    // Read the processed audio file into a buffer
    const outputBuffer = await readFileAsync(outputPath);

    // Clean up temporary files
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(outputPath);

    return { buffer: outputBuffer, mimeType: "audio/mpeg" };

  } catch (error) {
    throw new Error(`Failed to process audio with Python script: ${error}`);
  }
};
