import { createRequire } from "module"
const require = createRequire(import.meta.url)
const PDFParser = require("pdf2json")

import { analyzeResumeAI } from "../services/aiService.js"

export const analyzeResume = async (req, res) => {
  try {

    const { role } = req.body

    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required"
      })
    }

    if (!role) {
      return res.status(400).json({
        message: "Target role is required"
      })
    }

    const resumeText = await new Promise((resolve, reject) => {

      const originalWarn = console.warn

      // Temporarily silence noisy pdf worker / form warnings only
      console.warn = (...args) => {
        const msg = typeof args[0] === "string" ? args[0] : ""
        if (
          msg.includes("Setting up fake worker") ||
          msg.includes("Unsupported: field.type of Link") ||
          msg.includes("NOT valid form element")
        ) {
          return
        }
        originalWarn(...args)
      }

      const cleanup = () => {
        console.warn = originalWarn
      }

      const pdfParser = new PDFParser()

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

        cleanup()
        resolve(text)

      })

      pdfParser.on("pdfParser_dataError", (err) => {
        cleanup()
        reject(err)
      })

      pdfParser.parseBuffer(req.file.buffer)

    })

    const analysis = await analyzeResumeAI(resumeText, role)

    res.status(200).json({
      role,
      ...analysis
    })

  } catch (error) {

    console.error("Resume analysis error:", error)

    res.status(500).json({
      message: "Resume analysis failed"
    })

  }
}