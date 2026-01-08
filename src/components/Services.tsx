import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CalendarClock, Wallet, Smartphone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: CalendarClock,
    title: 'BERANGKAT SETIAP HARI',
    iconBg: 'from-blue-400 to-blue-600',
  },
  {
    icon: Wallet,
    title: 'HARGA TERJANGKAU',
    iconBg: 'from-amber-400 to-amber-600',
  },
  {
    icon: Smartphone,
    title: 'PESAN VIA ONLINE',
    iconBg: 'from-sky-400 to-sky-600',
  },
];

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state to visible first
      gsap.set('.service-card', { opacity: 1, y: 0 });
      
      gsap.from('.service-card', {
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 90%',
        },
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        clearProps: 'all',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Layanan Kami
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Kemudahan Perjalanan Anda
          </h2>
        </div>

        <div className="services-grid grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card group bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/20 text-center"
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${service.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground tracking-wide">
                {service.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
