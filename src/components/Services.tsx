import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CalendarClock, Wallet, Smartphone, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: CalendarClock,
    title: 'Berangkat Setiap Hari',
    description: 'Jadwal keberangkatan tersedia setiap hari',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Wallet,
    title: 'Harga Terjangkau',
    description: 'Tarif kompetitif untuk semua rute',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Smartphone,
    title: 'Pesan Via Online',
    description: 'Proses booking cepat dan mudah',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial visible state first (in case ScrollTrigger fails)
      gsap.set('.service-title', { opacity: 1, y: 0 });
      gsap.set('.service-card', { opacity: 1, y: 0 });

      // Then animate from hidden state
      gsap.fromTo('.service-title', 
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out'
        }
      );

      gsap.fromTo('.service-card', 
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out'
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container">
        <div className="service-title text-center mb-14">
          <span className="inline-block px-5 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            Layanan Kami
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Kemudahan Perjalanan Anda
          </h2>
        </div>

        <div className="services-grid grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card group relative bg-card rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-primary/20 overflow-hidden hover:-translate-y-2"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className={`w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <service.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>

                <div className="flex items-center text-primary font-medium text-sm group-hover:gap-3 transition-all duration-300">
                  <span>Selengkapnya</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
