import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo44Trans from '@/assets/logo-44trans.png';
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navLinks = [{
    href: '#rute',
    label: 'Rute'
  }, {
    href: '#pembayaran',
    label: 'Pembayaran'
  }, {
    href: '#kontak',
    label: 'Kontak'
  }];
  const trackLink = {
    to: '/track',
    label: 'Cek Pesanan'
  };
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-card/95 backdrop-blur-lg shadow-lg border-b border-border/50' : 'bg-transparent'}`}>
      <div className="container px-4 sm:px-6">
        <nav className="flex items-center justify-between h-14 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-9 h-9 sm:w-10 md:w-12 sm:h-10 md:h-12 rounded-full border-2 border-primary/50 bg-white/90 p-0.5 shadow-sm flex-shrink-0">
              <img src={logo44Trans} alt="44 Trans Jawa Bali" className="w-full h-full object-contain rounded-full" />
            </div>
            <span className={`font-display font-bold text-sm sm:text-base md:text-lg ${isScrolled ? 'text-foreground' : 'text-white'} hidden xs:inline sm:inline`}>44 TRANS JAWA BALI</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => <a key={link.href} href={link.href} className={`font-medium transition-colors hover:text-accent ${isScrolled ? 'text-foreground' : 'text-white/90'}`}>
                {link.label}
              </a>)}
            <Link to={trackLink.to} className={`font-medium transition-colors hover:text-accent flex items-center gap-1.5 ${isScrolled ? 'text-foreground' : 'text-white/90'}`}>
              <Search className="w-4 h-4" />
              {trackLink.label}
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="cta-btn relative flex justify-center items-center rounded-md bg-[#183153] shadow-[0px_6px_24px_0px_rgba(0,0,0,0.2)] overflow-hidden cursor-pointer border-none group">
              <span className="absolute inset-0 w-0 bg-accent transition-all duration-400 ease-in-out right-0 group-hover:w-full group-hover:left-0" />
              <span className="relative text-center w-full px-5 py-3 text-white text-sm font-bold tracking-[0.2em] z-20 transition-all duration-300 ease-in-out group-hover:text-[#183153] group-hover:animate-[scaleUp_0.3s_ease-in-out]">
                ​LOGIN
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2" aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={isMobileMenuOpen}>
            {isMobileMenuOpen ? <X className={`w-6 h-6 ${isScrolled ? 'text-foreground' : 'text-white'}`} /> : <Menu className={`w-6 h-6 ${isScrolled ? 'text-foreground' : 'text-white'}`} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && <div className="md:hidden bg-card border-t border-border py-4 px-2 animate-fade-up">
            <div className="flex flex-col gap-2">
              {navLinks.map(link => <a key={link.href} href={link.href} className="px-4 py-3 rounded-lg text-foreground font-medium hover:bg-secondary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  {link.label}
                </a>)}
              <Link to="/track" className="flex items-center gap-2 px-4 py-3 rounded-lg text-foreground font-medium hover:bg-secondary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                <Search className="w-4 h-4" />
                Cek Pesanan
              </Link>
              <a href="tel:+6281234567890" className="flex items-center gap-2 px-4 py-3 rounded-lg text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>0812-3456-7890</span>
              </a>
              <button className="cta-btn relative flex justify-center items-center rounded-md bg-[#183153] shadow-[0px_6px_24px_0px_rgba(0,0,0,0.2)] overflow-hidden cursor-pointer border-none group mx-4 mt-2 w-[calc(100%-2rem)]">
                <span className="absolute inset-0 w-0 bg-accent transition-all duration-400 ease-in-out right-0 group-hover:w-full group-hover:left-0" />
                <span className="relative text-center w-full px-5 py-3 text-white text-sm font-bold tracking-[0.2em] z-20 transition-all duration-300 ease-in-out group-hover:text-[#183153] group-hover:animate-[scaleUp_0.3s_ease-in-out]">
                  PESAN SEKARANG
                </span>
              </button>
            </div>
          </div>}
      </div>
    </header>;
};
export default Navbar;