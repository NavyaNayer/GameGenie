import axios from 'axios';
import { API_CONFIG } from '../config/apiKeys';
import toast from 'react-hot-toast';

export class AIAssetService {
  // 1. AI Image Generation using Hugging Face
  static async generateImage(prompt: string, style: string = 'realistic'): Promise<string> {
    try {
      const response = await axios.post(
        `${API_CONFIG.HUGGING_FACE.endpoint}/stabilityai/stable-diffusion-2-1`,
        {
          inputs: `${prompt}, ${style} style, high quality, detailed`,
          parameters: {
            negative_prompt: "blurry, low quality, distorted",
            num_inference_steps: 20,
            guidance_scale: 7.5
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${API_CONFIG.HUGGING_FACE.apiKey}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob'
        }
      );

      // Convert blob to data URL
      const blob = new Blob([response.data], { type: 'image/png' });
      return URL.createObjectURL(blob);
    } catch (error: any) {
      console.error('Image generation failed:', error);
      
      // Fallback to placeholder service
      const fallbackUrl = `https://picsum.photos/512/512?random=${Date.now()}&blur=1`;
      toast.error('Using placeholder image - check your Hugging Face API key');
      return fallbackUrl;
    }
  }

  // 2. Sound Search using Freesound.org (improved)
  static async generateSound(prompt: string): Promise<string> {
    const FREESOUND_API_KEY = API_CONFIG.FREESOUND.apiKey;
    if (!FREESOUND_API_KEY || FREESOUND_API_KEY === 'fs_YOUR_TOKEN_HERE') {
      toast.error('Freesound API key not configured');
      return '';
    }
    try {
      // Use only the core prompt for search
      const url = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(prompt)}&token=${FREESOUND_API_KEY}&fields=name,previews,license`;
      const response = await axios.get(url);
      const results = response.data.results;
      if (results && results.length > 0) {
        // Use the first result's preview mp3
        return results[0].previews['preview-hq-mp3'] || results[0].previews['preview-lq-mp3'];
      } else {
        toast.error('No matching sound found on Freesound.org');
        return '';
      }
    } catch (error: any) {
      console.error('Freesound sound search failed:', error);
      toast.error('Freesound sound search failed');
      return '';
    }
  }

  

  private static async pollReplicateResult(predictionId: string): Promise<string> {
    const maxAttempts = 60; // Increase timeout for longer operations
    let attempts = 0;

    console.log('Polling Replicate result for prediction:', predictionId);

    while (attempts < maxAttempts) {
      try {
        const response = await axios.get(
          `${API_CONFIG.REPLICATE.endpoint}/predictions/${predictionId}`,
          {
            headers: {
              'Authorization': `Token ${API_CONFIG.REPLICATE.apiKey}`
            }
          }
        );

        console.log(`Poll attempt ${attempts + 1}:`, response.data.status);

        if (response.data.status === 'succeeded') {
          console.log('Replicate generation succeeded:', response.data.output);
          return response.data.output;
        } else if (response.data.status === 'failed') {
          console.error('Replicate generation failed:', response.data.error);
          throw new Error(`Sound generation failed: ${response.data.error || 'Unknown error'}`);
        } else if (response.data.status === 'canceled') {
          throw new Error('Sound generation was canceled');
        }

        // Still processing, wait and try again
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
        attempts++;
      } catch (error: any) {
        console.error('Error polling Replicate result:', error);
        if (error.response?.status === 401) {
          throw new Error('Invalid Replicate API key');
        }
        throw error;
      }
    }

    throw new Error('Sound generation timeout - please try again');
  }

  private static generateFallbackAudio(duration: number): string {
    // Generate a simple sine wave audio
    const sampleRate = 44100;
    const samples = sampleRate * duration;
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples * 2, true);

    // Generate sine wave with some variation
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const frequency = 440 + Math.sin(t * 2) * 100; // Varying frequency
      const sample = Math.sin(2 * Math.PI * frequency * t) * 0.3 * Math.exp(-t * 0.5); // Decay
      view.setInt16(44 + i * 2, sample * 32767, true);
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }

  // 4. AI Image Generation using OpenAI (DALL·E)
  static async generateImageWithOpenAI(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        `${API_CONFIG.OPENAI.endpoint}/images/generations`,
        {
          prompt,
          n: 1,
          size: "512x512"
        },
        {
          headers: {
            'Authorization': `Bearer ${API_CONFIG.OPENAI.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data[0].url;
    } catch (error: any) {
      console.error('OpenAI image generation failed:', error);
      toast.error('OpenAI image generation failed');
      return `https://picsum.photos/512/512?random=${Date.now()}&blur=1`;
    }
  }

  // Test API key validity
  static async testReplicateKey(): Promise<boolean> {
    try {
      if (!API_CONFIG.REPLICATE.apiKey || API_CONFIG.REPLICATE.apiKey === 'r8_YOUR_TOKEN_HERE') {
        return false;
      }

      const response = await axios.get(
        `${API_CONFIG.REPLICATE.endpoint}/predictions`,
        {
          headers: {
            'Authorization': `Token ${API_CONFIG.REPLICATE.apiKey}`
          }
        }
      );

      return response.status === 200;
    } catch (error: any) {
      console.error('Replicate API key test failed:', error);
      return false;
    }
  }
}