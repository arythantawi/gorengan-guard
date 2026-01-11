import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tag, Gift, Percent, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { createSafeGsapContext, ensureElementsVisible } from '@/lib/gsapUtils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Promo {
  id: string;
  title: string;
  description: string | null;
  discount_text: string | null;
  promo_code: string | null;
  start_date: string | null;
  end_date: string | null;
}

const PromoSection = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchPromos = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('promos')
        .select('*')
        .eq('is_active', true)
        .or(`start_date.is.null,start_date.lte.${today}`)
        .or(`end_date.is.null,end_date.gte.${today}`);

      if (!error && data) {
        setPromos(data);
      }
      setIsLoading(false);
    };

    fetchPromos();
  }, []);

  useEffect(() => {
    if (promos.length === 0) return;

    const ctx = createSafeGsapContext(
      sectionRef,
      () => {
        gsap.from('.promo-title', {
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

        gsap.from('.promo-card', {
          scrollTrigger: {
            trigger: '.promo-grid',
            start: 'top 85%',
          },
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          clearProps: 'all',
        });
      },
      () => {
        ensureElementsVisible(['.promo-title', '.promo-card']);
      }
    );

    return () => {
      ctx?.revert();
      ensureElementsVisible(['.promo-title', '.promo-card']);
    };
  }, [promos.length]);

  if (isLoading || promos.length === 0) return null;

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container">
        <div className="promo-title text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 px-5 py-2.5 rounded-full mb-4">
            <Gift className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold text-accent">Promo Spesial</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Penawaran Terbaik Untuk Anda
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dapatkan diskon menarik untuk perjalanan Anda
          </p>
        </div>

        <div className="promo-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="promo-card group bg-card rounded-2xl border border-border p-7 hover:shadow-xl transition-all duration-500 relative overflow-hidden hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Percent className="w-7 h-7 text-accent" />
                  </div>
                  {promo.discount_text && (
                    <Badge className="bg-gradient-to-r from-accent to-yellow-500 text-accent-foreground text-lg px-4 py-1.5 font-bold shadow-lg">
                      {promo.discount_text}
                    </Badge>
                  )}
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {promo.title}
                </h3>
                
                {promo.description && (
                  <p className="text-muted-foreground mb-5 leading-relaxed">
                    {promo.description}
                  </p>
                )}

                {promo.promo_code && (
                  <div 
                    onClick={() => copyPromoCode(promo.promo_code!)}
                    className="bg-muted rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-muted/80 transition-colors border-2 border-dashed border-primary/20 hover:border-primary/40"
                  >
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-primary" />
                      <span className="font-mono font-bold text-lg text-foreground tracking-wider">
                        {promo.promo_code}
                      </span>
                    </div>
                    {copiedCode === promo.promo_code ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="w-4 h-4" />
                        <span className="text-xs font-medium">Tersalin!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                        <Copy className="w-4 h-4" />
                        <span className="text-xs">Salin</span>
                      </div>
                    )}
                  </div>
                )}

                {promo.end_date && (
                  <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Berlaku hingga {new Date(promo.end_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;