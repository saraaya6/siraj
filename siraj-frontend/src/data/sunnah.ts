export const sunnahLessons = [
  {
    id: 1,
    prophetSaying: "قال رسول الله ﷺ: «إِذَا أَوَى أَحَدُكُمْ إِلَى فِرَاشِهِ فَلْيَقُلْ...»",
    hadithText: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    correctId: 1, // سنعتمد على ID الإجابة الصحيحة
    options: [
      { id: 1, image: "/images/sleeping.png", label: "عند النوم" },
      { id: 2, image: "/images/eating.png", label: "عند الأكل" },
    ]
  },
  {
    id: 2,
    prophetSaying: "قال رسول الله ﷺ:",
    hadithText: "إذَا أَكَلَ أَحَدُكُمْ فَلْيَذْكُرِ اسْمَ اللَّهِ تَعَالَى",
    correctId: 2,
    options: [
      { id: 1, image: "/images/sleeping.png", label: "عند النوم" },
      { id: 2, image: "/images/eating.png", label: "عند الأكل" },
    ]
  }
];