import axios from 'axios';
import { API_CONFIG } from '../config/apiKeys';

export class AICodeAssistant {
  static async analyzeCode(code: string, prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        API_CONFIG.TOGETHER_AI.endpoint,
        {
          model: API_CONFIG.TOGETHER_AI.model,
          messages: [
            {
              role: 'system',
              content: `You are an expert game prototyping assistant and code reviewer. Analyze the provided prototype code and give helpful suggestions, optimizations, and fixes. Focus on:
              - Code quality and best practices for rapid prototyping
              - Performance optimizations
              - Bug fixes and potential issues
              - Prototype-specific improvements
              - Security considerations
              
              Provide your response in a structured format with clear sections.`
            },
            {
              role: 'user',
              content: `Please analyze this game code and provide suggestions:

**User Request:** ${prompt}

**Code to analyze:**
\`\`\`javascript
${code}
\`\`\`

Please provide specific, actionable feedback.`
            }
          ],
          max_tokens: 2000,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${API_CONFIG.TOGETHER_AI.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Code analysis failed:', error);
      throw new Error('Failed to analyze code. Please try again.');
    }
  }

  static async generateCodeFix(code: string, issue: string): Promise<string> {
    try {
      const response = await axios.post(
        API_CONFIG.TOGETHER_AI.endpoint,
        {
          model: API_CONFIG.TOGETHER_AI.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert JavaScript game prototyper. Fix the provided prototype code based on the described issue. Return only the corrected code without explanations.'
            },
            {
              role: 'user',
              content: `Fix this issue in the game code:

**Issue:** ${issue}

**Code:**
\`\`\`javascript
${code}
\`\`\`

Return the corrected code:`
            }
          ],
          max_tokens: 3000,
          temperature: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${API_CONFIG.TOGETHER_AI.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Code fix failed:', error);
      throw new Error('Failed to generate code fix. Please try again.');
    }
  }
}