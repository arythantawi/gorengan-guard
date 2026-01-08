import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Ship, Utensils, UserCheck, CalendarDays, MapPinned, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const facilities = [
  {
    icon: Ship,
    text: 'Sudah Termasuk Tiket Penyebrangan',
  },
  {
    icon: Utensils,
    text: 'Free Makan 1x dan Snack',
  },
  {
    icon: UserCheck,
    text: 'Driver Berpengalaman',
  },
  {
    icon: CalendarDays,
    text: 'Berangkat Setiap Hari',
  },
  {
    icon: MapPinned,
    text: 'Door To Door Service',
  },
];

const Facilities = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.facility-item', {
        scrollTrigger: {
          trigger: '.facilities-list',
          start: 'top 85%',
        },
        x: -30,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        clearProps: 'all',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-primary">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Title */}
            <div className="flex-shrink-0">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground border-b-4 border-primary-foreground/30 pb-2">
                FASILITAS :
              </h2>
            </div>

            {/* Facilities List */}
            <div className="facilities-list flex-1">
              <ul className="space-y-3">
                {facilities.map((facility, index) => (
                  <li
                    key={index}
                    className="facility-item flex items-center gap-3 text-primary-foreground"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
                    </div>
                    <span className="text-lg font-medium">{facility.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Facilities;
