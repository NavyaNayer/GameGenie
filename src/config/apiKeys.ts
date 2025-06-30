// API Configuration - Replace with your actual API keys
export const API_CONFIG = {
  // Together AI (already configured)
  TOGETHER_AI: {
    apiKey: 'tgp_v1_ft3sc3-Tbdqy9xtVnycCuOTvsayaD-39nf4zQDadH5I',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free'
  },

  // Hugging Face (FREE) - Get from https://huggingface.co/settings/tokens
  HUGGING_FACE: {
    apiKey: 'hf_YOUR_TOKEN_HERE', // Replace with your HF token
    endpoint: 'https://api-inference.huggingface.co/models'
  },

  // Replicate (FREE tier) - Get from https://replicate.com/account/api-tokens
  REPLICATE: {
    apiKey: 'r8_ILYcPrZs2Fuq08A0pQDITAbKMiYKTwA0vQUqd', // Updated with your Replicate token
    endpoint: 'https://api.replicate.com/v1'
  },

  // Supabase (FREE tier) - Get from your Supabase project
  SUPABASE: {
    url: 'YOUR_SUPABASE_URL', // Replace with your project URL
    anonKey: 'YOUR_SUPABASE_ANON_KEY' // Replace with your anon key
  },

  // OpenAI (Optional) - Get from https://platform.openai.com/api-keys
  OPENAI: {
    apiKey: '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', // Replace with your OpenAI key (optional)
    endpoint: 'https://api.openai.com/v1'
  }
};

// Validation function
export const validateApiKeys = () => {
  const missing = [];
  
  if (API_CONFIG.HUGGING_FACE.apiKey === 'hf_YOUR_TOKEN_HERE') {
    missing.push('Hugging Face API key');
  }
  
  if (API_CONFIG.REPLICATE.apiKey === 'r8_YOUR_TOKEN_HERE') {
    missing.push('Replicate API key');
  }
  
  if (API_CONFIG.SUPABASE.url === 'YOUR_SUPABASE_URL') {
    missing.push('Supabase configuration');
  }
  
  return missing;
};