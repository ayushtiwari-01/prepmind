import { interviewDataset } from "../data/interviewDataset.js"
import { pipeline } from "@xenova/transformers"
import KnowledgeChunk from "../models/KnowledgeChunk.js"

let extractor = null
let vectorStore = null

// Load embedding model once
const loadModel = async () => {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    )
  }
  return extractor
}

// Cosine similarity
const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  if (magA === 0 || magB === 0) return 0
  return dot / (magA * magB)
}

// Convert text → embedding
export const embed = async (text) => {
  const model = await loadModel()
  const output = await model(text)
  return Array.from(output.data)
}

// Build vector store once from dataset
export const initializeRAG = async () => {
  if (vectorStore) return vectorStore
  vectorStore = []
  for (const text of interviewDataset) {
    const vector = await embed(text)
    vectorStore.push({ text, vector })
  }
  return vectorStore
}

export const retrieveRelevantQuestions = async (topic, topK = 3) => {
  const store = await initializeRAG()

  // Fetch dynamic knowledge from DB and combine with static dataset
  const dbChunks = await KnowledgeChunk.find()
  const combinedStore = [
    ...store,
    ...dbChunks.map(c => ({ text: c.text, vector: c.vector }))
  ]

  const queryVector = await embed(topic)

  const results = combinedStore
    .map(item => ({
      text: item.text,
      score: cosineSimilarity(queryVector, item.vector)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)

  // Uncomment to debug retrieved context
  // console.log("RAG retrieved:", results)

  return results.map(item => item.text)
}