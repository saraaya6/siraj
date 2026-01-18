import axios from "axios";

const AI_API_URL = import.meta.env.VITE_AI_API_URL;

export interface MistakeResult {
  missing: string[];
  extra: string[];
  replaced: { expected: string; got: string }[];
}

export interface AnalysisResult {
  mistakes: MistakeResult;
  accuracy: number;
  recommendation: string;
  totalMistakes: number;
  totalWords: number; // هذا المتغير مطلوب إجباري هنا
}

export interface SessionNote {
  id: string;
  date: string;
  surah: string;
  accuracy: number;
  notes: string;
}

export const analyzeAudio = async (
  audioBlob: Blob,
  surah: string = "An-Nas",
  language: string = "ar",
): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.wav");

  try {
    const response = await axios.post(
      `${AI_API_URL}/analyze?surah=${encodeURIComponent(surah)}&language=${encodeURIComponent(language)}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    const data = response.data;
    const mistakes: MistakeResult = { missing: [], extra: [], replaced: [] };

    // استخراج الأخطاء من مصفوفة الآيات (ayahs)
    if (data.ayahs && Array.isArray(data.ayahs)) {
      data.ayahs.forEach((ayah: any) => {
        if (ayah.mistakes) {
          if (ayah.mistakes.replaced)
            mistakes.replaced.push(...ayah.mistakes.replaced);
          if (ayah.mistakes.missing)
            mistakes.missing.push(...ayah.mistakes.missing);
          if (ayah.mistakes.extra) mistakes.extra.push(...ayah.mistakes.extra);
        }
      });
    }

    // هنا تم الإصلاح بإضافة totalWords للنتيجة النهائية
    return {
      mistakes,
      accuracy: data.overall_accuracy ?? 0,
      recommendation: data.recommendation || "جرب القراءة مرة أخرى بوضوح.",
      totalMistakes:
        mistakes.replaced.length +
        mistakes.missing.length +
        mistakes.extra.length,
      totalWords: data.total_words || 0, // استلام إجمالي الكلمات من بيانات السيرفر
    };
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("فشل التحليل التقني");
  }
};

export const fetchSessionNotes = async (): Promise<SessionNote[]> => {
  return [
    {
      id: "1",
      date: new Date().toISOString().split("T")[0],
      surah: "الناس",
      accuracy: 85,
      notes: "أداء ممتاز مع تحسن ملحوظ.",
    },
  ];
};
