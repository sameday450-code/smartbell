const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { uploadAudio } = require('../../config/cloudinary');
const logger = require('../../utils/logger');

/**
 * Generate TTS using ElevenLabs API
 */
const generateWithElevenLabs = async (text, voiceId) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voice = voiceId || process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';

  const response = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
    {
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    },
    {
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
      responseType: 'arraybuffer',
    }
  );

  return Buffer.from(response.data);
};

/**
 * Generate TTS using Google Cloud TTS
 */
const generateWithGoogle = async (text, languageCode = 'en-US') => {
  const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
  const client = new TextToSpeechClient();

  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: { languageCode, ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  });

  return Buffer.from(response.audioContent, 'binary');
};

/**
 * Main TTS generator — tries ElevenLabs first, falls back to Google
 */
const generateTTS = async (text, voiceId = null) => {
  let audioBuffer;
  const tempFile = path.join('uploads', `tts-${uuidv4()}.mp3`);

  try {
    if (process.env.ELEVENLABS_API_KEY) {
      audioBuffer = await generateWithElevenLabs(text, voiceId);
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      audioBuffer = await generateWithGoogle(text);
    } else {
      const err = new Error('No TTS provider configured');
      err.statusCode = 503;
      throw err;
    }

    fs.writeFileSync(tempFile, audioBuffer);
    const result = await uploadAudio(tempFile);
    fs.unlinkSync(tempFile);

    return result;
  } catch (err) {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    logger.error('TTS generation failed:', err.message);
    throw err;
  }
};

module.exports = { generateTTS };
