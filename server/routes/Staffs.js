const express = require("express");
const bcrypt = require("bcryptjs");
const { Staffs } = require("../models");
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

  if (!['admin', 'teacher'].includes(role)) {
    return res.status(400).json({ error: "Invalid role specified" });
  }

  next();
};

/// ✅ Register Route
router.post("/register", validateRegisterInput, async (req, res) => {
  try {
    const { fullName, email, phone, schoolName, role, password } = req.body;

    // Check for existing staff based on email only
    const existingStaff = await Staffs.findOne({ where: { email } });
    if (existingStaff) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create staff
    const newStaff = await Staffs.create({
      fullName,
      email,
      phone,
      schoolName,
      role,
      password: hashedPassword,
    });

    const staffResponse = {
      id: newStaff.id,
      fullName: newStaff.fullName,
      email: newStaff.email,
      phone: newStaff.phone,
      schoolName: newStaff.schoolName,
      role: newStaff.role,
      createdAt: newStaff.createdAt
    };

    return res.status(201).json({ message: "Staff registered successfully", staff: staffResponse });
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

    // Find staff
    const staff = await Staffs.findOne({ where: { email }, attributes: ['id', 'fullName', 'email', 'phone', 'schoolName', 'role', 'password'] });
    if (!staff) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = createToken(staff);

    const staffData = {
      id: staff.id,
      fullName: staff.fullName,
      email: staff.email,
      phone: staff.phone,
      schoolName: staff.schoolName,
      role: staff.role
    };

    return res.json({ message: "Login successful", token, staff: staffData });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get Current Staff Profile
router.get("/me", ValidateToken, async (req, res) => {
  try {
    const staff = await Staffs.findByPk(req.user.id, { attributes: ['id', 'fullName', 'email', 'phone', 'schoolName', 'role'] });
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }
    res.json(staff);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get Staffs by School (Admins only)
router.get("/staffs", ValidateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const staffs = await Staffs.findAll({
      where: { schoolName: req.user.schoolName },
      attributes: ['id', 'fullName', 'email', 'phone', 'role', 'createdAt']
    });

    res.json(staffs);
  } catch (error) {
    console.error("Get staffs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
