import axios from 'axios';
import { API_CONFIG } from '../config/apiKeys';

export class LlamaService {
  static async generateList(prompt: string, n: number = 5): Promise<string[]> {
    const systemPrompt = `You are a creative prototype designer. Given a prompt, generate a comma-separated list of ${n} unique, creative, and short names for prototype enemies or items that fit the theme or description.`;
    try {
      const response = await axios.post(
        API_CONFIG.TOGETHER_AI.endpoint,
        {
          model: API_CONFIG.TOGETHER_AI.model,
          max_tokens: 128,
          temperature: 0.8,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${API_CONFIG.TOGETHER_AI.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // Debug: log the full response for troubleshooting
      console.log('LlamaService API response:', response.data);
      const text = response.data.choices?.[0]?.message?.content || '';
      if (!text) {
        throw new Error('No content returned from Llama API. Full response: ' + JSON.stringify(response.data));
      }
      // Split by comma and trim
      return text.split(',').map((s: string) => s.trim()).filter(Boolean);
    } catch (error) {
      console.error('LlamaService error:', error);
      return [];
    }
  }
}
