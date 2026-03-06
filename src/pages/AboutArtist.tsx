import Layout from "@/components/Layout";
import PageBanner from "@/components/PageBanner";

const AboutArtist = () => {
  return (
    <Layout>
      <PageBanner title="About the Artist" />
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <img
              src="/images/artist.jpg"
              alt="Dalavai Kullayappa"
              className="w-full rounded-lg shadow-xl"
            />
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">Dalavai Kullayappa</h2>
              <p className="text-primary text-sm mb-6 font-body">S/o. D. Chinna Narayana</p>
              <p className="text-muted-foreground leading-relaxed mb-6 font-body text-sm">
                I, named Dalavai Kullayappa, have learnt this ART from my father. This art was a familiar livelihood for our family since ages. So, from childhood I have accustomed to this art and having lot of skills in this craft.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6 font-body text-sm">
                After my father's demise, I and my brothers D. Raju and D. Durgesh along with other 50 Artists of our community are doing this craft items. We have become professionals in this Craft.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="font-display text-xl text-foreground mb-8">Awards & Recognition</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { year: "2010", title: "National Award", desc: "For excellence in leather puppetry craft" },
                { year: "2012", title: "UNESCO Award of Excellence", desc: "International recognition for handicrafts" },
                { year: "—", title: "Honorary Degree", desc: "From the University of Vietnam" },
                { year: "—", title: "India & Telugu Book of Records", desc: "Recognized in national records" },
              ].map((award) => (
                <div key={award.title} className="bg-card border border-primary/10 rounded-lg p-6">
                  <p className="font-display text-2xl text-primary mb-2">{award.year}</p>
                  <p className="font-heading text-lg text-foreground mb-2">{award.title}</p>
                  <p className="text-xs text-muted-foreground font-body">{award.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <p className="text-muted-foreground leading-relaxed font-body text-sm">
              I have also participated in about 180 local Exhibitions and some Foreign Exhibitions, showcasing the rich tradition of Nimmalakunta leather puppetry craft to audiences worldwide.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutArtist;
