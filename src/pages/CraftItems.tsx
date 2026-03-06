import Layout from "@/components/Layout";
import PageBanner from "@/components/PageBanner";

const craftCategories = [
  { name: "Lamp Shades", desc: "Traditional leather lamp shades with intricate carvings and vibrant natural dyes, creating a warm ambient glow." },
  { name: "Paintings", desc: "Leather paintings depicting scenes from Indian epics — Ramayana, Mahabharata, and Bhagavatha." },
  { name: "Wall Hangings", desc: "Decorative leather wall hangings with traditional and modern designs for interior decoration." },
  { name: "Door Hangings", desc: "Ornamental door hangings crafted from goat leather with colorful traditional motifs." },
  { name: "Partitions", desc: "Room partitions made with leather craft, featuring elaborate designs and natural colors." },
  { name: "Modern Puppets", desc: "Contemporary leather puppets designed for display and collection, inspired by traditional Tholu Bommalata." },
];

const CraftItems = () => {
  return (
    <Layout>
      <PageBanner title="Craft Items" />
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto text-center font-body text-sm">
            Nearly 150 types of items are made in Nimmalakunta village as household activity and marketed locally and outside markets. All items are made with goat leather using natural dyes and traditional techniques.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {craftCategories.map((cat) => (
              <div key={cat.name} className="bg-card border border-primary/10 rounded-lg p-8 hover:border-primary/30 transition-colors">
                <h3 className="font-display text-lg text-primary mb-3">{cat.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-body">{cat.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={`/images/portfolio-${i}.jpg`}
                  alt={`Craft item ${i}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CraftItems;
