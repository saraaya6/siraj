require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const port = process.env.PORT || 5000;

// 1. الترتيب الصحيح: تفعيل CORS بعد تعريف app
app.use(cors()); 
app.use(express.json());

const upload = multer();

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const Note = require('./models/note');

// مسار التحليل الصوتي
app.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { surah, language } = req.query; // استلام المتغيرات من الفرونت

    if (!file) return res.status(400).json({ error: 'لم يتم رفع ملف' });

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const response = await axios.post(
      `https://siraj.csch-svu.com:8001/audio/analyze?surah=${surah || ''}&language=${language || 'ar'}`,
      formData,
      { headers: formData.getHeaders() }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'فشل في الاتصال بسيرفر التحليل', details: err.message });
  }
});

// مسارات الملاحظات
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});