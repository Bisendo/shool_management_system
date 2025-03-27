const express = require("express");
const bcrypt = require("bcryptjs");
const { Users } = require("../models");
const { Op } = require("sequelize");
const { createToken, ValidateToken } = require("../utils/jwt");
const router = express.Router();

// Input validation middleware
const validateRegisterInput = (req, res, next) => {
  const { fullName, email, phone, schoolName, role, password, confirmPassword } = req.body;

  if (!fullName || !email || !phone || !schoolName || !role || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  if (!['admin', 'teacher', 'student'].includes(role)) {
    return res.status(400).json({ error: "Invalid role specified" });
  }

  next();
};

// ✅ Register Route
router.post("/register", validateRegisterInput, async (req, res) => {
  try {
    const { fullName, email, phone, schoolName, role, password } = req.body;

    // Check for existing user
    const existingUser = await Users.findOne({
      where: {
        [Op.or]: [{ email }, { phone }]
      }
    });

    if (existingUser) {
      return res.status(409).json({ 
        error: "User already exists",
        conflicts: {
          email: existingUser.email === email,
          phone: existingUser.phone === phone
        }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await Users.create({
      fullName,
      email,
      phone,
      schoolName,
      role,
      password: hashedPassword,
    });

    // Omit password from response
    const userResponse = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      schoolName: newUser.schoolName,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    return res.status(201).json({ 
      message: "User registered successfully", 
      user: userResponse 
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await Users.findOne({ 
      where: { email },
      attributes: ['id', 'fullName', 'email', 'phone', 'schoolName', 'role', 'password']
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = createToken(user);

    // Prepare user data for response (without password)
    const userData = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      schoolName: user.schoolName,
      role: user.role
    };

    return res.json({
      message: "Login successful",
      token,
      user: userData
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get Current User Profile
router.get("/me", ValidateToken, async (req, res) => {
  try {
    const user = await Users.findByPk(req.user.id, {
      attributes: ['id', 'fullName', 'email', 'phone', 'schoolName', 'role']
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get Users by School (Teachers/Admins only)
router.get("/users", ValidateToken, async (req, res) => {
  try {
    // Only allow admins and teachers to access this endpoint
    if (!['admin', 'teacher'].includes(req.user.role)) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const users = await Users.findAll({
      where: { 
        schoolName: req.user.schoolName,
        // Optionally filter by role if query parameter provided
        ...(req.query.role && { role: req.query.role })
      },
      attributes: ['id', 'fullName', 'email', 'phone', 'role', 'createdAt']
    });

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;