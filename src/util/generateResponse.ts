import OpenAI from 'openai'

const baseURL = process.env.OPENAI_BASE_URL
const apiKey = process.env.OPENAI_API_KEY

if (baseURL === undefined) throw new Error('OPENAI_BASE_URL is missing!')
if (apiKey === undefined) throw new Error('OPENAI_API_KEY is missing!')

const openai = new OpenAI({ apiKey, baseURL })

async function generateResponse(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
): Promise<string> {
  const chatCompletion = await openai.chat.completions.create({
    messages: messages,
    model: 'local',
    temperature: 0.7,
  })

  let response = chatCompletion.choices[0].message.content ?? 'Empty Response...'

  if (response.length > 1900) {
    response = response.substring(0, 1900)
  }

  return response
}

export default generateResponse
