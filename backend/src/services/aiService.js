import { retrieveRelevantQuestions } from "./ragService.js"
import dotenv from "dotenv"
dotenv.config()

import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})



export const generateQuestionAI = async (topic, difficulty) => {

  try {

    const relatedQuestions = await retrieveRelevantQuestions(topic)

    const context = relatedQuestions.join("\n")

    const prompt = `
You are an expert technical interviewer.

Topic: ${topic}
Difficulty: ${difficulty}

Here are some similar interview questions:

${context}

Generate ONE new technical interview question related to these.

Return JSON in this format:

{
 "question": "string",
 "difficulty": "string",
 "category": "string",
 "tags": ["string","string"]
}
`

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a technical interviewer." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 300
    })

    const response = completion.choices[0].message.content

    return JSON.parse(response)

  } catch (error) {

    console.error("Generate Question AI Error:", error)

    throw new Error("AI question generation failed")

  }

}


export const evaluateAnswerAI = async (question, answer) => {

  try {

    const prompt = `
Evaluate the following technical interview answer.

Question:
${question}

Candidate Answer:
${answer}

Return ONLY valid JSON in this format:

{
 "score": number (0-10),
 "strengths": ["string","string"],
 "improvements": ["string","string"]
}
`

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a senior technical interviewer evaluating candidate responses."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 400,
      temperature: 0.6
    })

    const response = completion.choices[0].message.content

    try {
      return JSON.parse(response)
    } catch {
      const jsonStart = response.indexOf("{")
      const jsonEnd = response.lastIndexOf("}") + 1
      const cleaned = response.substring(jsonStart, jsonEnd)
      return JSON.parse(cleaned)
    }

  } catch (error) {

    console.error("Evaluate Answer AI Error:", error)

    throw new Error("AI evaluation failed")

  }

}

export const analyzeResumeAI = async (resumeText, role) => {

  try {

    const prompt = `
You are a technical recruiter hiring for the role of ${role}.

Analyze the following resume and evaluate how suitable the candidate is for this role.

Resume:
${resumeText}

Return JSON in this format:

{
 "score": number,
 "strengths": ["string","string"],
 "weaknesses": ["string","string"],
 "missingSkills": ["string","string"],
 "suggestions": ["string","string"]
}
`

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are an expert technical recruiter." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
      temperature: 0.6
    })

    const response = completion.choices[0].message.content

    return JSON.parse(response)

  } catch (error) {

    console.error("Resume AI Error:", error)

    throw new Error("Resume AI analysis failed")

  }

}