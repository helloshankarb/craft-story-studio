const PageBanner = ({ title }: { title: string }) => {
  return (
    <div
      className="relative h-64 md:h-80 flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/welcome-1.jpg')" }}
    >
      <div className="absolute inset-0 gradient-dark-overlay" />
      <h1 className="relative z-10 font-display text-4xl md:text-5xl tracking-wider text-foreground text-glow">
        {title}
      </h1>
    </div>
  );
};

export default PageBanner;
