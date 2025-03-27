const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Set up multer for file uploading
const multer = require('multer');

// Configure multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp to avoid filename conflicts
  }
});
const upload = multer({ storage });

// Serve static files (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database setup (assuming Sequelize is used)
const db = require('./models');
db.sequelize.sync().then(() => {
  console.log('Database synced!');
});

// Routes
const registerPost = require('./routes/Users');
app.use('/users', registerPost);

const studentsPost = require('./routes/Students');
app.use('/students', studentsPost);

const teacherRoutes = require('./routes/Teachers');
app.use('/teachers', teacherRoutes);

// Image upload route
app.post('/upload', upload.single('image'), (req, res) => {
  // Send back the image URL after upload
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// Start the server
app.listen(4070, () => {
  console.log('Server is running on http://localhost:4070');
});
