import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { Sparkles, ShieldCheck, Globe, MoveRight } from "lucide-react";

function About() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fdfdfd] min-h-screen font-sans selection:bg-indigo-100 overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="relative pt-40 pb-24 md:pt-56 md:pb-40 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full animate-fade-in">
            <Sparkles className="text-indigo-600" size={14} />
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
              The Elevation of Motion
            </span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter leading-[0.85] italic uppercase">
            Beyond <br />
            <span className="text-indigo-600 not-italic">Footwear.</span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-500 font-medium tracking-tight max-w-2xl mx-auto leading-relaxed">
            Elevé Studio is a sanctuary for the discerning. We bridge the gap
            between heritage archival silhouettes and the bold precision of
            futuristic engineering.
          </p>
        </div>
      </div>

      {/* --- PHILOSOPHY SECTION --- */}
      <div className="py-32 bg-white border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-indigo-50 rounded-[3rem] -z-10 group-hover:bg-indigo-100/50 transition-colors duration-500" />
            <img
              src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000"
              alt="Artisanal Process"
              className="rounded-[2.5rem] w-full h-[600px] object-cover shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <div className="h-1 w-16 bg-indigo-600 rounded-full" />
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter italic uppercase">
                Artisan <br />
                <span className="text-indigo-600 not-italic">Soul.</span>
              </h2>
            </div>

            <p className="text-gray-500 text-lg leading-relaxed font-medium">
              Founded in 2023, Elevé began as a private archive of rare
              silhouettes. Today, it is a global destination for those who view
              footwear as a vessel for identity. Every item in our studio is
              hand-selected based on three rigid criteria: technical innovation,
              archival relevance, and sculptural beauty.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
              <div className="space-y-3">
                <ShieldCheck className="text-indigo-600" size={24} />
                <h4 className="font-black text-xs uppercase tracking-widest">
                  Authenticated
                </h4>
                <p className="text-gray-400 text-sm">
                  Every silhouette undergoes a 12-point artisan verification
                  process.
                </p>
              </div>
              <div className="space-y-3">
                <Globe className="text-indigo-600" size={24} />
                <h4 className="font-black text-xs uppercase tracking-widest">
                  Global Reach
                </h4>
                <p className="text-gray-400 text-sm">
                  Sourcing the rarest drops from Tokyo, Milan, and Paris.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- THE STORE EXPERIENCE --- */}
      <div className="py-40 max-w-7xl mx-auto px-6 text-center">
        <div className="space-y-16">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.5em]">
              The Environment
            </p>
            <h2 className="text-5xl md:text-8xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
              A Luxe{" "}
              <span className="text-indigo-600 not-italic">Archive.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
            <div className="md:col-span-2 rounded-[3rem] overflow-hidden group relative">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                alt="Store Interior"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            </div>
            <div className="rounded-[3rem] overflow-hidden group relative">
              <img
                src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1000"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                alt="Product Detail"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER CTA --- */}
      <div className="py-40 bg-indigo-600 relative overflow-hidden">
        <div className="absolute top-[-50%] left-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px]" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-12">
          <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
            Ready to <br /> Elevate your{" "}
            <span className="not-italic">Rotation?</span>
          </h2>
          <button
            onClick={() => navigate("/shop")}
            className="group inline-flex items-center gap-4 bg-white text-indigo-600 px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-2xl"
          >
            Enter the Shop
            <MoveRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      {/* --- MINIMAL FOOTER --- */}
      <footer className="bg-white py-16 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-2xl font-black italic tracking-tighter text-indigo-600 uppercase">
              Elevé
            </span>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              © 2025 ELEVÉ STUDIO. ALL RIGHTS RESERVED.
            </p>
          </div>

          <div className="flex gap-8">
            {["Instagram", "Twitter", "Archive"].map((item) => (
              <span
                key={item}
                className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-600 transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;
