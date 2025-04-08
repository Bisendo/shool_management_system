const express = require("express");
const bcrypt = require("bcryptjs");
const { Teachers } = require("../models");
const { createToken, ValidateToken } = require("../utils/jwt"); // Import token utilities
const { Op } = require("sequelize");
const router = express.Router();

// Input validation middleware for teacher registration
const validateRegisterInput = (req, res, next) => {
  const { fullName, email, phone, subject, password, confirmPassword } = req.body;

  if (!fullName || !email || !phone || !subject || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  next();
};

// Generate a teacher number if not provided
const generateTeacherNumber = () => {
    const prefix = 'T'; // You can adjust this
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    return prefix + randomNumber;
  };
  
  // Registration Route
  router.post("/register", validateRegisterInput, async (req, res) => {
    try {
      const { fullName, email, phone, subject, password, teacherNumber } = req.body;
  
      // Check if teacherNumber is provided, if not, generate one
      const generatedTeacherNumber = teacherNumber || generateTeacherNumber();
  
      // Check for existing teacher based on email
      const existingTeacher = await Teachers.findOne({ where: { email } });
      if (existingTeacher) {
        return res.status(409).json({ error: "Email already exists" });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
  
      // Create new teacher
      const newTeacher = await Teachers.create({
        fullName,
        email,
        phone,
        subject,
        teacherNumber: generatedTeacherNumber, // Use generated or provided teacher number
        password: hashedPassword,
      });
  
      return res.status(201).json({ message: "Teacher registered successfully", teacher: newTeacher });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
// ✅ Login Teacher Route
router.post("/login", async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone number is required" });
    }

    // Find the teacher by email or phone
    const teacher = await Teachers.findOne({
      where: email ? { email } : { phone },
      attributes: ["id", "fullName", "email", "phone", "subject"],
    });

    if (!teacher) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token for the teacher
    const token = createToken(teacher);

    const teacherData = {
      id: teacher.id,
      fullName: teacher.fullName,
      email: teacher.email,
      phone: teacher.phone,
      subject: teacher.subject,
    };

    return res.json({ message: "Login successful", token, teacher: teacherData });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// ✅ Get Current Teacher Profile
router.get("/me", ValidateToken, async (req, res) => {
  try {
    const teacher = await Teachers.findByPk(req.user.id, {
      attributes: ["id", "fullName", "email", "phone", "subject"],
    });
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get All Teachers (Admins only)
router.get("/teachers", ValidateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const teachers = await Teachers.findAll({
      attributes: ["id", "fullName", "email", "phone", "subject", "createdAt"],
    });

    res.json(teachers);
  } catch (error) {
    console.error("Get teachers error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Get a single teacher by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teachers.findByPk(id);
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
