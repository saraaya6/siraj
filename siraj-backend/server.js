require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // استدعاء مكتبة CORS للسماح بالربط مع الفرونت اند
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();

// إعدادات الباك اند الأساسية
app.use(cors()); // السماح لمتصفح الفرونت اند بالوصول للباك اند
app.use(express.json());

const port = process.env.PORT || 5000;
const upload = multer(); // إعداد مكتبة رفع الملفات

// الاتصال بقاعدة البيانات MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// استيراد موديل الملاحظات
const Note = require('./models/note');

// المسارات (Routes)

// 1. اختبار السيرفر
app.get('/', (req, res) => {
  res.send('Siraj backend is running');
});

// 2. استقبال الملف الصوتي وتحليله (الربط مع AI)
app.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    // استلام المعاملات القادمة من الفرونت اند (مثل اسم السورة واللغة)
    const { surah, language } = req.query;

    if (!file || !file.originalname.endsWith('.wav')) {
      return res.status(400).json({
        error: 'صيغة الملف غير مدعومة. الرجاء رفع ملف بصيغة WAV فقط'
      });
    }

    // تجهيز البيانات لإرسالها للسيرفر الخارجي
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    // إرسال الطلب للسيرفر الذكي مع تمرير معاملات السورة واللغة
    const response = await axios.post(
      `https://siraj.csch-svu.com:8001/audio/analyze?surah=${surah || ''}&language=${language || 'ar'}`, 
      formData,
      {
        headers: formData.getHeaders()
      }
    );

    // إعادة النتيجة النهائية للفرونت اند
    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      error: 'فشل التحليل التقني',
      details: err.message
    });
  }
});

// 3. مسارات الملاحظات (Notes)
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