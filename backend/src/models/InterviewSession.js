import mongoose from "mongoose"

const interviewSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  topic: {
    type: String
  },
  
  difficulty:{
  type:String,
  default:"Medium"
  },

  questions: [
    {
      question: String,
      difficulty:String,
      answer: String,
      score: Number,
      percentage:Number,
      strengths: [String],
      improvements: [String]
    }
  ],

  currentQuestion: {
    type: Number,
    default: 0
  },

  completed: {
    type: Boolean,
    default: false
  }

}, { timestamps: true })

export default mongoose.model("InterviewSession", interviewSchema)