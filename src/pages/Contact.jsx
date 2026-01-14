import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Globe,
  Clock,
  Sparkles,
} from "lucide-react";

function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for concierge inquiry submission
    console.log("Inquiry sent:", formState);
  };

  return (
    <div className="bg-[#fdfdfd] min-h-screen font-sans selection:bg-indigo-100 overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="relative pt-40 pb-20 md:pt-56 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full">
            <Sparkles className="text-indigo-600" size={14} />
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
              Studio Concierge
            </span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter leading-[0.85] italic uppercase">
            Reach <br />
            <span className="text-indigo-600 not-italic">Out.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 font-medium tracking-tight max-w-xl mx-auto leading-relaxed uppercase">
            Whether you are inquiring about a rare archive piece or a private
            viewing, our concierge team is at your service.
          </p>
        </div>
      </div>

      {/* --- MAIN CONTACT SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 pb-40 grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Contact Info (LHS) */}
        <div className="lg:col-span-4 space-y-16">
          <div className="space-y-10">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">
                Inquiries
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Email Us
                    </p>
                    <p className="text-lg font-black text-gray-900 italic tracking-tight">
                      concierge@eleve.studio
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Call Us
                    </p>
                    <p className="text-lg font-black text-gray-900 italic tracking-tight">
                      +1 (888) ELEVÉ-01
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">
                Global Studio
              </h3>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Location
                  </p>
                  <p className="text-sm font-bold text-gray-900 leading-relaxed uppercase">
                    5th Avenue Archive District <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">
                Availability
              </h3>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Studio Hours
                  </p>
                  <p className="text-sm font-bold text-gray-900 leading-relaxed uppercase">
                    Mon — Fri: 10AM - 8PM <br />
                    Sat — Sun: By Appointment Only
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (RHS) */}
        <div className="lg:col-span-8 bg-white rounded-[3rem] p-8 md:p-16 border border-neutral-100 shadow-2xl shadow-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Alexander McQueen"
                  className="w-full px-8 py-5 bg-gray-50 border-none rounded-full text-sm font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="alex@studio.com"
                  className="w-full px-8 py-5 bg-gray-50 border-none rounded-full text-sm font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                Inquiry Subject
              </label>
              <select
                className="w-full px-8 py-5 bg-gray-50 border-none rounded-full text-sm font-bold text-gray-900 focus:ring-2 focus:ring-indigo-100 transition-all outline-none appearance-none"
                onChange={(e) =>
                  setFormState({ ...formState, subject: e.target.value })
                }
              >
                <option>General Inquiry</option>
                <option>Private Viewing Request</option>
                <option>Archival Sourcing</option>
                <option>Partnership</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                Message
              </label>
              <textarea
                rows="5"
                placeholder="How can we elevate your journey?"
                className="w-full px-8 py-6 bg-gray-50 border-none rounded-[2rem] text-sm font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-100 transition-all outline-none resize-none"
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="group w-full md:w-auto flex items-center justify-center gap-3 bg-gray-900 text-white px-12 py-6 rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              Send Inquiry
              <Send
                size={16}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </button>
          </form>
        </div>
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="py-32 bg-gray-50/50 border-t border-neutral-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-50/50 blur-[100px] rounded-full" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
              Global{" "}
              <span className="text-indigo-600 not-italic">Connection.</span>
            </h2>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-widest max-w-md">
              Our support network spans across major hubs to ensure your pieces
              arrive with absolute precision.
            </p>
          </div>

          <div className="flex gap-12 text-center">
            {["Tokyo", "Paris", "London", "Milan"].map((city) => (
              <div key={city} className="space-y-1">
                <p className="text-lg font-black italic tracking-tight text-gray-900">
                  {city}
                </p>
                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                  Active Hub
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-neutral-100 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-2xl font-black italic tracking-tighter text-indigo-600 uppercase">
              Elevé
            </span>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              © 2025 ELEVÉ STUDIO. ENGINEERED FOR EXCELLENCE.
            </p>
          </div>

          <div className="flex gap-10">
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <span
                key={item}
                className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] cursor-pointer hover:text-indigo-600 transition-colors"
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

export default Contact;
