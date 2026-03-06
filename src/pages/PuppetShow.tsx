import Layout from "@/components/Layout";
import PageBanner from "@/components/PageBanner";

const PuppetShow = () => {
  return (
    <Layout>
      <PageBanner title="Puppet Show" />
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">
            Tolubommalata — Andhra Pradesh
          </h2>
          <h3 className="font-heading text-xl text-primary mb-6 italic">The Puppet Show Process</h3>
          <p className="text-muted-foreground leading-relaxed mb-8 font-body text-sm">
            Tholu Bommalata is the ancient folk art. The leather puppets are made with finished goat leather around 5 to 6 feet height with utmost skill by the artists themselves. These puppets are painted with locally made natural colours according to the nature of the roles. These colours are also prepared by the artists at their own. They design the curvatures and paint them.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8 font-body text-sm">
            After that they are preserved very safely and securely for use anytime and anywhere. When demonstrating this Art in the form of puppetry show, they use a very thin and lengthy transparent cloth as the screen.
          </p>

          <div className="my-12">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-card">
              <img
                src="/images/video-img.jpg"
                alt="Tholu Bommalata puppet show"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <a
                  href="https://www.youtube.com/watch?v=UeuGY7FecNw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-full gradient-warm flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </a>
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3 font-body">
              Tholu Bommalata - Traditional South Indian Art Form
            </p>
          </div>

          <div className="bg-card border border-primary/10 rounded-lg p-8 mt-12">
            <h3 className="font-display text-xl text-foreground mb-4">About the Performance</h3>
            <p className="text-muted-foreground leading-relaxed font-body text-sm">
              The puppet show is performed with traditional music and narration, bringing to life stories from the great Indian epics — Ramayana, Mahabharata, and Bhagavatha. The artists manipulate the translucent leather puppets behind a lit screen, creating a magical shadow play that has entertained audiences for centuries.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PuppetShow;
