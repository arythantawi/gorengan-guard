import { useEffect, useRef, useState } from 'react';
import { Users, MapPin, Calendar, Award, TrendingUp, Bus } from 'lucide-react';
import { createSafeGsapContext, ensureElementsVisible, prefersReducedMotion } from '@/lib/gsapUtils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: StatItem[] = [
  { icon: Users, value: 15000, suffix: '+', label: 'Pelanggan Puas', color: 'from-blue-500 to-cyan-500' },
  { icon: Bus, value: 50000, suffix: '+', label: 'Perjalanan Sukses', color: 'from-emerald-500 to-teal-500' },
  { icon: MapPin, value: 15, suffix: '+', label: 'Kota Tujuan', color: 'from-amber-500 to-orange-500' },
  { icon: Calendar, value: 8, suffix: ' Tahun', label: 'Pengalaman', color: 'from-purple-500 to-pink-500' },
];

const StatsCounter = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);

  const animateCounters = () => {
    stats.forEach((stat, index) => {
      const duration = 2000;
      const startTime = Date.now();
      const startValue = 0;
      const endValue = stat.value;

      const updateCount = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
        
        setCounts(prev => {
          const newCounts = [...prev];
          newCounts[index] = currentValue;
          return newCounts;
        });

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      setTimeout(() => {
        requestAnimationFrame(updateCount);
      }, index * 150);
    });
  };

  useEffect(() => {
    // If reduced motion, start counters immediately
    if (prefersReducedMotion()) {
      setCounts(stats.map(s => s.value));
      setHasAnimated(true);
      return;
    }

    const ctx = createSafeGsapContext(
      sectionRef,
      () => {
        gsap.from('.stats-title', {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'all',
        });

        gsap.from('.stat-card', {
          scrollTrigger: {
            trigger: '.stats-grid',
            start: 'top 85%',
          },
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'all',
        });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 75%',
          onEnter: () => {
            if (!hasAnimated) {
              animateCounters();
              setHasAnimated(true);
            }
          }
        });
      },
      () => {
        ensureElementsVisible(['.stats-title', '.stat-card']);
        setCounts(stats.map(s => s.value));
        setHasAnimated(true);
      }
    );

    return () => {
      ctx?.revert();
      ensureElementsVisible(['.stats-title', '.stat-card']);
    };
  }, [hasAnimated]);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'rb';
    }
    return num.toString();
  };

  return (
    <section ref={sectionRef} className="py-12 md:py-20 bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 md:w-[500px] h-80 md:h-[500px] bg-accent/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="container relative z-10 px-4 sm:px-6">
        <div className="stats-title text-center mb-10 md:mb-14">
          <span className="inline-block px-4 md:px-5 py-1.5 md:py-2 bg-white/10 backdrop-blur-sm text-primary-foreground rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4 border border-white/20">
            Pencapaian Kami
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-3 md:mb-4">
            Dipercaya Ribuan Pelanggan
          </h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto text-sm md:text-lg">
            Komitmen kami untuk memberikan pelayanan terbaik
          </p>
        </div>

        <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card group relative bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 text-center"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 md:mb-5 rounded-xl md:rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" strokeWidth={1.5} />
              </div>

              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-1 md:mb-2 font-display">
                {stat.value >= 1000 ? formatNumber(counts[index]) : counts[index]}
                <span className="text-accent">{stat.suffix}</span>
              </div>

              <p className="text-primary-foreground/70 font-medium text-xs sm:text-sm md:text-base">
                {stat.label}
              </p>

              <div className={`absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`} />
            </div>
          ))}
        </div>

        <div className="mt-10 md:mt-14 flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-10">
          <div className="flex items-center gap-1.5 md:gap-2 text-primary-foreground/60">
            <Award className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-sm font-medium">Terdaftar Resmi</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 text-primary-foreground/60">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-sm font-medium">Rating 4.9/5</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 text-primary-foreground/60">
            <Users className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-sm font-medium">Driver Profesional</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;