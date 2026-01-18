require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// موديل الملاحظات
const Note = require('./models/note');

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.send('Siraj backend is running');
});

// إنشاء ملاحظة
app.post('/notes', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = new Note({ title, content });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// جلب كل الملاحظات
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// تشغيل السيرفر
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
const multer = require('multer');
const upload = multer();
const axios = require('axios');
const FormData = require('form-data');

app.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    // التحقق من صيغة الملف
    if (!file || !file.originalname.endsWith('.wav')) {
      return res.status(400).json({
        error: 'صيغة الملف غير مدعومة. الرجاء رفع ملف بصيغة WAV فقط'
      });
    }

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const response = await axios.post(
      'https://siraj.csch-svu.com:8001/audio/analyze',
      formData,
      {
        headers: formData.getHeaders()
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      error: 'فشل التحليل',
      details: err.message
    });
  }
});

