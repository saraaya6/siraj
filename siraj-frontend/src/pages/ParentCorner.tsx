import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock, Home, Calendar, BookOpen, TrendingUp, Unlock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchSessionNotes, SessionNote } from '@/lib/api';
import { Progress } from '@/components/ui/progress';
import starMascot from '@/assets/star-mascot.png';

const PIN_CODE = '1234'; // Simple PIN for demo

const ParentCorner = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isUnlocked) {
      loadNotes();
    }
  }, [isUnlocked]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await fetchSessionNotes();
      setNotes(data);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === PIN_CODE) {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('رمز PIN غير صحيح');
      setPin('');
    }
  };

  const handlePinChange = (value: string) => {
    // Only allow numbers and max 4 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    setPin(numericValue);
    setError('');
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-success';
    if (accuracy >= 70) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-dark to-primary">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-accent hover:text-accent-light transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>
          <div className="flex items-center gap-3">
            <img src={starMascot} alt="سراج" className="w-10 h-10" />
            <span className="text-xl font-bold text-accent">ركن الوالدين</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            /* PIN Lock Screen */
            <motion.div
              key="lock"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Lock className="w-10 h-10 text-accent" />
                </motion.div>

                <h1 className="text-2xl font-bold text-white mb-2">ركن الوالدين</h1>
                <p className="text-accent-light/70 mb-8">
                  أدخل رمز PIN للوصول إلى لوحة المتابعة
                </p>

                <form onSubmit={handlePinSubmit} className="space-y-6">
                  <div>
                    <Input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => handlePinChange(e.target.value)}
                      placeholder="• • • •"
                      className="text-center text-3xl tracking-[1em] bg-white/20 border-accent/30 text-white placeholder:text-white/30 h-16 rounded-2xl"
                    />
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-destructive mt-2 text-sm"
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="xl"
                    className="w-full"
                    disabled={pin.length !== 4}
                  >
                    <Unlock className="w-5 h-5 ml-2" />
                    فتح القفل
                  </Button>
                </form>

                <p className="text-accent-light/50 text-sm mt-6">
                  رمز PIN الافتراضي: 1234
                </p>
              </div>
            </motion.div>
          ) : (
            /* Dashboard */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Welcome Header */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">
                  مرحباً بك في ركن الوالدين 👋
                </h1>
                <p className="text-accent-light/70">
                  تابع تقدم طفلك في تعلم القرآن الكريم
                </p>
              </div>

              {/* Stats Overview */}
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-accent-light/70 text-sm">الجلسات</p>
                      <p className="text-2xl font-bold text-white">{notes.length}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-accent-light/70 text-sm">متوسط الدقة</p>
                      <p className="text-2xl font-bold text-white">
                        {notes.length > 0
                          ? Math.round(notes.reduce((sum, n) => sum + n.accuracy, 0) / notes.length)
                          : 0}%
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-accent-light/70 text-sm">السور المتعلمة</p>
                      <p className="text-2xl font-bold text-white">
                        {new Set(notes.map(n => n.surah)).size}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Session Notes */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 lg:p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-accent" />
                  سجل الجلسات
                </h2>

                {loading ? (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full mx-auto"
                    />
                    <p className="text-accent-light/70 mt-4">جارٍ التحميل...</p>
                  </div>
                ) : notes.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-accent/30 mx-auto mb-4" />
                    <p className="text-accent-light/70">لا توجد جلسات مسجلة بعد</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notes.map((note, index) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-2xl p-5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                              <h3 className="font-bold text-white">سورة {note.surah}</h3>
                              <p className="text-sm text-accent-light/60">{note.date}</p>
                            </div>
                          </div>

                          <div className="flex-1 lg:max-w-md">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-accent-light/70">الدقة</span>
                              <span className={`font-bold ${getAccuracyColor(note.accuracy)}`}>
                                {note.accuracy}%
                              </span>
                            </div>
                            <Progress value={note.accuracy} className="h-2" />
                          </div>
                        </div>

                        {note.notes && (
                          <p className="text-accent-light/70 text-sm mt-4 pr-16">
                            📝 {note.notes}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/learn">
                  <Button variant="hero" size="lg">
                    <BookOpen className="w-5 h-5 ml-2" />
                    ابدأ جلسة جديدة
                  </Button>
                </Link>
                <Button
                  variant="heroOutline"
                  size="lg"
                  onClick={() => setIsUnlocked(false)}
                >
                  <Lock className="w-5 h-5 ml-2" />
                  قفل الشاشة
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ParentCorner;
