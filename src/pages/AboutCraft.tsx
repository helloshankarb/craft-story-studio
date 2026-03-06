import Layout from "@/components/Layout";
import PageBanner from "@/components/PageBanner";

const AboutCraft = () => {
  return (
    <Layout>
      <PageBanner title="About the Craft" />
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">The Art of Leather Puppetry</h2>
            <p className="text-muted-foreground leading-relaxed mb-6 font-body text-sm">
              The Art of Leather puppetry craft is an ancient form of folk Arts in Andhra Pradesh, India. It was an Art of Livelihood in Anantapur district of Andhra Pradesh, while Nimmalakunta, a remote village in Dharmavaram Mandal is famous for it. Many puppetry Artists from this village have shown extraordinary efforts in this Art.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6 font-body text-sm">
              This art was famous by the name Tholu Bommalata and now the ancient form of this Art has been transformed into Craft Art by the way of interior designing and giving livelihood opportunities in the region. Primarily these craft items are made with goat leather. The main reason behind it is that the process of this Art is done traditionally using naturally available material, natural dye colours as well as iron frames.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6 font-body text-sm">
              This professional art is being made by the Artists using traditional tools with skilled workmanship by designing the pictures and designs on the leather and then dying with beautiful colours. The carving, holing and crafting as well as designing on leather give looks like living things.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">Craft Items</h2>
            <p className="text-muted-foreground leading-relaxed mb-6 font-body text-sm">
              At present the items made through this craft are Lamp Shades, Paintings, Wall hangings, Door hangings, partitions and modern puppets which are very popularly used in interior designing now a days. Nearly 150 types of items are made in this village as household activity and marketed locally and outside markets.
            </p>
            <p className="text-muted-foreground leading-relaxed font-body text-sm">
              Importance is being given for Indian epics like Ramayana, Maha Bharatha and Bhagavatha in preparation of models and puppets as well as modern designs as a background theme. Western designing also practiced by village artists keeping in view of the tourists who visit regularly to nearby pilgrim sites.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">History</h2>
            <p className="text-muted-foreground leading-relaxed mb-6 font-body text-sm">
              The origin of this craft is the Art of Tholu Bommalata which is the traditional cultural art of the region. This folk Art was used by the people who migrated from the state of Maharashtra around 700 years back. This art was very interesting one which was displayed in the streets when there were no dramas or films for entertainment.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6 font-body text-sm">
              This play was demonstrated whole night with the theme of epics. This art was honored and encouraged by the Kings of that time. Due to some circumstances, our ancestors who were depending for livelihood on this Art migrated to Andhra Pradesh and some districts of Karnataka as Gypsies and were playing Tholu Bommalata in the villages.
            </p>
            <p className="text-muted-foreground leading-relaxed font-body text-sm">
              Our Grand Father about 90 years back came to this village Nimmalakunta and settled here demonstrating this Art. After decrease in honor due to the Film industry, our Father D. Chinna Narayana and some other Artists started this Craft with Tholubommalu method supported by DCH organization and designers. Gradually this Craft has become one of the famous crafts in India today.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutCraft;
