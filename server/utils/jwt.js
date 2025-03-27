const { sign, verify, TokenExpiredError } = require("jsonwebtoken");

// ✅ Hardcoded JWT Secret Key
const JWT_SECRET_KEY = "jwtsecretplschange"; // ⚠️ Hakikisha umebadilisha hii kwa usalama zaidi

/**
 * ✅ Generate JWT Token
 * @param {Object} user - User details { fullName, id, role, schoolName }
 * @returns {string} - JWT Token
 */
const createToken = (user) => {
  try {
    return sign(
      { 
        fullName: user.fullName, 
        id: user.id, 
        role: user.role, 
        schoolName: user.schoolName 
      },
      JWT_SECRET_KEY,
      { expiresIn: "7d" } // Token expires in 7 days
    );
  } catch (error) {
    console.error("Error generating token:", error.message);
    throw new Error("Failed to generate token.");
  }
};

/**
 * ✅ Middleware for Validating JWT Token
 * @param {Request} req - Express Request Object
 * @param {Response} res - Express Response Object
 * @param {Function} next - Express Next Middleware Function
 */
const ValidateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token

  try {
    // ✅ Verify token
    req.user = verify(token, JWT_SECRET_KEY);
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired. Please log in again." });
    }
    return res.status(403).json({ error: "Invalid token!" });
  }
};

// ✅ Export functions
module.exports = { createToken, ValidateToken };
