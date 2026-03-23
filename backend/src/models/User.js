import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String
    },

    googleId:{
        type:String
    },

    defaultDifficulty:{
        type:String,
        default:"Medium"
    },

    dailyGoal:{
        type:Number,
        default:5
    }

},
{timestamps:true}
)

export default mongoose.model("User",userSchema)