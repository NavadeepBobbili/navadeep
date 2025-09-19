
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 7000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB (Database = DATAFORM)
mongoose.connect("mongodb://localhost:27017/DATAFORM")
  .then(() => console.log("✅ Connected to MongoDB (DATAFORM DB)"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Schema & Model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String
}, { versionKey: false });

// ✅ Force collection name = "dataform"
const User = mongoose.model("dataform", userSchema, "dataform");

// Serve the form.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "haii.html"));
});

// Handle form submission
app.post("/save", async (req, res) => {
  try {
    console.log("📥 Form Data:", req.body);
    const { username, password, email } = req.body;
    const newUser = new User({ username, password, email });
    await newUser.save();

    res.send(`
      <h1>✅ Data Saved Successfully!</h1>
      <p>Username: ${username}</p>
      <p>Email: ${email}</p>
      <a href="/">⬅ Back</a> | <a href="/users">👀 View All Users</a>
    `);
  } catch (error) {
    res.status(500).send("❌ Error: " + error.message);
  }
});

// ✅ Route to display all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    let userList = "<h1>📋 All Users</h1><table border='1' cellpadding='10'>";
    userList += "<tr><th>Username</th><th>Email</th><th>Password</th></tr>";
    users.forEach(u => {
      userList += `<tr><td>${u.username}</td><td>${u.email}</td><td>${u.password}</td></tr>`;
    });
    userList += "</table><br><a href='/'>⬅ Back</a>";
    res.send(userList);
  } catch (error) {
    res.status(500).send("❌ Error fetching users: " + error.message);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
