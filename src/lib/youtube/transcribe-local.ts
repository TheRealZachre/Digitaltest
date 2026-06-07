import { readFile } from "fs/promises";
import { pipeline } from "@xenova/transformers";
import { WaveFile } from "wavefile";

let transcriberPromise: ReturnType<typeof pipeline> | null = null;

function getLocalTranscriber() {
  if (!transcriberPromise) {
    transcriberPromise = pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-tiny.en"
    );
  }
  return transcriberPromise;
}

function loadWavSamples(buffer: Buffer): Float32Array {
  const wav = new WaveFile(buffer);
  wav.toBitDepth("32f");
  wav.toSampleRate(16000);
  const raw = wav.getSamples();

  const mono = Array.isArray(raw) ? raw[0] : raw;
  if (!mono || mono.length === 0) {
    throw new Error("Could not decode audio for local transcription.");
  }

  return mono instanceof Float32Array
    ? mono
    : Float32Array.from(mono as ArrayLike<number>);
}

type LocalTranscriber = (
  audio: Float32Array,
  options?: { chunk_length_s?: number; stride_length_s?: number }
) => Promise<{ text?: string } | string>;

export async function transcribeLocalWavFile(wavPath: string): Promise<string> {
  const transcriber = (await getLocalTranscriber()) as LocalTranscriber;
  const buffer = await readFile(wavPath);
  const audioData = loadWavSamples(buffer);

  const output = await transcriber(audioData, {
    chunk_length_s: 30,
    stride_length_s: 5,
  });

  const text =
    typeof output === "string"
      ? output
      : ((output as { text?: string }).text ?? "");

  return text.trim();
}
