import OpenAI from "openai"

// Lazy initialization to avoid build-time errors
let openaiClient: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}

// Generate embedding for text using text-embedding-3-small
export async function generateEmbedding(text: string): Promise<number[]> {
  const openai = getOpenAI()
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    dimensions: 1536,
  })

  return response.data[0].embedding
}

// Generate article from TIL logs using GPT-4o-mini
export async function generateArticle(
  logs: { content: string; tags: string[] }[],
  options?: {
    title?: string
    style?: "tutorial" | "blog" | "documentation"
  }
): Promise<{ title: string; content: string }> {
  const openai = getOpenAI()
  const logsText = logs
    .map((log, i) => `[로그 ${i + 1}]\n${log.content}\n태그: ${log.tags.join(", ")}`)
    .join("\n\n")

  const styleGuide = {
    tutorial: "실습 위주의 튜토리얼 형식으로, 단계별로 설명해주세요.",
    blog: "개인적인 경험을 공유하는 블로그 형식으로, 친근하게 작성해주세요.",
    documentation: "공식 문서처럼 체계적이고 명확하게 작성해주세요.",
  }

  const systemPrompt = `당신은 기술 블로그 작성 전문가입니다.
사용자가 제공하는 짧은 학습 로그들을 바탕으로 하나의 완성된 기술 글을 작성해주세요.

작성 가이드:
- 마크다운 형식으로 작성
- 글의 구조: 서론 → 본론 (각 주제별 섹션) → 결론
- 코드 예시가 있다면 포함
- 핵심 개념을 명확하게 설명
- ${styleGuide[options?.style || "blog"]}`

  const userPrompt = options?.title
    ? `제목: ${options.title}\n\n다음 학습 로그들을 바탕으로 글을 작성해주세요:\n\n${logsText}`
    : `다음 학습 로그들을 바탕으로 글을 작성해주세요. 적절한 제목도 만들어주세요:\n\n${logsText}`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  })

  const content = response.choices[0].message.content || ""

  // Extract title from the generated content if not provided
  let title = options?.title || ""
  if (!title) {
    const titleMatch = content.match(/^#\s+(.+)$/m)
    title = titleMatch ? titleMatch[1] : "제목 없음"
  }

  return { title, content }
}

// Suggest tags for content
export async function suggestTags(content: string): Promise<string[]> {
  const openai = getOpenAI()
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `당신은 기술 태그 추천 전문가입니다.
주어진 학습 로그 내용을 분석하여 관련 기술 태그를 추천해주세요.
태그는 소문자로, 하이픈으로 연결된 형태로 반환해주세요.
최대 5개까지만 추천하고, JSON 배열 형태로 반환해주세요.
예: ["react", "typescript", "next-js", "tailwind-css"]`,
      },
      { role: "user", content },
    ],
    temperature: 0.3,
    max_tokens: 100,
  })

  try {
    const tagsText = response.choices[0].message.content || "[]"
    return JSON.parse(tagsText)
  } catch {
    return []
  }
}
