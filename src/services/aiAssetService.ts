import axios from 'axios';
import { API_CONFIG } from '../config/apiKeys';
import toast from 'react-hot-toast';

export class AIAssetService {
  // 1. AI Image Generation using Hugging Face
  static async generateImage(prompt: string, style: string = 'realistic'): Promise<string> {
    try {
      // Check if Hugging Face API key is configured
      if (API_CONFIG.HUGGING_FACE.apiKey === 'hf_YOUR_TOKEN_HERE') {
        throw new Error('Hugging Face API key not configured');
      }

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

  // 2. AI Sound Generation using Replicate
  static async generateSound(prompt: string, duration: number = 5): Promise<string> {
    try {
      // Check if Replicate API key is configured
      if (!API_CONFIG.REPLICATE.apiKey || API_CONFIG.REPLICATE.apiKey === 'r8_YOUR_TOKEN_HERE') {
        throw new Error('Replicate API key not configured');
      }

      console.log('Generating sound with Replicate API...');
      console.log('API Key:', API_CONFIG.REPLICATE.apiKey.substring(0, 10) + '...');

      // Use a different model for sound generation
      const response = await axios.post(
        `${API_CONFIG.REPLICATE.endpoint}/predictions`,
        {
          version: "facebook/musicgen:7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906",
          input: {
            model_version: "melody",
            prompt: prompt,
            duration: duration,
            temperature: 1,
            top_k: 250,
            top_p: 0,
            seed: -1,
            continuation: false,
            continuation_start: 0,
            continuation_end: 0
          }
        },
        {
          headers: {
            'Authorization': `Token ${API_CONFIG.REPLICATE.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Replicate response:', response.data);

      // Poll for completion
      const predictionId = response.data.id;
      return await this.pollReplicateResult(predictionId);
    } catch (error: any) {
      console.error('Sound generation failed:', error);
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        toast.error('Invalid Replicate API key - please check your configuration');
      } else if (error.response?.status === 402) {
        toast.error('Replicate API quota exceeded - please check your billing');
      } else {
        toast.error('Sound generation failed - using placeholder audio');
      }
      
      // Fallback to generated audio data
      const fallbackAudio = this.generateFallbackAudio(duration);
      return fallbackAudio;
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

  // 3. AI Music Generation
  static async generateMusic(prompt: string, duration: number = 30): Promise<string> {
    try {
      // Check if Replicate API key is configured
      if (!API_CONFIG.REPLICATE.apiKey || API_CONFIG.REPLICATE.apiKey === 'r8_YOUR_TOKEN_HERE') {
        throw new Error('Replicate API key not configured');
      }

      console.log('Generating music with Replicate API...');

      const response = await axios.post(
        `${API_CONFIG.REPLICATE.endpoint}/predictions`,
        {
          version: "facebook/musicgen:7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906",
          input: {
            model_version: "large",
            prompt: prompt,
            duration: Math.min(duration, 30), // Limit to 30 seconds for free tier
            temperature: 1,
            top_k: 250,
            top_p: 0,
            seed: -1
          }
        },
        {
          headers: {
            'Authorization': `Token ${API_CONFIG.REPLICATE.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const predictionId = response.data.id;
      return await this.pollReplicateResult(predictionId);
    } catch (error: any) {
      console.error('Music generation failed:', error);
      
      if (error.response?.status === 401) {
        toast.error('Invalid Replicate API key - please check your configuration');
      } else if (error.response?.status === 402) {
        toast.error('Replicate API quota exceeded - please check your billing');
      } else {
        toast.error('Music generation failed - using placeholder audio');
      }
      
      return this.generateFallbackAudio(duration);
    }
  }

  // 4. AI Image Generation using OpenAI (DALL·E)
  static async generateImageWithOpenAI(prompt: string): Promise<string> {
    try {
      if (!API_CONFIG.OPENAI.apiKey) {
        throw new Error('OpenAI API key not configured');
      }
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