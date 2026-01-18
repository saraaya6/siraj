import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mic, Square, Home, BookOpen, RotateCcw, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioRecorder } from '@/lib/audioRecorder';
import { analyzeAudio, AnalysisResult } from '@/lib/api';
import { surahs, Surah } from '@/data/surahs';
import starMascot from '@/assets/star-mascot.png';
import ResultsDashboard from '@/components/ResultsDashboard';

const QuranLab = () => {
  const [selectedSurah, setSelectedSurah] = useState<Surah>(surahs[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const recorderRef = useRef<AudioRecorder | null>(null);

  const startRecording = useCallback(async () => {
    try {
      recorderRef.current = new AudioRecorder();
      await recorderRef.current.startRecording();
      setIsRecording(true);
      setResults(null);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('لم نتمكن من الوصول إلى الميكروفون. تأكد من السماح بالوصول.');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recorderRef.current) return;

    try {
      setIsRecording(false);
      setIsAnalyzing(true);
      
      const audioBlob = await recorderRef.current.stopRecording();
      // يتم تمرير اسم السورة بالإنجليزية للسيرفر (مثل An-Nas)
      const analysisResult = await analyzeAudio(audioBlob, selectedSurah.nameEn, 'ar');
      
      setResults(analysisResult);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedSurah]);

  const resetSession = () => {
    setResults(null);
    setIsRecording(false);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-72 bg-sidebar min-h-screen p-6 flex flex-col"
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <img src={starMascot} alt="سراج" className="w-10 h-10" />
              <span className="font-bold text-xl">سراج</span>
            </div>

            {/* Navigation */}
            <Link to="/" className="flex items-center gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground mb-6 transition-colors font-medium">
              <Home className="w-5 h-5" />
              <span>الرئيسية</span>
            </Link>

            {/* Surahs List */}
            <div className="flex-1 overflow-y-auto">
              <h3 className="text-sm font-medium text-sidebar-foreground/60 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                اختر السورة
              </h3>
              <div className="space-y-2">
                {surahs.map((surah) => (
                  <button
                    key={surah.id}
                    onClick={() => {
                      setSelectedSurah(surah);
                      resetSession();
                    }}
                    className={`surah-item w-full text-right p-3 rounded-xl transition-all ${
                      selectedSurah.id === surah.id 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'hover:bg-accent/10 text-sidebar-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs opacity-70">{surah.verses} آيات</span>
                      <span className="font-bold">{surah.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mascot */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-6"
            >
              <img src={starMascot} alt="سراج" className="w-24 h-24 mx-auto opacity-50" />
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden"
          >
            <ChevronLeft className={`w-6 h-6 transition-transform ${showSidebar ? '' : 'rotate-180'}`} />
          </Button>
          
          <div className="flex items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              حلقات القرآن الكريم
            </h1>
            <div className="bg-accent/20 text-primary px-4 py-2 rounded-full text-sm font-medium">
              سورة {selectedSurah.name}
            </div>
          </div>

          {results && (
            <Button variant="outline" onClick={resetSession} className="rounded-full">
              <RotateCcw className="w-4 h-4 ml-2" />
              إعادة التسجيل
            </Button>
          )}
        </div>

        {/* Surah Display */}
        <motion.div
          key={selectedSurah.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-8 lg:p-12 shadow-playful mb-8 border-2 border-accent/10"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">
              سورة {selectedSurah.name}
            </h2>
            <p className="text-muted-foreground">{selectedSurah.verses} آيات</p>
          </div>

          <div className="space-y-6">
            {selectedSurah.text.map((verse, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-2xl lg:text-3xl text-foreground leading-loose text-center font-arabic"
              >
                {verse}
                <span className="inline-flex items-center justify-center w-8 h-8 bg-accent/20 rounded-full text-primary text-sm mr-3 font-sans">
                  {index + 1}
                </span>
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* Recording Section */}
        {!results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 py-8"
          >
            <p className="text-lg text-muted-foreground text-center font-medium">
              {isRecording 
                ? '🎙️ جارٍ التسجيل... اقرأ السورة بصوت واضح'
                : isAnalyzing
                ? '⏳ جارٍ تحليل التلاوة...'
                : '🌟 اضغط للبدء في تسجيل تلاوتك'}
            </p>

            <div className="relative">
              {isRecording && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 bg-destructive/30 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    className="absolute inset-0 bg-destructive/20 rounded-full"
                  />
                </>
              )}

              <Button
                variant={isRecording ? 'recordActive' : 'record'}
                size="iconXl"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isAnalyzing}
                className="relative z-10 shadow-xl"
              >
                {isRecording ? (
                  <Square className="w-10 h-10" />
                ) : isAnalyzing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <Mic className="w-10 h-10" />
                )}
              </Button>
            </div>

            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              {isRecording ? 'إيقاف التسجيل' : 'بدء التسميع'}
            </p>
          </motion.div>
        )}

        {/* Results Dashboard */}
        {results && (
          <ResultsDashboard 
            results={results} 
            surahName={selectedSurah.name} // يمرر الاسم العربي للعرض (مثلاً الناس)
          />
        )}
      </main>
    </div>
  );
};

export default QuranLab;