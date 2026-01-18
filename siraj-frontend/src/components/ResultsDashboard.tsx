import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  RefreshCw,
  Trophy,
  Target,
} from "lucide-react";
import { AnalysisResult } from "@/lib/api";
import { Progress } from "@/components/ui/progress";

interface ResultsDashboardProps {
  results: AnalysisResult;
  surahName: string;
}

const ResultsDashboard = ({ results, surahName }: ResultsDashboardProps) => {
  // تم استخراج totalWords هنا لضمان عمل الحسبة في الأسفل بشكل صحيح
  const { accuracy, mistakes, recommendation, totalMistakes, totalWords } = results;

  const getAccuracyColor = () => {
    if (accuracy >= 90) return "text-success";
    if (accuracy >= 70) return "text-warning";
    return "text-destructive";
  };

  const getAccuracyBg = () => {
    if (accuracy >= 90) return "bg-success/10";
    if (accuracy >= 70) return "bg-warning/10";
    return "bg-destructive/10";
  };

  const getAccuracyIcon = () => {
    if (accuracy >= 90) return <Trophy className="w-12 h-12 text-success" />;
    if (accuracy >= 70) return <Target className="w-12 h-12 text-warning" />;
    return <RefreshCw className="w-12 h-12 text-destructive" />;
  };

  const getAccuracyMessage = () => {
    if (accuracy >= 90) return "ممتاز! أحسنت يا بطل! 🌟";
    if (accuracy >= 70) return "جيد جداً! استمر في التحسن! 💪";
    return "لا تستسلم! كل محاولة تقربك من الإتقان! 🎯";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Accuracy Card */}
      <div className={`rounded-3xl p-8 ${getAccuracyBg()}`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              {getAccuracyIcon()}
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                نتيجة تلاوة سورة {surahName}
              </h3>
              <p className="text-muted-foreground">{getAccuracyMessage()}</p>
            </div>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
            className="text-center"
          >
            <div className={`text-6xl font-bold ${getAccuracyColor()}`}>
              {Math.round(accuracy)}%
            </div>
            <p className="text-sm text-muted-foreground">دقة التلاوة</p>
          </motion.div>
        </div>

        <div className="mt-6">
          <Progress value={accuracy} className="h-4 bg-muted" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 border-2 border-destructive/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <XCircle className="w-6 h-6 text-destructive" />
            <span className="font-bold text-foreground">كلمات ناقصة</span>
          </div>
          <div className="text-4xl font-bold text-destructive mb-2">
            {mistakes.missing.length}
          </div>
          {mistakes.missing.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {mistakes.missing.map((word, i) => (
                <span key={i} className="word-missing text-sm">
                  {word}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 border-2 border-warning/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-6 h-6 text-warning" />
            <span className="font-bold text-foreground">كلمات زائدة</span>
          </div>
          <div className="text-4xl font-bold text-warning mb-2">
            {mistakes.extra.length}
          </div>
          {mistakes.extra.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {mistakes.extra.map((word, i) => (
                <span key={i} className="word-extra text-sm">
                  {word}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-6 border-2 border-orange-500/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <RefreshCw className="w-6 h-6 text-orange-500" />
            <span className="font-bold text-foreground">كلمات مبدلة</span>
          </div>
          <div className="text-4xl font-bold text-orange-500 mb-2">
            {mistakes.replaced.length}
          </div>
          {mistakes.replaced.length > 0 && (
            <div className="space-y-2">
              {mistakes.replaced.map((item, i) => (
                <div key={i} className="text-sm">
                  <span className="word-replaced">{item.got}</span>
                  <span className="mx-2 text-muted-foreground">←</span>
                  <span className="text-success">{item.expected}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recommendation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-l from-accent/20 to-accent/5 rounded-3xl p-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-accent/30 rounded-2xl flex items-center justify-center">
            <Star className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-foreground mb-2">التوصية</h4>
            <p className="text-muted-foreground text-lg">{recommendation}</p>
          </div>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-2xl p-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-success" />
          <span className="text-foreground">
            الكلمات الصحيحة: <strong>{totalWords - totalMistakes}</strong> من{" "}
            {totalWords}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 ${
                i < Math.ceil(accuracy / 20)
                  ? "text-accent fill-accent"
                  : "text-muted"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultsDashboard;