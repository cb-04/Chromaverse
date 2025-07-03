const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const serviceAccount = require('./firebaseKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chromaverse-a1eac-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();
const usersRef = db.ref("users");
const galleryRef = db.ref("gallery");

const app = express();
const PORT = 3000;

// ============== Middleware ==============
app.use(bodyParser.json({ limit: '10mb' })); // To handle large base64 images
app.use(express.static('public'));
app.use('/saved-images', express.static('saved-images'));

app.use(session({
  secret: 'your_secret_key_here', // change to something strong!
  resave: false,
  saveUninitialized: true,
}));

// ============== Auth Routes ==============

// Sign up
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  const snapshot = await usersRef.orderByChild("username").equalTo(username).once("value");
  if (snapshot.exists()) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUserRef = usersRef.push();
  await newUserRef.set({ username, password: hashed });

  res.json({ message: 'Signup successful' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const snapshot = await usersRef.orderByChild("username").equalTo(username).once("value");
  if (!snapshot.exists()) return res.status(400).json({ message: 'Invalid credentials' });

  const userData = Object.values(snapshot.val())[0];
  const valid = await bcrypt.compare(password, userData.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

  req.session.user = { username };
  res.json({ message: 'Login successful' });
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

// ============== Drawing Routes ==============

// Save drawing
app.post('/api/save-drawing', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { imageData, title } = req.body;
  if (!imageData) {
    return res.status(400).json({ message: 'No image data' });
  }

  const fileName = `drawing_${Date.now()}.png`;
  const filePath = path.join(__dirname, 'saved-images', fileName);

  const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(filePath, base64Data, 'base64');

  const newEntry = {
    id: Date.now(),
    user: req.session.user.username,
    title: title || 'Untitled',
    file: fileName,
    createdAt: new Date().toISOString(),
  };

  const newGalleryRef = galleryRef.push();
  await newGalleryRef.set(newEntry);

  res.json({ message: 'Drawing saved successfully', file: fileName });
});

// Get gallery for logged-in user
app.get('/api/gallery', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const snapshot = await galleryRef.orderByChild("user").equalTo(req.session.user.username).once("value");
  const data = snapshot.val();
  res.json(data ? Object.values(data) : []);
});

// ============== Serve pages ==============

app.get('/', (req, res) => {
  if (!req.session.user) {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// ============== Server Start ==============
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
