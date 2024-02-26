import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

const processAudioWithPythonScript = async (ttsFilePath, backgroundFilePath) => {
  try {
    const { stdout } = await execAsync(`python3 src_audio_fx/mix_bg_and_tts.py "${ttsFilePath}" "${backgroundFilePath}"`);
    return stdout.trim(); // The Python script outputs the path of the processed file
  } catch (error) {
    throw new Error(`Failed to process audio with Python script: ${error}`);
  }
};

