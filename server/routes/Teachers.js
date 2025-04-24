const express = require("express");
const bcrypt = require("bcryptjs");
const { Teachers } = require("../models");
const { createToken,ValidateToken } = require("../utils/jwt");
const router = express.Router();

// Input validation middleware
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

// Generate teacher number
const generateTeacherNumber = () => {
  const prefix = 'T';
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return prefix + randomNumber;
};

// ✅ Register Teacher
router.post("/register", ValidateToken, validateRegisterInput, async (req, res) => {
  try {
    const { fullName, email, phone, subject, password, teacherNumber } = req.body;
    const adminId = req.user.id; // Assuming only admin can register

    const generatedTeacherNumber = teacherNumber || generateTeacherNumber();

    const existingTeacher = await Teachers.findOne({ where: { email } });
    if (existingTeacher) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newTeacher = await Teachers.create({
      fullName,
      email,
      phone,
      subject,
      teacherNumber: generatedTeacherNumber,
      password: hashedPassword,
      adminId
    });

    res.status(201).json({ message: "Teacher registered successfully", teacher: newTeacher });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Login Teacher
router.post("/login", async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone number is required" });
    }

    const teacher = await Teachers.findOne({
      where: email ? { email } : { phone },
      attributes: ["id", "fullName", "email", "phone", "subject"],
    });

    if (!teacher) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = createToken(teacher);

    const teacherData = {
      id: teacher.id,
      fullName: teacher.fullName,
      email: teacher.email,
      phone: teacher.phone,
      subject: teacher.subject,
    };

    res.json({ message: "Login successful", token, teacher: teacherData });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get Current Teacher
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

// ✅ Get All Teachers 
router.get('/teachers', async (req, res) => {

  try {
    const teachers = await Teachers.findAll();

    if (teachers.length === 0) {
      return res.status(404).json({ message: 'No teachers found for this admin.' });
    }

    res.status(200).json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});




// ✅ Get Single Teacher by ID
router.get("/:id", ValidateToken, async (req, res) => {
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
