import jwt from "jsonwebtoken"

const protect = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization

    // Check if header exists and starts with Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, no token provided"
      })
    }

    // Extract token
    const token = authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        message: "Token missing"
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user info to request
    req.user = decoded

    next()

  } catch (error) {

    console.error("Auth middleware error:", error.message)

    return res.status(401).json({
      message: "Invalid or expired token"
    })

  }

}

export default protect