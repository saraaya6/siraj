import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import starMascot from "@/assets/star-mascot.png";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-dark to-primary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-6"
      >
        <motion.img
          src={starMascot}
          alt="سراج"
          className="w-32 h-32 mx-auto mb-6"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <h1 className="mb-4 text-8xl font-bold text-accent">٤٠٤</h1>
        <p className="mb-8 text-xl text-accent-light/80">
          عفواً! الصفحة التي تبحث عنها غير موجودة
        </p>
        
        <Link to="/">
          <Button variant="hero" size="xl">
            <Home className="w-5 h-5 ml-2" />
            العودة للرئيسية
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
