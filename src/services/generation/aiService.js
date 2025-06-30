// AI API call logic for GameGenerator

import axios from 'axios';
import { API_CONFIG } from '../../config/apiKeys';

export async function callTogetherAI(messages, max_tokens = 4000, temperature = 0.7) {
  const response = await axios.post(
    API_CONFIG.TOGETHER_AI.endpoint,
    {
      model: API_CONFIG.TOGETHER_AI.model,
      messages,
      max_tokens,
      temperature
    },
    {
      headers: {
        'Authorization': `Bearer ${API_CONFIG.TOGETHER_AI.apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
}
