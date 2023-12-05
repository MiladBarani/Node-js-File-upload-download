const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5001; // Use the environment variable PORT or default to 3000

// Cross-Origin Resource Sharing handler
const cors = require("cors");
app.use(cors());

// Set up the storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the folder where you want to store the uploaded files
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    // Define the filename for the uploaded file
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Create multer instance with the configured storage
const upload = multer({ storage: storage });

// Set up a route to handle file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  res.send("File uploaded successfully!");
});

// Set up a route to handle file downloads
app.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    res.download(filePath, filename);
  } else {
    res.status(404).send("File not found.");
  }
});

// Serve HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Set up a route to get the list of uploaded files
app.get("/files", (req, res) => {
  const uploadPath = path.join(__dirname, "uploads");
  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      return res.status(500).send("Error reading upload directory.");
    }

    res.json(files);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
