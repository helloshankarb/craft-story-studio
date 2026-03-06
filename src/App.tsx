import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import AboutCraft from "./pages/AboutCraft";
import AboutArtist from "./pages/AboutArtist";
import Gallery from "./pages/Gallery";
import AdminGallery from "./pages/AdminGallery";
import PuppetShow from "./pages/PuppetShow";
import CraftItems from "./pages/CraftItems";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/about-craft" element={<AboutCraft />} />
          <Route path="/about-artist" element={<AboutArtist />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin" element={<AdminGallery />} />
          <Route path="/puppet-show" element={<PuppetShow />} />
          <Route path="/craft-items" element={<CraftItems />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
