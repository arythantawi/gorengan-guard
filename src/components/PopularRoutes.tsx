import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { getRoutePrice } from '@/lib/scheduleData';
import { Typewriter } from '@/hooks/use-typewriter';
import { createSafeGsapContext, ensureElementsVisible } from '@/lib/gsapUtils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const routes = [
  { id: 1, from: 'Surabaya', to: 'Denpasar', popular: true },
  { id: 2, from: 'Malang', to: 'Denpasar', popular: true },
  { id: 3, from: 'Surabaya', to: 'Jakarta', popular: true },
  { id: 4, from: 'Surabaya', to: 'Jogja', popular: false },
  { id: 5, from: 'Malang', to: 'Surabaya', popular: false },
  { id: 6, from: 'Banyuwangi', to: 'Surabaya', popular: false },
];

const PopularRoutes = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [showDescription, setShowDescription] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleBookRoute = (from: string, to: string) => {
    const params = new URLSearchParams({ from, to });
    navigate(`/search?${params.toString()}`);
  };

  useEffect(() => {
    const ctx = createSafeGsapContext(
      sectionRef,
      () => {
        gsap.from('.route-title', {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'all',
          onComplete: () => setShowDescription(true),
        });

        gsap.from('.route-card', {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
          },
          y: 60,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'all',
        });
      },
      () => {
        setShowDescription(true);
        ensureElementsVisible(['.route-title', '.route-card']);
      }
    );

    return () => {
      ctx?.revert();
      ensureElementsVisible(['.route-title', '.route-card']);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-20 bg-muted/30">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-14 route-title">
          <span className="inline-block px-4 md:px-5 py-1.5 md:py-2 bg-primary/10 text-primary rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">
            Rute Populer
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Destinasi Favorit Pelanggan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto min-h-[2rem] text-sm md:text-base px-4">
            {showDescription && (
              <Typewriter
                text="Pilih rute perjalanan Anda dari berbagai destinasi populer di Jawa dan Bali"
                speed={25}
                showCursor={false}
              />
            )}
          </p>
        </div>

        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {routes.map((route) => {
            const price = getRoutePrice(route.from, route.to);
            return (
              <div 
                key={route.id} 
                className="route-card group bg-card rounded-xl md:rounded-2xl p-5 md:p-7 border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1"
                onClick={() => handleBookRoute(route.from, route.to)}
              >
                {route.popular && (
                  <div className="inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-accent to-yellow-500 text-accent-foreground text-xs font-bold rounded-full mb-4 md:mb-5 shadow-md">
                    <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    Populer
                  </div>
                )}
                
                <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 md:gap-2 text-sm md:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                      </div>
                      <span className="truncate">{route.from}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-8 md:w-10 flex-shrink-0">
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 md:gap-2 text-sm md:text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                      </div>
                      <span className="truncate">{route.to}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 md:pt-5 border-t border-border">
                  <div>
                    <span className="text-xs md:text-sm text-muted-foreground">Mulai dari</span>
                    <div className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {formatPrice(price)}
                    </div>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;