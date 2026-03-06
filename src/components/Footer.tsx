import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-primary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <img 
              src="/images/web_logo.png" 
              alt="Trinetra Charma Chitrakari Logo" 
              className="h-16 w-auto object-contain mb-4"
            />
            <p className="text-sm text-muted-foreground leading-relaxed font-body">
              Preserving the ancient art of Tholu Bommalata through leather puppetry craft,
              bringing traditional Indian folk art to modern interiors.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-xl text-foreground mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "About Craft", path: "/about-craft" },
                { label: "Gallery", path: "/gallery" },
                { label: "Puppet Show", path: "/puppet-show" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-xl text-foreground mb-4">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-primary mt-0.5" />
                <span>9959309029, 7789893840</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>Trinetra charma chitrakari Village, Dharmavaram Mandal, Anantapur District, Andhra Pradesh, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary/10 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Trinetra charma chitrakari Leather Puppetry Craft. Dalavai Kullayappa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
