/**
 * Decodes a Base64 string into a Uint8Array
 */
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Wraps raw PCM data in a WAV container so it can be played by the browser's <audio> tag.
 * Assumes 24kHz sample rate and 1 channel (mono) based on Gemini default.
 */
function pcmToWav(pcmData: Uint8Array, sampleRate: number = 24000, numChannels: number = 1): Blob {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // RIFF chunk length
  view.setUint32(4, 36 + pcmData.length, true);
  // WAVE identifier
  writeString(view, 8, 'WAVE');
  // fmt chunk identifier
  writeString(view, 12, 'fmt ');
  // fmt chunk length
  view.setUint32(16, 16, true);
  // Sample format (1 is PCM)
  view.setUint16(20, 1, true);
  // Channel count
  view.setUint16(22, numChannels, true);
  // Sample rate
  view.setUint32(24, sampleRate, true);
  // Byte rate (sampleRate * blockAlign)
  view.setUint32(28, sampleRate * numChannels * 2, true);
  // Block align (channel count * bytes per sample)
  view.setUint16(32, numChannels * 2, true);
  // Bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, pcmData.length, true);

  return new Blob([header, pcmData], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export const createAudioBlobFromBase64 = (base64Data: string): string => {
  const pcmData = decodeBase64(base64Data);
  // Gemini TTS typically returns 24000Hz PCM
  const wavBlob = pcmToWav(pcmData, 24000, 1);
  return URL.createObjectURL(wavBlob);
};
