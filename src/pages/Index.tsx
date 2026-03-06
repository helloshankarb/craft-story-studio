import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const AnimatedSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!divRef.current || isVisible) return;
      
      const rect = divRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Trigger when element is 20% into the viewport
      if (rect.top < windowHeight * 0.8) {
        setIsVisible(true);
      }
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  return (
    <div
      ref={divRef}
      className={`${className} ${isVisible ? "animate-slide-in-right visible" : "animate-slide-in-right"}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

const Index = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section with Image */}
      <section className="relative h-screen w-full overflow-hidden -mt-20">
        <div className="absolute inset-0">
          <img
            src="/images/landing-craft.jpg"
            alt="Leather Puppetry Craft - Tholu Bommalata"
            className="w-full h-full object-cover hero-fade-zoom"
          />
        </div>
        <div className="absolute inset-0 bg-background/50" />
        <div className="absolute inset-0 gradient-dark-overlay" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-sm md:text-base tracking-[0.4em] uppercase text-primary/80 mb-4 animate-slide-in-left font-body overflow-hidden">
            <span className="inline-block">Welcome to</span>
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wider text-foreground text-glow mb-6 animate-slide-in-left-delay-1 overflow-hidden">
            <span className="inline-block">Trinetra Charma Chitrakari</span>
          </h1>
          <h2 className="font-heading text-xl md:text-3xl italic text-primary mb-8 animate-slide-in-left-delay-2 overflow-hidden">
            <span className="inline-block">Trinetra Charma Chitrakari</span>
          </h2>
          <p className="max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed mb-10 animate-slide-in-left-delay-3 font-body overflow-hidden">
            <span className="inline-block">An ancient folk art of Andhra Pradesh — Tholu Bommalata — transformed into exquisite craft art for modern interiors</span>
          </p>
          <Link
            to="/about-craft"
            className="gradient-warm px-8 py-3 text-sm tracking-widest uppercase text-primary-foreground font-medium rounded animate-slide-in-left-delay-4 hover:opacity-90 transition-opacity"
          >
            Explore the Craft
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3 font-body">The Ancient Art</p>
                <h2 className="font-display text-3xl md:text-4xl tracking-wide text-foreground mb-6">
                  Tholu Bommalata
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 font-body text-sm">
                  The Art of Leather puppetry craft is an ancient form of folk Arts in Andhra Pradesh, India. It was an Art of Livelihood in Anantapur district, while Nimmalakunta, a remote village in Dharmavaram Mandal is famous for it. Many puppetry Artists from this village have shown extraordinary efforts in this Art.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8 font-body text-sm">
                  Primarily these craft items are made with goat leather using naturally available material, natural dye colours and iron frames. The carving, holing and crafting on leather give looks like living things. At present, items include Lamp Shades, Paintings, Wall hangings, Door hangings, partitions and modern puppets — nearly 150 types of items.
                </p>
                <Link
                  to="/about-craft"
                  className="text-primary text-sm tracking-wide hover:underline underline-offset-4"
                >
                  Read More →
                </Link>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="relative">
                <img
                  src="/images/landing-craft.jpg"
                  alt="Ramayana themed leather puppetry painting - Tholu Bommalata art"
                  className="w-full rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-primary/30 rounded-lg" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3 font-body">Heritage</p>
              <h2 className="font-display text-3xl md:text-4xl tracking-wide text-foreground mb-8">
                History of the Craft
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 font-body text-sm">
                The origin of this craft is the Art of Tholu Bommalata — the traditional cultural art of the region. This folk Art was used by people who migrated from Maharashtra around 700 years back. This play was demonstrated whole night with the theme of epics and was honored by the Kings of that time.
              </p>
              <p className="text-muted-foreground leading-relaxed font-body text-sm">
                Our Grand Father about 90 years back came to Nimmalakunta village and settled here demonstrating this Art. After decrease in honor due to the Film industry, our Father D. Chinna Narayana and other Artists started this Craft with Tholubommalu method, making Lamps, Paintings and Wall hangings. Gradually this Craft has become one of the famous crafts in India today.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Artist Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection delay={0.2}>
              <div className="order-2 lg:order-1 relative">
                <img
                  src="/images/artist.jpg"
                  alt="Dalavai Kullayappa"
                  className="w-full rounded-lg shadow-2xl"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="order-1 lg:order-2">
                <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3 font-body">Master Craftsman</p>
                <h2 className="font-display text-3xl md:text-4xl tracking-wide text-foreground mb-6">
                  About the Artist
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 font-body text-sm">
                  I, named Dalavai Kullayappa, S/o. D. Chinna Narayana have learnt this ART from my father. This art was a familiar livelihood for our family since ages. From childhood I have accustomed to this art and having lot of skills in this craft.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { year: "2010", award: "National Award" },
                    { year: "2012", award: "UNESCO Award of Excellence" },
                    { year: "—", award: "Honorary Degree, Vietnam" },
                    { year: "180+", award: "Exhibitions" },
                  ].map((item) => (
                    <div key={item.award} className="border border-primary/10 rounded-lg p-4">
                      <p className="font-display text-lg text-primary">{item.year}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-body">{item.award}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/about-artist"
                  className="text-primary text-sm tracking-wide hover:underline underline-offset-4"
                >
                  Learn More →
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3 font-body">Our Work</p>
              <h2 className="font-display text-3xl md:text-4xl tracking-wide text-foreground">
                Gallery
              </h2>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                "/images/WhatsApp Image 2026-03-04 at 10.32.29 AM.jpeg",
                "/images/WhatsApp Image 2026-03-04 at 10.32.31 AM.jpeg",
                "/images/WhatsApp Image 2026-03-04 at 10.32.36 AM.jpeg",
                "/images/WhatsApp Image 2026-03-04 at 10.32.38 AM.jpeg",
                "/images/WhatsApp Image 2026-03-04 at 10.32.40 AM.jpeg",
                "/images/WhatsApp Image 2026-03-04 at 10.32.44 AM.jpeg",
                "/images/WhatsApp Image 2026-03-04 at 10.32.45 AM.jpeg",
                "/images/WhatsApp Image 2026-03-04 at 10.32.46 AM.jpeg",
              ].map((src, i) => (
                <div key={i} className="relative group overflow-hidden rounded-lg aspect-square">
                  <img
                    src={src}
                    alt={`Craft item ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="text-center mt-10">
              <Link
                to="/gallery"
                className="gradient-warm inline-block px-8 py-3 text-sm tracking-widest uppercase text-primary-foreground font-medium rounded hover:opacity-90 transition-opacity"
              >
                View Full Gallery
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl tracking-wide text-foreground mb-4">
              Get in Touch
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto font-body text-sm">
              Interested in our craft items for your home or business? Contact us for custom orders and inquiries.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="gradient-warm px-8 py-3 text-sm tracking-widest uppercase text-primary-foreground font-medium rounded hover:opacity-90 transition-opacity"
              >
                Contact Us
              </Link>
              <a
                href="tel:9959309029"
                className="border border-primary/30 px-8 py-3 text-sm tracking-widest uppercase text-primary rounded hover:bg-primary/5 transition-colors"
              >
                Call Now
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Index;
