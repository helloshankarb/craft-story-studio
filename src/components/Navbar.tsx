import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Palette } from "lucide-react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About Craft", path: "/about-craft" },
  { label: "About the Artist", path: "/about-artist" },
  { label: "Gallery", path: "/gallery" },
  { label: "Puppet Show", path: "/puppet-show" },
  { label: "Craft Items", path: "/craft-items" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-lg shadow-lg shadow-primary/5"
          : "bg-background/80 backdrop-blur-md"
      } border-b border-primary/10`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/images/web_logo.png"
                alt="Trinetra Charma Chitrakari Logo"
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-lg md:text-xl tracking-wider text-primary block">
                Trinetra Charma
              </span>
              <span className="font-display text-xs tracking-[0.3em] text-muted-foreground uppercase">
                Chitrakari
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-2">
            {navItems.slice(0, -1).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 text-sm tracking-wide transition-all duration-300 ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary transition-all duration-300 ${
                    location.pathname === item.path
                      ? "w-1/2"
                      : "w-0 group-hover:w-1/2"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* CTA Button & Phone */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:9959309029"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>9959309029</span>
            </a>
            <Link
              to="/contact"
              className="gradient-warm px-5 py-2.5 text-sm font-medium tracking-wide rounded-full hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="bg-background/98 backdrop-blur-lg border-t border-primary/10">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-3 text-sm tracking-wide rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? "text-primary bg-primary/10 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-3 border-t border-primary/10 mt-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>9959309029, 7789893840</span>
            </div>
            <Link
              to="/contact"
              className="gradient-warm mx-4 my-2 py-3 text-center text-sm font-medium tracking-wide rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Quote
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
