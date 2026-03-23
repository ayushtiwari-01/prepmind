import mongoose from "mongoose"

const knowledgeSchema = new mongoose.Schema({

  text: {
    type: String,
    required: true
  },

  vector: {
    type: [Number],
    required: true
  },

  source: {
    type: String
  }

})

export default mongoose.model("KnowledgeChunk", knowledgeSchema)