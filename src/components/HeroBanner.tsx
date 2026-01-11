import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  link_url: string | null;
  button_text: string | null;
}

// Helper function to convert Google Drive links to direct image URL
const convertGoogleDriveUrl = (url: string | null): string | null => {
  if (!url) return url;
  
  // Pattern 1: https://drive.google.com/file/d/{FILE_ID}/view...
  const filePattern = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const fileMatch = url.match(filePattern);
  if (fileMatch) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  }
  
  // Pattern 2: https://drive.google.com/open?id={FILE_ID}
  const openPattern = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
  const openMatch = url.match(openPattern);
  if (openMatch) {
    return `https://lh3.googleusercontent.com/d/${openMatch[1]}`;
  }
  
  // Pattern 3: https://drive.google.com/uc?id={FILE_ID}...
  const ucPattern = /drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/;
  const ucMatch = url.match(ucPattern);
  if (ucMatch) {
    return `https://lh3.googleusercontent.com/d/${ucMatch[1]}`;
  }
  
  return url;
};

const HeroBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data) {
        setBanners(data);
      }
      setIsLoading(false);
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Animate content on banner change
  useEffect(() => {
    if (contentRef.current && banners.length > 0) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [currentIndex, banners.length]);

  // Scroll animation
  useEffect(() => {
    if (!sectionRef.current || banners.length === 0) return;
    
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    return () => ctx.revert();
  }, [banners.length]);

  if (isLoading || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <section ref={sectionRef} className="py-16 bg-background">
      <div className="container">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-primary/80 min-h-[320px] md:min-h-[380px]">
          {/* Background Image with smooth transition */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{ 
              backgroundImage: currentBanner.image_url ? `url(${convertGoogleDriveUrl(currentBanner.image_url)})` : undefined,
              opacity: currentBanner.image_url ? 1 : 0
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
          </div>

          {/* Content */}
          <div ref={contentRef} className="relative z-10 flex flex-col items-center justify-center text-center p-8 md:p-12 min-h-[320px] md:min-h-[380px]">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-3xl leading-tight">
              {currentBanner.title}
            </h2>
            {currentBanner.subtitle && (
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
                {currentBanner.subtitle}
              </p>
            )}
            {currentBanner.link_url && currentBanner.button_text && (
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <a href={currentBanner.link_url}>{currentBanner.button_text}</a>
              </Button>
            )}
          </div>

          {/* Navigation Arrows - Minimal style */}
          {banners.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border border-white/10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border border-white/10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots Indicator - Minimal style */}
          {banners.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/40 w-2 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
