const express = require("express");
const router = express.Router();
const { Teachers, Users } = require("../models");
const jwt = require("jsonwebtoken");  // Ensure jwt is required here

// ✅ Register a New Teacher (Updated)
router.post("/register", async (req, res) => {
  const { name, subject, experience, email, phone } = req.body;

  try {
    if (!name || !subject || !experience || !email || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Normalize the email to lowercase for case-insensitive comparison
    const normalizedEmail = email.toLowerCase();

    // Check if teacher already exists with the normalized email
    let existingTeacher = await Teachers.findOne({ where: { email: normalizedEmail } });
    
    if (existingTeacher) {
      // If teacher exists, return success and allow access to the dashboard
      return res.status(200).json({
        message: "Teacher already exists, access granted to the dashboard",
        teacher: existingTeacher,
      });
    }

    // Check if phone exists in Users table (this ensures a foreign key constraint)
    const existingUser = await Users.findOne({ where: { phone } });
    if (!existingUser) {
      return res.status(400).json({ error: "Phone number does not exist in Users table" });
    }

    // Create a new teacher and associate with the User via userId
    const newTeacher = await Teachers.create({
      name,
      subject,
      experience,
      email: normalizedEmail, // Save normalized email
      phone,
      userId: existingUser.id, // Associate the teacher with the user via userId
    });

    return res.status(201).json({ message: "Teacher registered successfully", teacher: newTeacher });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Teacher Login
router.post("/login", async (req, res) => {
  const { email, phone } = req.body;

  if (!email || !phone) {
    return res.status(400).json({ error: "Email and phone are required" });
  }

  try {
    // Find teacher by email and phone
    const teacher = await Teachers.findOne({
      where: { email },
      include: {
        model: Users,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'phone', 'schoolName'],
      }
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    if (teacher.user.phone !== phone) {
      return res.status(400).json({ error: "Incorrect phone number" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: teacher.id,
        fullName: teacher.user.fullName,
        email: teacher.user.email,
        schoolName: teacher.user.schoolName,
      },
      "jwtsecretplschange",
      { expiresIn: "1h" }
    );

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get All Teachers by Admin's School
router.get("/", async (req, res) => {
  try {
    // Extract token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    // Verify token and extract the decoded information
    const decoded = jwt.verify(token, "jwtsecretplschange"); // Replace with your actual secret
    const adminSchoolName = decoded.schoolName; // Extract the admin's schoolName from the token

    // Retrieve teachers whose schoolName matches the admin's schoolName
    const teachers = await Teachers.findAll({
      include: {
        model: Users,
        as: 'user', // Ensure to include associated user data
        where: { schoolName: adminSchoolName },  // Filter by schoolName of the admin
        attributes: ['id', 'fullName', 'email', 'phone'], // Include user details you want
      }
    });

    // Return the list of teachers to the frontend
    res.status(200).json(teachers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get a Single Teacher by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teachers.findByPk(id, {
      include: {
        model: Users,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'phone'],
      }
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Update a Teacher's Details
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, experience, email, phone } = req.body;  // Include phone for updating

    const teacher = await Teachers.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Check if phone exists in Users table (this ensures the foreign key constraint)
    const existingUser = await Users.findOne({ where: { phone } });
    if (!existingUser) {
      return res.status(400).json({ error: "Phone number does not exist in Users table" });
    }

    // Update teacher details
    await teacher.update({
      name,
      subject,
      experience,
      email,
      phone,
      userId: existingUser.id, // Ensure the userId is updated
    });

    res.status(200).json({ message: "Teacher updated successfully", teacher });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
