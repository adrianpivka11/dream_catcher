import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function getDreamInterpretation(dreamText) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Server misconfigured: OPENAI_API_KEY is missing');
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  try {
    const message = await openai.chat.completions.create({
      model,
      max_completion_tokens: 1200,
      messages: [
        {
          role: 'system',
          content: `You are a thoughtful dream interpreter.
             Be insightful but gentle, and consider common dream symbolism.
              Keep your interpretation to 2-3 paragraphs.`
        },
        {
          role: 'user',
          content: `Dream: ${dreamText}`
        }
      ]
    });

    const content = message.choices?.[0]?.message?.content;

    console.log('OpenAI finish reason:', message.choices?.[0]?.finish_reason);
    console.log('OpenAI usage:', message.usage);

    if (!content || !content.trim()) {
      throw new Error('OpenAI returned empty interpretation');
    }

    return content.trim();

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`API error: ${error.message}`);
  }
}