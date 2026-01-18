import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import QuranLab from "./pages/QuranLab";
import ParentCorner from "./pages/ParentCorner";
import NotFound from "./pages/NotFound";
import SunnahLab from "./pages/SunnahLab";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      
      {/* الحاوية الرئيسية التي تضمن بقاء الخلفية تحت المحتوى */}
      <div className="relative min-h-screen">

        {/* طبقة محتوى الموقع الأصلي */}
        <div className="relative z-10">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/learn" element={<QuranLab />} />
              <Route path="/parent" element={<ParentCorner />} />
              <Route path="/sunnah" element={<SunnahLab />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
        
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;