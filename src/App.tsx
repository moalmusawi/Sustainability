import { BrowserRouter, Routes, Route, Link, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trash2, 
  Leaf, 
  Sun, 
  Moon,
  CloudRain, 
  Droplets, 
  Target, 
  ArrowRight, 
  ChevronLeft,
  BookOpen,
  FlaskConical,
  PlayCircle,
  Menu,
  X,
  Search,
  Compass,
  Sprout,
  ShieldCheck,
  Globe,
  HelpCircle,
  MessageCircle,
  Send,
  User,
  BadgeCheck,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { curriculumData, Unit, Lesson } from "./data/curriculum";
import { cn } from "./lib/utils";
import { GoogleGenAI } from "@google/genai";
import { CheckCircle2, Trophy, Award } from "lucide-react";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const iconMap = {
  Trash2,
  Leaf,
  Sun,
  CloudRain,
  Droplets,
  Target
};

function Layout({ children, progress, isDark, onToggleDark }: { children: React.ReactNode, progress: number, isDark: boolean, onToggleDark: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const searchResults = searchQuery.trim() ? (() => {
    const results: { unitId: string, lessonId?: string, title: string, description: string, type: 'unit' | 'lesson' }[] = [];
    const q = searchQuery.toLowerCase();
    
    curriculumData.forEach(unit => {
      if (unit.title.toLowerCase().includes(q) || unit.description.toLowerCase().includes(q)) {
        results.push({ unitId: unit.id, title: unit.title, description: unit.description, type: 'unit' });
      }
      unit.lessons.forEach(lesson => {
        if (lesson.title.toLowerCase().includes(q) || lesson.description.toLowerCase().includes(q) || lesson.content.toLowerCase().includes(q)) {
          results.push({ unitId: unit.id, lessonId: lesson.id, title: lesson.title, description: lesson.description, type: 'lesson' });
        }
      });
    });
    return results.slice(0, 5);
  })() : [];

  useEffect(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col font-sans nature-bg" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-stone-200 dark:border-stone-800 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2 space-x-reverse group">
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20"
              >
                <Leaf className="w-6 h-6" />
              </motion.div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-bold text-stone-900 dark:text-white tracking-tight leading-none pt-1">استدامه</span>
                <span className="text-[9px] text-primary font-bold uppercase tracking-widest hidden sm:block">المدارس الخضراء</span>
              </div>
            </Link>

            {/* Progress Bar (Reduced on small screens) */}
            <div className="hidden sm:flex items-center space-x-4 space-x-reverse flex-1 max-w-[150px] md:max-w-xs mx-4 lg:mx-8">
              <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden border border-stone-200 dark:border-stone-700">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-accent shadow-[0_0_10px_rgba(132,204,22,0.5)]"
                />
              </div>
              <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 whitespace-nowrap">{Math.round(progress)}%</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
              <div className="relative group">
                <div className={cn(
                  "flex items-center bg-stone-100 dark:bg-stone-800 rounded-2xl px-4 py-2 border border-transparent transition-all",
                  isSearchOpen ? "ring-2 ring-primary/20 border-primary/30 w-72" : "w-48 hover:border-stone-300 dark:hover:border-stone-700"
                )}>
                  <Search className="w-4 h-4 text-stone-400" />
                  <input 
                    type="text"
                    placeholder="ابحث في المنهج..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full mr-2 text-stone-900 dark:text-white placeholder:text-stone-400"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {isSearchOpen && searchQuery && (
                    <>
                      <div className="fixed inset-0 z-[-1]" onClick={() => setIsSearchOpen(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 w-full min-w-[320px] glass border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-2xl z-50"
                      >
                        <div className="p-4 bg-stone-50/50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800">
                          <span className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest">نتائج البحث</span>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                          {searchResults.length > 0 ? searchResults.map((result, idx) => (
                            <Link 
                              key={`${result.unitId}-${result.lessonId || 'unit'}`}
                              to={result.lessonId ? `/unit/${result.unitId}/lesson/${result.lessonId}` : `/unit/${result.unitId}`}
                              className="block p-4 hover:bg-primary/5 dark:hover:bg-accent/5 transition-colors border-b border-stone-100 dark:border-stone-800 last:border-none"
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-1 p-1.5 bg-stone-100 dark:bg-stone-800 rounded-lg text-primary dark:text-accent">
                                  {result.type === 'unit' ? <Compass className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                                </div>
                                <div className="space-y-1">
                                  <h4 className="font-bold text-sm text-stone-900 dark:text-white">{result.title}</h4>
                                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">{result.description}</p>
                                </div>
                              </div>
                            </Link>
                          )) : (
                            <div className="p-10 text-center text-stone-400 dark:text-stone-500">
                              <p className="text-sm font-medium">عذراً، لم نجد نتائج لـ "{searchQuery}"</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/" className="text-stone-600 dark:text-stone-300 hover:text-primary dark:hover:text-accent font-semibold transition-colors text-sm">الرئيسية</Link>
              <Link to="/about" className="text-stone-600 dark:text-stone-300 hover:text-primary dark:hover:text-accent font-semibold transition-colors text-sm">نبذة عن المنهج</Link>
              <Link to="/certificate" className="flex items-center space-x-1 space-x-reverse text-stone-600 dark:text-stone-300 hover:text-primary dark:hover:text-accent font-semibold transition-colors text-sm bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-full">
                <Award className="w-4 h-4" />
                <span>شهادتي</span>
              </Link>
              
              <button 
                onClick={onToggleDark}
                className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </nav>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-1 space-x-reverse md:hidden">
              <button 
                onClick={onToggleDark}
                className="p-2 text-stone-600 dark:text-stone-300"
              >
                {isDark ? <Sun /> : <Moon />}
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-stone-600 dark:text-stone-300"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            className="md:hidden glass border-b border-stone-200 dark:border-stone-800 overflow-hidden origin-top z-40 fixed top-16 w-full"
          >
            <div className="px-4 pt-4 pb-8 space-y-3">
              {/* Mobile Search */}
              <div className="px-4 mb-4">
                <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-2xl px-4 py-3 border border-stone-200 dark:border-stone-700">
                  <Search className="w-5 h-5 text-stone-400" />
                  <input 
                    type="text"
                    placeholder="ابحث في المنهج..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-base font-medium w-full mr-2 text-stone-900 dark:text-white"
                  />
                </div>
                {searchQuery && (
                  <div className="mt-2 space-y-2 max-h-[300px] overflow-y-auto rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
                    {searchResults.length > 0 ? searchResults.map((result) => (
                      <Link 
                        key={`${result.unitId}-${result.lessonId || 'unit'}`}
                        to={result.lessonId ? `/unit/${result.unitId}/lesson/${result.lessonId}` : `/unit/${result.unitId}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block p-4 border-b border-stone-50 dark:border-stone-800 last:border-none"
                      >
                        <h4 className="font-bold text-sm dark:text-white">{result.title}</h4>
                        <p className="text-xs text-stone-500 line-clamp-1">{result.description}</p>
                      </Link>
                    )) : (
                      <p className="p-4 text-sm text-stone-400 text-center">لا توجد نتائج</p>
                    )}
                  </div>
                )}
              </div>
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-stone-600 dark:text-stone-300 font-bold bg-stone-50 dark:bg-stone-800/50">
                <Compass className="w-5 h-5" />
                <span>الرئيسية</span>
              </Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-stone-600 dark:text-stone-300 font-bold hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                <BookOpen className="w-5 h-5" />
                <span>نبذة عن المنهج</span>
              </Link>
              <Link to="/certificate" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-stone-600 dark:text-stone-300 font-bold hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                <Award className="w-5 h-5" />
                <span>شهادتي</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Link to="/" className="flex items-center space-x-2 space-x-reverse opacity-80 filter grayscale brightness-200">
               <Leaf className="w-6 h-6 text-white" />
               <span className="text-xl font-bold text-white tracking-tight">استدامه</span>
            </Link>
          </div>
          <p className="mb-4">منهج استدامه (المدارس الخضراء)</p>
          <div className="text-sm border-t border-stone-800 pt-8">
            &copy; {new Date().getFullYear()} جميع الحقوق محفوظة لمدرسة هلال بن عطية للبنين (5-10)
          </div>
        </div>
      </footer>
    </div>
  );
}

function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold dark:text-white">نبذة عن المنهج</h1>
        <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">من نحن؟</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            يعد برنامج المدارس الخضراء من المشاريع التي تحقق أهداف التربية من أجل التنمية المستدامة، إذ يهدف إلى تثقيف الطلبة والمعلمين والمجتمع المحلي وتوعيتهم بقضايا البيئة والاقتصاد الدائري.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">أهدافنا</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            يهدف المشروع إلى تعزيز سلوك الطلبة الإيجابي نحو البيئة المستدامة، وخلق اتجاهات بيئية من خلال إكسابهم معارف جديدة تمكنهم من اتخاذ قرارات مستنيرة.
          </p>
        </motion.div>
      </div>

      <section className="bg-primary text-white rounded-[3rem] p-12 relative overflow-hidden">
        <Globe className="absolute -bottom-12 -left-12 w-64 h-64 text-white/5 rotate-12" />
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-bold">رؤية عمان 2040</h2>
          <p className="text-xl opacity-90 leading-relaxed max-w-2xl">
            نعمل في ضوء رؤية عمان 2040 التي ترسم خارطة طريق للمحافظة على البيئة وصون مواردها الطبيعية، والتحول نحو الاقتصاد الأخضر والدائري لاستدامة الموارد.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            {["اقتصاد دائري", "حياد كربوني", "طاقة متجددة", "أمن مائي"].map(tag => (
              <span key={tag} className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Home({ completedLessons, quizScores }: { completedLessons: string[], quizScores: Record<string, 'pass' | 'fail'> }) {
  const recommendations = (() => {
    const items: { type: 'review' | 'next' | 'start', lesson: Lesson, unitId: string }[] = [];
    
    curriculumData.forEach(unit => {
      unit.lessons.forEach(lesson => {
        const score = quizScores[lesson.id];
        const completed = completedLessons.includes(lesson.id);
        
        if (score === 'fail') {
          items.push({ type: 'review', lesson, unitId: unit.id });
        } else if (!completed) {
          items.push({ type: 'start', lesson, unitId: unit.id });
        }
      });
    });

    return items.sort((a, b) => {
      const order = { review: 0, next: 1, start: 2 };
      return order[a.type] - order[b.type];
    }).slice(0, 3);
  })();

  return (
    <div className="space-y-20 pb-20">
      <section className="text-center space-y-8 max-w-4xl mx-auto py-16 relative">
        <motion.div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-accent/20 rounded-full blur-3xl -z-10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent rounded-full text-xs font-bold tracking-widest uppercase mb-4"
        >
          مرحبا بكم في منصة استدامة التعليمية
        </motion.div>
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold text-stone-900 dark:text-white leading-tight"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          نحو مستقبل <span className="text-primary dark:text-accent font-serif tracking-tight underline decoration-primary/10 dark:decoration-accent/10 underline-offset-8">أخضر ومستدام</span>
        </motion.h1>
        <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl mx-auto">
          دليلك التفاعلي لمنهج المدارس الخضراء. تجربة تعليمية فريدة تمزج بين المعرفة والتطبيق العملي.
        </p>
        <motion.div 
          className="flex justify-center gap-4 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <a href="#units" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center gap-2 group">
            اكتشف الوحدات
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link to="/about" className="glass dark:bg-stone-800 text-stone-900 dark:text-white px-8 py-4 rounded-2xl font-bold border border-stone-200 dark:border-stone-700 hover:bg-stone-50 transition-all">
            عن البرنامج
          </Link>
        </motion.div>
      </section>

      {recommendations.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-2 h-8 bg-accent rounded-full" />
             <h2 className="text-3xl font-black dark:text-white">مسارك التعليمي المقترح</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec, idx) => (
              <motion.div 
                key={rec.lesson.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={`/unit/${rec.unitId}/lesson/${rec.lesson.id}`}>
                  <div className={cn(
                    "p-6 rounded-3xl border-2 transition-all flex flex-col justify-between h-full",
                    rec.type === 'review' ? "bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30" : "bg-primary/5 dark:bg-primary/10 border-primary/10 dark:border-primary/20"
                  )}>
                    <div>
                      <div className={cn(
                        "text-[10px] font-black uppercase tracking-widest mb-3 inline-block px-2 py-1 rounded-md",
                        rec.type === 'review' ? "bg-red-100 text-red-600" : "bg-primary/20 text-primary dark:text-accent"
                      )}>
                        {rec.type === 'review' ? 'تحتاج مراجعة' : 'الخطوة التالية'}
                      </div>
                      <h3 className="text-xl font-bold dark:text-white mb-2">{rec.lesson.title}</h3>
                      <p className="text-stone-500 text-sm line-clamp-2">{rec.lesson.description}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-primary dark:text-accent font-bold">
                       <span>{rec.type === 'review' ? 'راجع الدرس' : 'ابدأ الآن'}</span>
                       <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <div id="units" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {curriculumData.map((unit, index) => {
          const Icon = iconMap[unit.icon as keyof typeof iconMap];
          return (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Link to={`/unit/${unit.id}`}>
                <div className={cn(
                  "h-full p-10 rounded-[2.5rem] border-2 transition-all duration-500",
                  "bg-white dark:bg-stone-900 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
                  "border-stone-50 dark:border-stone-800 group-hover:border-primary/20 dark:group-hover:border-accent/20"
                )}>
                  <div className={cn(
                    "w-16 h-16 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg",
                    unit.color
                  )}>
                    <Icon className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold text-stone-900 dark:text-white mb-4">{unit.title}</h2>
                  <p className="text-stone-600 dark:text-stone-400 mb-8 leading-relaxed line-clamp-3 text-lg font-medium">{unit.description}</p>
                  <div className="flex items-center text-primary dark:text-accent font-bold text-lg">
                    <span>استكشف الوحدة</span>
                    <ArrowRight className="w-5 h-5 mr-3 group-hover:mr-2 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function UnitView({ completedLessons, quizScores }: { completedLessons: string[], quizScores: Record<string, 'pass' | 'fail'> }) {
  const { unitId } = useParams();
  const unit = curriculumData.find(u => u.id === unitId);

  if (!unit) return <div className="text-center py-20 dark:text-white">الوحدة غير موجودة</div>;

  const Icon = iconMap[unit.icon as keyof typeof iconMap];
  const completedInUnit = unit.lessons.filter(l => completedLessons.includes(l.id)).length;
  const unitProgress = Math.round((completedInUnit / unit.lessons.length) * 100);

  return (
    <div className="space-y-12">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-stone-200 dark:border-stone-800 pb-16">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center text-stone-500 dark:text-stone-400 hover:text-primary dark:hover:text-accent font-bold transition-colors">
              <ChevronLeft className="w-4 h-4 ml-2 rotate-180" />
              العودة للرئيسية
            </Link>
            <div className="flex items-center space-x-6 space-x-reverse">
               <motion.div 
                 initial={{ scale: 0.8, rotate: -10 }}
                 animate={{ scale: 1, rotate: 0 }}
                 className={cn("p-6 rounded-3xl shadow-lg shadow-black/5", unit.color)}
               >
                 <Icon className="w-12 h-12" />
               </motion.div>
               <h1 className="text-4xl md:text-6xl font-black text-stone-900 dark:text-white">{unit.title}</h1>
            </div>
            <p className="text-2xl text-stone-600 dark:text-stone-400 max-w-3xl leading-relaxed font-medium">{unit.description}</p>
          </div>
        </div>

        {/* Unit Progress Indicator */}
        <div className="bg-white dark:bg-stone-900 p-8 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-xl overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-full h-1 bg-stone-100 dark:bg-stone-800" />
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${unitProgress}%` }}
             className="absolute top-0 right-0 h-1 bg-primary dark:bg-accent transition-all duration-1000"
           />
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                 <h2 className="text-xl font-bold dark:text-white">تقدمك في هذه الوحدة</h2>
                 <p className="text-stone-500 text-sm">أكملت {completedInUnit} من أصل {unit.lessons.length} دروس</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-4xl font-black text-primary dark:text-accent">{unitProgress}%</div>
                 <div className="w-48 h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden hidden md:block">
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: unitProgress / 100 }}
                      className="h-full bg-primary dark:bg-accent origin-right rounded-full"
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {unit.lessons.map((lesson, idx) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const score = quizScores[lesson.id];
          
          return (
            <motion.div 
              key={lesson.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={`/unit/${unit.id}/lesson/${lesson.id}`}>
                <div className={cn(
                  "bg-white dark:bg-stone-900 p-10 rounded-[3rem] border border-stone-100 dark:border-stone-800 hover:border-primary/30 dark:hover:border-accent/30 hover:shadow-2xl transition-all group overflow-hidden relative h-full flex flex-col",
                  score === 'fail' && "border-red-500/30"
                )}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-stone-50 dark:bg-stone-800 rotate-45 translate-x-12 -translate-y-12 transition-transform group-hover:scale-150 group-hover:bg-primary/5 dark:group-hover:bg-accent/5" />
                  
                  <div className="relative z-10 space-y-6 flex-1">
                    <div className="flex justify-between items-center">
                      <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl text-stone-400 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-2">
                        {isCompleted && <div className="bg-green-500/20 text-green-600 px-2 py-0.5 rounded-md text-[10px] font-bold">مكتمل</div>}
                        {score === 'pass' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        {score === 'fail' && <X className="w-4 h-4 text-red-500" />}
                        <span className="text-xs font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full">الدرس {idx + 1}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-stone-900 dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-accent transition-colors">{lesson.title}</h3>
                      <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed">{lesson.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10 pt-8 flex items-center gap-2 text-stone-400 dark:text-stone-500 font-bold group-hover:text-primary dark:group-hover:text-accent transition-colors">
                    <span>{score === 'fail' ? 'راجع الدرس وحاول مرة أخرى' : 'ابدأ التعلم الآن'}</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function CertificateView({ progress }: { progress: number }) {
  const isComplete = progress === 100;

  return (
    <div className="max-w-3xl mx-auto py-12 text-center space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold text-stone-900 dark:text-white">شهادة الإنجاز</h1>
        <p className="text-xl text-stone-600 dark:text-stone-400 font-serif italic">تقديراً لجهودك في رحلة الاستدامة</p>
      </div>

      <div className={cn(
        "relative p-2 rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.5)] transition-all duration-1000 overflow-hidden",
        isComplete ? "bg-gradient-to-br from-primary via-accent to-primary animate-gradient scale-100 opacity-100" : "bg-stone-200 dark:bg-stone-800 scale-95 opacity-50 grayscale"
      )}>
        <div className="bg-white dark:bg-stone-900 rounded-[3.3rem] p-16 space-y-12 border-8 border-white dark:border-stone-900 relative">
          {isComplete && <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.02)_100%)] pointer-events-none" />}
          
          <div className="flex justify-center relative">
            <div className={cn(
              "w-28 h-28 rounded-full flex items-center justify-center text-white shadow-2xl relative z-10",
              isComplete ? "bg-primary" : "bg-stone-400"
            )}>
              <Trophy className="w-14 h-14" />
              {isComplete && <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-primary rounded-full -z-10" />}
            </div>
          </div>
          
          <div className="space-y-8 relative z-10">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-stone-800 dark:text-white font-serif tracking-tight">سفير الاستدامة</h2>
              <div className="h-1 bg-stone-100 dark:bg-stone-800 w-32 mx-auto rounded-full" />
            </div>
            <p className="text-2xl text-stone-600 dark:text-stone-400 leading-relaxed max-w-md mx-auto font-medium">
              نفخر بتتويجكم سفيراً لمنهج <br />
              <span className="font-black text-primary dark:text-accent underline decoration-primary/10 dark:decoration-accent/10 underline-offset-8">المدارس الخضراء</span> <br />
              تقديراً لإتمامكم جميع المراحل بنجاح.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-12 border-t border-stone-100 dark:border-stone-800 relative z-10">
            <div className="text-right">
              <span className="text-sm font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest block mb-1">التاريخ</span>
              <span className="text-xl font-bold text-stone-700 dark:text-stone-300">{new Date().toLocaleDateString('ar-OM')}</span>
            </div>
            <div className="text-left">
              <span className="text-sm font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest block mb-1">الاعتماد</span>
              <span className="text-2xl font-serif italic text-primary dark:text-accent font-black">إدارة استدامة</span>
            </div>
          </div>
        </div>
      </div>

      {!isComplete && (
        <div className="bg-stone-100 dark:bg-stone-900 p-10 rounded-[3rem] border border-stone-200 dark:border-stone-800 space-y-6">
          <div className="flex flex-col items-center gap-2 text-stone-500 dark:text-stone-400">
             <Award className="w-10 h-10 mb-2 opacity-50" />
             <p className="font-black text-xl">تبقت لك {100 - Math.round(progress)}% فقط!</p>
             <p className="font-medium opacity-80">أكمل جميع الدروس للحصول على نسختك من الشهادة</p>
          </div>
          <div className="w-full max-w-md mx-auto bg-stone-200 dark:bg-stone-800 h-4 rounded-full overflow-hidden shadow-inner">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               className="h-full bg-primary"
             />
          </div>
        </div>
      )}

      {isComplete && (
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.print()}
          className="inline-flex items-center px-10 py-5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-[2rem] text-lg font-black hover:shadow-2xl shadow-stone-500/20 transition-all dark:hover:bg-accent dark:hover:text-stone-900"
        >
          تحميل كـ PDF للطباعة
        </motion.button>
      )}
    </div>
  );
}

interface QuizProps {
  lessonId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  hint?: string;
  onResult: (lessonId: string, result: 'pass' | 'fail') => void;
  savedResult?: 'pass' | 'fail';
}

function LessonQuiz({ lessonId, question, options, correctAnswer, hint, onResult, savedResult }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(!!savedResult);
  const [showHint, setShowHint] = useState(false);

  const handleCheck = () => {
    if (selected === null) return;
    const result = selected === correctAnswer ? 'pass' : 'fail';
    onResult(lessonId, result);
    setShowResult(true);
  };

  return (
    <div className="bg-stone-950 text-white rounded-[3.5rem] p-10 md:p-16 space-y-12 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -z-10" />
      
      <div className="space-y-4 relative z-10 text-center">
        <div className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-[10px] font-black tracking-widest uppercase mb-2">تحدي المهارة</div>
        <h3 className="text-3xl md:text-5xl font-black leading-tight max-w-2xl mx-auto">{question}</h3>
        {savedResult === 'pass' && <div className="text-green-400 font-bold">لقد اجتزت هذا الاختبار بنجاح مسبقاً!</div>}
        
        {hint && !showResult && (
          <div className="pt-4">
            <button 
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-2 text-stone-400 hover:text-accent transition-colors text-sm font-bold bg-stone-900/50 px-4 py-2 rounded-full border border-stone-800"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showHint ? "إخفاء التلميح" : "هل تحتاج مساعدة؟ (تلميح)"}</span>
            </button>
            <AnimatePresence>
              {showHint && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="mt-4 p-4 rounded-2xl bg-accent/5 border border-accent/20 text-accent/80 text-sm leading-relaxed italic">
                    {hint}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="grid gap-6 relative z-10">
        {options.map((option, idx) => (
          <motion.button
            key={idx}
            disabled={showResult}
            onClick={() => setSelected(idx)}
            whileHover={!showResult ? { x: -10 } : {}}
            className={cn(
              "w-full text-right p-8 rounded-[2rem] border-2 transition-all text-xl font-bold flex items-center justify-between",
              selected === idx 
                ? "border-accent bg-accent/10 text-accent shadow-[0_0_30px_rgba(132,204,22,0.2)]" 
                : "border-stone-800 bg-stone-900/50 hover:border-stone-700",
              showResult && idx === correctAnswer && "border-green-500 bg-green-500/20",
              showResult && selected === idx && idx !== correctAnswer && "border-red-500 bg-red-500/20"
            )}
          >
            <span>{option}</span>
            <div className={cn(
              "w-6 h-6 rounded-full border-2 border-stone-700 flex items-center justify-center",
              selected === idx && "border-accent bg-accent",
              showResult && idx === correctAnswer && "border-green-500 bg-green-500",
              showResult && selected === idx && idx !== correctAnswer && "border-red-500 bg-red-500"
            )}>
              {(selected === idx || (showResult && idx === correctAnswer)) && <div className="w-2.5 h-2.5 bg-stone-900 rounded-full" />}
            </div>
          </motion.button>
        ))}
      </div>

      {!showResult ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={selected === null}
          onClick={handleCheck}
          className="w-full py-6 bg-accent text-stone-950 rounded-[2rem] text-2xl font-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all shadow-xl shadow-accent/20"
        >
          تحقق من الإجابة والمتابعة
        </motion.button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-10 rounded-[2.5rem] flex items-center gap-6 font-bold text-center flex-col md:flex-row md:text-right",
            (selected === correctAnswer || savedResult === 'pass') ? "bg-green-500/10 text-green-400 border-2 border-green-500/20" : "bg-red-500/10 text-red-100 border-2 border-red-500/20"
          )}
        >
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center shrink-0",
            (selected === correctAnswer || savedResult === 'pass') ? "bg-green-500 text-stone-900" : "bg-red-500 text-white"
          )}>
            {(selected === correctAnswer || savedResult === 'pass') ? <CheckCircle2 className="w-8 h-8" /> : <X className="w-8 h-8" />}
          </div>
          <div className="space-y-1 flex-1">
             <div className="text-2xl font-black">{(selected === correctAnswer || savedResult === 'pass') ? "إجابة ملهمة!" : "كادت تكون صحيحة!"}</div>
             <p className="text-xl opacity-80 leading-relaxed font-medium">
               {(selected === correctAnswer || savedResult === 'pass') 
                 ? "أنت تظهر وعياً ممتازاً بمبادئ الاستدامة، استمر في هذا الطريق." 
                 : `الإجابة الصحيحة هي: ${options[correctAnswer]}. لا تقلق، التعلم هو رحلة مستمرة! ابحث أكثر في الدروس المقترحة.`}
             </p>
          </div>
          {savedResult === 'fail' && (
             <button onClick={() => setShowResult(false)} className="mt-4 md:mt-0 text-accent font-bold hover:underline">حاول مرة أخرى</button>
          )}
        </motion.div>
      )}
    </div>
  );
}

function ExpertQA({ lesson }: { lesson: Lesson }) {
  const [question, setQuestion] = useState("");
  const [qaList, setQaList] = useState<{ id: string, text: string, answer?: string, timestamp: number }[]>([]);
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`qa-${lesson.id}`);
    if (saved) {
      setQaList(JSON.parse(saved));
    } else {
      setQaList([]);
    }
  }, [lesson.id]);

  const saveQA = (newList: typeof qaList) => {
    setQaList(newList);
    localStorage.setItem(`qa-${lesson.id}`, JSON.stringify(newList));
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAsking) return;

    const newQuestion = {
      id: Math.random().toString(36).substring(7),
      text: question,
      timestamp: Date.now()
    };

    const updatedList = [newQuestion, ...qaList];
    saveQA(updatedList);
    setQuestion("");
    setIsAsking(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `أنت خبير بيئي متخصص في المناهج التعليمية العمانية. 
        الدرس الحالي هو: "${lesson.title}"
        محتوى الدرس: "${lesson.description} - ${lesson.content}"
        أجب على سؤال الطالب هذا بشكل تعليمي ومبسط ومشجع باللغة العربية: "${question}"`,
      });

      if (response.text) {
        const answeredList = updatedList.map(q => 
          q.id === newQuestion.id ? { ...q, answer: response.text } : q
        );
        saveQA(answeredList);
      } else {
        throw new Error("No answer returned");
      }
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="bg-stone-50 dark:bg-stone-900/50 rounded-[3rem] p-8 md:p-12 border border-stone-100 dark:border-stone-800 space-y-10">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-accent/20 text-accent rounded-2xl">
          <MessageCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold dark:text-white">اسأل خبيراً بيئياً</h3>
          <p className="text-stone-500 text-sm">لديك تساؤل حول هذا الدرس؟ خبرائنا (المدعومين بالذكاء الاصطناعي) هنا للمساعدة.</p>
        </div>
      </div>

      <form onSubmit={handleAsk} className="relative">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="اكتب سؤالك هنا..."
          className="w-full bg-white dark:bg-stone-950 p-6 rounded-3xl border-2 border-stone-100 dark:border-stone-800 focus:border-accent focus:ring-0 transition-all text-right resize-none min-h-[120px] dark:text-white"
        />
        <button 
          disabled={!question.trim() || isAsking}
          className="absolute bottom-4 left-4 p-4 bg-accent text-stone-950 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {isAsking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>

      <div className="space-y-6">
        <AnimatePresence>
          {qaList.map((qa) => (
            <motion.div 
              key={qa.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-4 justify-end">
                <div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-2xl rounded-tr-none text-stone-900 dark:text-stone-100 max-w-[80%]">
                  <div className="flex items-center gap-2 mb-1 justify-end">
                    <span className="text-[10px] text-stone-400">{new Date(qa.timestamp).toLocaleTimeString('ar-OM')}</span>
                    <User className="w-3 h-3 text-stone-400" />
                  </div>
                  <p className="font-medium">{qa.text}</p>
                </div>
              </div>

              {qa.answer ? (
                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 dark:bg-accent/5 p-6 rounded-3xl rounded-tl-none border border-accent/20 text-stone-900 dark:text-stone-100 max-w-[90%]">
                    <div className="flex items-center gap-2 mb-2">
                       <BadgeCheck className="w-4 h-4 text-accent" />
                       <span className="text-xs font-black text-accent uppercase tracking-wider">رد الخبير</span>
                    </div>
                    <div className="prose prose-stone dark:prose-invert prose-sm">
                      <ReactMarkdown>{qa.answer}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-stone-400 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">الخبير يفكر في رد...</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function LessonView({ completedLessons, onToggleComplete, onQuizResult, quizScores }: { completedLessons: string[], onToggleComplete: (id: string) => void, onQuizResult: (lessonId: string, result: 'pass' | 'fail') => void, quizScores: Record<string, 'pass' | 'fail'> }) {
  const { unitId, lessonId } = useParams();
  const unit = curriculumData.find(u => u.id === unitId);
  const lesson = unit?.lessons.find(l => l.id === lessonId);

  if (!unit || !lesson) return <div className="text-center py-20 dark:text-white">الدرس غير موجود</div>;

  const isCompleted = completedLessons.includes(lesson.id);
  const savedResult = quizScores[lesson.id];

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
        <div className="space-y-6">
          <Link to={`/unit/${unit.id}`} className="inline-flex items-center text-stone-500 dark:text-stone-400 hover:text-primary dark:hover:text-accent font-black transition-colors">
            <ChevronLeft className="w-4 h-4 ml-2 rotate-180" />
            الوحدة: {unit.title}
          </Link>
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-stone-900 dark:text-white leading-tight mb-4">{lesson.title}</h1>
            <p className="text-2xl text-stone-500 dark:text-stone-400 font-serif italic max-w-2xl">{lesson.description}</p>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onToggleComplete(lesson.id)}
          className={cn(
            "flex-shrink-0 flex items-center space-x-3 space-x-reverse px-8 py-4 rounded-[2rem] border-2 transition-all font-black text-lg",
            isCompleted 
              ? "bg-primary/10 border-primary text-primary dark:bg-accent/10 dark:border-accent dark:text-accent shadow-lg shadow-primary/10" 
              : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 hover:border-primary/50 dark:hover:border-accent/50"
          )}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-6 h-6 animate-pulse" />
              <span>درس مكتمل</span>
            </>
          ) : (
            <>
              <div className="w-6 h-6 rounded-full border-2 border-stone-300 dark:border-stone-700" />
              <span>تحديد كمكتمل</span>
            </>
          )}
        </motion.button>
      </div>
      
      <div className="prose prose-stone dark:prose-invert prose-2xl max-w-none prose-headings:font-black prose-headings:text-stone-900 dark:prose-headings:text-white prose-p:leading-relaxed prose-li:leading-relaxed">
        <div className="bg-white dark:bg-stone-900 p-10 md:p-16 rounded-[3.5rem] border border-stone-100 dark:border-stone-800 shadow-sm leading-relaxed whitespace-pre-wrap font-medium">
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </div>
      </div>

      {lesson.videoUrl && (
        <section className="space-y-8">
          <div className="flex items-center space-x-3 space-x-reverse text-primary dark:text-accent">
            <div className="p-3 bg-primary/10 dark:bg-accent/10 rounded-2xl">
              <PlayCircle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black">غوص في المحتوى</h2>
          </div>
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="aspect-video rounded-[3rem] overflow-hidden bg-stone-200 dark:bg-stone-800 border-8 border-white dark:border-stone-900 shadow-2xl shadow-black/10"
          >
             <iframe 
               className="w-full h-full"
               src={lesson.videoUrl.replace("watch?v=", "embed/")}
               title={lesson.title}
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen
             ></iframe>
          </motion.div>
        </section>
      )}

      {lesson.quiz && (
        <section className="px-2">
          <LessonQuiz 
            lessonId={lesson.id}
            question={lesson.quiz.question}
            options={lesson.quiz.options}
            correctAnswer={lesson.quiz.correctAnswer}
            hint={lesson.quiz.hint}
            onResult={onQuizResult}
            savedResult={savedResult}
          />
        </section>
      )}

      <section className="px-2">
        <ExpertQA lesson={lesson} />
      </section>

      {lesson.activity && (
        <section className="bg-gradient-to-br from-primary/5 to-accent/5 dark:from-accent/5 dark:to-primary/5 rounded-[4rem] p-10 md:p-16 border border-stone-100 dark:border-stone-800 space-y-12">
          <div className="flex items-center space-x-4 space-x-reverse text-primary dark:text-accent">
            <div className="p-4 bg-primary dark:bg-accent rounded-3xl text-white dark:text-stone-900 shadow-lg shadow-primary/20 animate-bounce">
              <FlaskConical className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-4xl font-black">تطبيق عملي</h2>
              <p className="text-stone-500 dark:text-stone-400 font-bold uppercase tracking-widest text-sm">{lesson.activity.title}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-stone-900 rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-black/[0.03] dark:shadow-none border border-stone-50 dark:border-stone-800">
            <p className="text-2xl text-stone-700 dark:text-stone-300 mb-12 font-bold italic border-r-4 border-accent pr-6">
              {lesson.activity.description}
            </p>
            <div className="grid gap-8">
              {lesson.activity.steps.map((step, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="flex gap-6 items-start group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white flex items-center justify-center font-black text-xl shadow-inner group-hover:bg-primary group-hover:text-white dark:group-hover:bg-accent dark:group-hover:text-black transition-all">
                    {idx + 1}
                  </div>
                  <div className="flex-1 text-stone-800 dark:text-stone-200 text-xl leading-relaxed pt-1.5 font-medium">
                    {step}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function App() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [quizScores, setQuizScores] = useState<Record<string, 'pass' | 'fail'>>({});
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedProgress = localStorage.getItem("sustainability_progress");
    if (savedProgress) setCompletedLessons(JSON.parse(savedProgress));

    const savedScores = localStorage.getItem("sustainability_scores");
    if (savedScores) setQuizScores(JSON.parse(savedScores));

    const savedTheme = localStorage.getItem("sustainability_theme");
    if (savedTheme === "dark") setIsDark(true);
  }, []);

  const handleToggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("sustainability_theme", next ? "dark" : "light");
  };

  const handleToggleLesson = (id: string) => {
    const newCompleted = completedLessons.includes(id)
      ? completedLessons.filter(l => l !== id)
      : [...completedLessons, id];
    setCompletedLessons(newCompleted);
    localStorage.setItem("sustainability_progress", JSON.stringify(newCompleted));
  };

  const handleQuizResult = (lessonId: string, result: 'pass' | 'fail') => {
    const newScores = { ...quizScores, [lessonId]: result };
    setQuizScores(newScores);
    localStorage.setItem("sustainability_scores", JSON.stringify(newScores));
  };

  const totalLessons = curriculumData.reduce((acc, unit) => acc + unit.lessons.length, 0);
  const progress = (completedLessons.length / totalLessons) * 100;

  return (
    <BrowserRouter>
      <Layout progress={progress} isDark={isDark} onToggleDark={handleToggleDark}>
        <Routes>
          <Route path="/" element={<Home completedLessons={completedLessons} quizScores={quizScores} />} />
          <Route path="/about" element={<About />} />
          <Route path="/certificate" element={<CertificateView progress={progress} />} />
          <Route path="/unit/:unitId" element={<UnitView completedLessons={completedLessons} quizScores={quizScores} />} />
          <Route 
            path="/unit/:unitId/lesson/:lessonId" 
            element={<LessonView 
              completedLessons={completedLessons} 
              onToggleComplete={handleToggleLesson} 
              onQuizResult={handleQuizResult}
              quizScores={quizScores}
            />} 
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
