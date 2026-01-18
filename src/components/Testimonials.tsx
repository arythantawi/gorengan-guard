import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Star, Quote, MapPin, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Typewriter } from '@/hooks/use-typewriter';
import { createSafeGsapContext, ensureElementsVisible } from '@/lib/gsapUtils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  id: string;
  customer_name: string;
  customer_photo_url: string | null;
  customer_location: string | null;
  rating: number;
  testimonial_text: string;
  route_taken: string | null;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data) {
        setTestimonials(data);
      }
      setIsLoading(false);
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;

    const ctx = createSafeGsapContext(
      sectionRef,
      () => {
        gsap.from('.testimonial-title', {
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

        gsap.from('.testimonial-stats', {
          scrollTrigger: {
            trigger: '.testimonial-stats',
            start: 'top 85%',
          },
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'all',
        });

        gsap.from('.testimonial-card', {
          scrollTrigger: {
            trigger: '.testimonial-card',
            start: 'top 85%',
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'all',
        });

        gsap.from('.testimonial-nav', {
          scrollTrigger: {
            trigger: '.testimonial-nav',
            start: 'top 90%',
          },
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all',
        });
      },
      () => {
        setShowDescription(true);
        ensureElementsVisible(['.testimonial-title', '.testimonial-stats', '.testimonial-card', '.testimonial-nav']);
      }
    );

    return () => {
      ctx?.revert();
      ensureElementsVisible(['.testimonial-title', '.testimonial-stats', '.testimonial-card', '.testimonial-nav']);
    };
  }, [testimonials.length]);

  // Animate on slide change
  useEffect(() => {
    if (cardRef.current && testimonials.length > 0) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [currentIndex, testimonials.length]);

  if (isLoading || testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-muted-foreground/30'
        }`}
      />
    ));
  };

  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return (
    <section ref={sectionRef} className="py-12 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 sm:px-6">
        <div className="testimonial-title text-center mb-10 md:mb-14">
          <span className="inline-block px-4 md:px-5 py-1.5 md:py-2 bg-primary/10 text-primary rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">
            Testimoni Pelanggan
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto min-h-[2rem] text-sm md:text-base">
            {showDescription && (
              <Typewriter
                text="Kepuasan pelanggan adalah prioritas utama kami"
                speed={30}
                showCursor={false}
              />
            )}
          </p>
        </div>

        <div className="testimonial-stats flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-16 mb-10 md:mb-14">
          <div className="text-center">
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-1 md:mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-0.5 md:gap-1 mb-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">Rating Rata-rata</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-1 md:mb-2">
              {testimonials.length}+
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-3 md:mt-4">Ulasan Pelanggan</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-1 md:mb-2">
              98%
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-3 md:mt-4">Pelanggan Puas</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div 
            ref={cardRef}
            className="testimonial-card relative bg-card rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 border border-border/50 shadow-xl"
          >
            <div className="absolute -top-4 md:-top-6 left-6 md:left-8 lg:left-12">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Quote className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
              </div>
            </div>

            <div className="flex items-center gap-0.5 md:gap-1 mb-4 md:mb-6 pt-2 md:pt-4">
              {renderStars(currentTestimonial.rating)}
            </div>

            <blockquote className="text-base md:text-lg lg:text-xl text-foreground leading-relaxed mb-6 md:mb-8 font-medium">
              "{currentTestimonial.testimonial_text}"
            </blockquote>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                  {currentTestimonial.customer_photo_url ? (
                    <img 
                      src={currentTestimonial.customer_photo_url} 
                      alt={currentTestimonial.customer_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm md:text-base">
                    {currentTestimonial.customer_name}
                  </h4>
                  {currentTestimonial.customer_location && (
                    <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {currentTestimonial.customer_location}
                    </p>
                  )}
                </div>
              </div>

              {currentTestimonial.route_taken && (
                <div className="px-3 md:px-4 py-1.5 md:py-2 bg-primary/10 text-primary text-xs md:text-sm font-medium rounded-full self-start sm:self-auto">
                  {currentTestimonial.route_taken}
                </div>
              )}
            </div>
          </div>

          <div className="testimonial-nav flex items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8">
            <button
              onClick={goToPrevious}
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-md"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-primary w-8' 
                      : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-md"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;