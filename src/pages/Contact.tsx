import Layout from "@/components/Layout";
import PageBanner from "@/components/PageBanner";
import { Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <Layout>
      <PageBanner title="Contact" />
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-2xl text-foreground mb-6">Get in Touch</h2>
              <p className="text-muted-foreground leading-relaxed mb-8 font-body text-sm">
                Interested in our leather puppetry craft items? Contact us for custom orders, bulk orders, or any inquiries about our traditional art.
              </p>

              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg gradient-warm flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-heading text-lg text-foreground">Phone</p>
                    <p className="text-sm text-muted-foreground font-body">9959309029</p>
                    <p className="text-sm text-muted-foreground font-body">7789893840</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg gradient-warm flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-heading text-lg text-foreground">Address</p>
                    <p className="text-sm text-muted-foreground font-body">
                      Nimmalakunta Village,<br />
                      Dharmavaram Mandal,<br />
                      Anantapur District,<br />
                      Andhra Pradesh, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg gradient-warm flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-heading text-lg text-foreground">Visiting Hours</p>
                    <p className="text-sm text-muted-foreground font-body">
                      Open for visitors daily.<br />
                      Prior appointment recommended.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-foreground mb-6">Send a Message</h2>
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="bg-card border border-primary/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 font-body"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="bg-card border border-primary/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 font-body"
                />
                <input
                  type="tel"
                  placeholder="Your Phone"
                  className="bg-card border border-primary/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 font-body"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="bg-card border border-primary/10 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 font-body resize-none"
                />
                <button
                  type="submit"
                  className="gradient-warm px-8 py-3 text-sm tracking-widest uppercase text-primary-foreground font-medium rounded hover:opacity-90 transition-opacity"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
