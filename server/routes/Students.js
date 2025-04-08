const express = require("express");
const router = express.Router();
const { Students, Teachers } = require("../models");
const multer = require("multer");
const path = require("path");
const { ValidateToken } = require("../utils/jwt");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png) are allowed"));
  }
});

// Create student
router.post("/", ValidateToken, upload.single("passport"), async (req, res) => {
  try {
    const { fullName, grade, rollNumber, phone, parentName, parentContact } = req.body;
    const teacherId = req.user.id;

    if (!fullName || !grade || !rollNumber) {
      return res.status(400).json({ error: "Full name, grade, and roll number are required" });
    }

    const picture = req.file ? `/uploads/${req.file.filename}` : null;

    const student = await Students.create({
      fullName, 
      grade, 
      rollNumber, 
      phone, 
      parentName, 
      parentContact, 
      picture, 
      teacherId
    });

    res.status(201).json(student);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

router.get("/", ValidateToken, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { search } = req.query;

    let whereClause = { teacherId };
    
    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { fullName: { [Op.like]: `%${search}%` } },
          { grade: { [Op.like]: `%${search}%` } },
          { rollNumber: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    // Fetch students based on search criteria
    const students = await Students.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      include: [{ model: Teachers, as: "Teacher", attributes: ['id', 'fullName'] }]
    });

    // Fetch the total number of students based on the search criteria
    const totalStudents = await Students.count({
      where: whereClause
    });

    // Return both the list of students and the total count
    res.json({
      totalStudents,
      students
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update student
router.put("/:id", ValidateToken, upload.single("passport"), async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;
    const { fullName, grade, rollNumber, phone, parentName, parentContact } = req.body;

    const student = await Students.findOne({ 
      where: { id, teacherId } 
    });
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const picture = req.file ? `/uploads/${req.file.filename}` : student.picture;

    await student.update({ 
      fullName, 
      grade, 
      rollNumber, 
      phone, 
      parentName, 
      parentContact, 
      picture 
    });

    res.json(student);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete student
router.delete("/:id", ValidateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;

    const student = await Students.findOne({ 
      where: { id, teacherId } 
    });
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    await student.destroy();
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;