import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import User from "../models/User.js"

const generateToken = (userId)=>{
    return jwt.sign(
        {id:userId},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    )
}

export const signup = async (req,res)=>{

    try{

        const {name,email,password} = req.body

        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const user = await User.create({
            name,
            email,
            password:hashedPassword
        })

        const token = generateToken(user._id)

        res.json({
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        })

    }catch(error){

        res.status(500).json({
            message:"Signup failed"
        })

    }

}

export const login = async (req,res)=>{

    try{

        const {email,password} = req.body

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({
                message:"Invalid credentials"
            })
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({
                message:"Invalid credentials"
            })
        }

        const token = generateToken(user._id)

        res.json({
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        })

    }catch(error){

        res.status(500).json({
            message:"Login failed"
        })

    }

}

export const getMe = async (req,res)=>{

    try{

        const user = await User.findById(req.user.id).select("-password")

        res.json(user)

    }catch(error){

        res.status(500).json({
            message:"Error fetching user"
        })

    }

}

export const logout = async (req,res)=>{

    res.json({
        message:"Logged out successfully"
    })

}

export const updateSettings = async (req, res) => {

  try {

    const { name, email, difficulty, dailyGoal } = req.body

    const updateFields = {}

    if (name) updateFields.name = name
    if (email) updateFields.email = email
    if (difficulty) updateFields.defaultDifficulty = difficulty
    if (typeof dailyGoal === "number") updateFields.dailyGoal = dailyGoal

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true }
    ).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        defaultDifficulty: user.defaultDifficulty,
        dailyGoal: user.dailyGoal
      }
    })

  } catch (error) {

    console.error("Update settings error:", error.message)

    res.status(500).json({ message: "Failed to update settings" })

  }

}

export const changePassword = async (req, res) => {

  try {

    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required"
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters"
      })
    }

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)

    await user.save()

    res.json({ message: "Password changed successfully" })

  } catch (error) {

    console.error("Change password error:", error.message)

    res.status(500).json({ message: "Failed to change password" })

  }

}