const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Users, Students } = require("../models");
const { ValidateToken } = require("../utils/jwt");
const { Op } = require("sequelize");

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size 5MB
});

// Middleware to validate token
router.use(ValidateToken);

// Fetch students with pagination & search
router.get("/dashboard", async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereCondition = { adminId: req.user.id };

    if (search) {
      whereCondition[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { grade: { [Op.like]: `%${search}%` } },
        { rollNumber: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: students } = await Students.findAndCountAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: ['id', 'fullName', 'grade', 'rollNumber', 'phone', 'parentName', 'parentContact', 'picture', 'createdAt']
    });

    res.json({
      totalStudents: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      students: students.map(student => ({
        ...student.get(),
        picture: student.picture ? `${req.protocol}://${req.get('host')}/uploads/${student.picture}` : null
      }))
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

// Add student with image upload
router.post("/addstudent", upload.single("passport"), async (req, res) => {
  try {
    const { fullName, grade, rollNumber, phone, parentName, parentContact } = req.body;

    if (!fullName || !grade || !rollNumber || !phone) {
      if (req.file) fs.unlinkSync(path.join(uploadDir, req.file.filename));
      return res.status(400).json({ error: "All fields are required" });
    }

    const newStudent = await Students.create({
      fullName, grade, rollNumber, phone, parentName, parentContact,
      picture: req.file?.filename || null,
      adminId: req.user.id
    });

    res.status(201).json({
      message: "Student added successfully",
      student: { ...newStudent.get(), picture: req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add student" });
  }
});

// Fetch all students for an admin
router.get("/getstudents", async (req, res) => {
  try {
    const students = await Students.findAll({
      where: { adminId: req.user.id },
      order: [["createdAt", "DESC"]],
      attributes: ['id', 'fullName', 'grade', 'rollNumber', 'phone', 'parentName', 'parentContact', 'picture', 'createdAt']
    });

    res.json({
      success: true,
      data: students.map(student => ({
        ...student.get(),
        picture: student.picture ? `${req.protocol}://${req.get('host')}/uploads/${student.picture}` : null
      })),
      message: "Students retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve students" });
  }
});

// Delete student by ID
router.delete("/deletestudent/:id", async (req, res) => {
  try {
    const student = await Students.findOne({ where: { id: req.params.id, adminId: req.user.id } });
    if (!student) return res.status(404).json({ error: "Student not found" });

    if (student.picture) {
      const filePath = path.join(uploadDir, student.picture);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await student.destroy();
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete student" });
  }
});

// Get total number of students created by an admin
router.get("/students/total", async (req, res) => {
  try {
    const totalStudents = await Students.count({ where: { adminId: req.user.id } });
    res.json({ success: true, totalStudents, message: "Total students retrieved" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch total students" });
  }
});

module.exports = router;
