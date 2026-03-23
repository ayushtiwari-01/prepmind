import { createRequire } from "module"
const require = createRequire(import.meta.url)
const PDFParser = require("pdf2json")

import KnowledgeChunk from "../models/KnowledgeChunk.js"
import { embed } from "../services/ragService.js"

const extractTextFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser({})

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const text = pdfData.Pages
        .flatMap(page => page.Texts)
        .map(t => {
          try {
            return decodeURIComponent(t.R.map(r => r.T).join(""))
          } catch {
            return t.R.map(r => r.T).join("")
          }
        })
        .join(" ")
      resolve(text)
    })

    pdfParser.on("pdfParser_dataError", reject)
    pdfParser.parseBuffer(buffer)
  })
}

export const uploadKnowledge = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file required" })
    }

    const text = await extractTextFromBuffer(req.file.buffer)

    const chunks = text
      .split(/\n+/)
      .map(t => t.trim())
      .filter(t => t.length > 50)

    const storedChunks = []

    for (const chunk of chunks) {
      const vector = await embed(chunk)

      const doc = await KnowledgeChunk.create({
        text: chunk,
        vector,
        source: req.file.originalname
      })

      storedChunks.push(doc)
    }

    res.json({
      message: "Knowledge uploaded",
      chunksStored: storedChunks.length
    })

  } catch (error) {
    console.error("Knowledge upload error:", error)
    res.status(500).json({ message: "Upload failed" })
  }
}