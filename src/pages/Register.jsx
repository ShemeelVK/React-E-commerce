import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, XCircle, Eye, EyeOff, ArrowRight } from "lucide-react";

// ============================================================================
// ⚠️ IMPORTANT: UNCOMMENT YOUR REAL IMPORT IN YOUR PROJECT
// ============================================================================
import api from "../utils/api";

// --- TEMPORARY PLACEHOLDER (DELETE THIS IN YOUR REAL APP) ---
// const api = {
//   post: async (url, data) => {
//     await new Promise((r) => setTimeout(r, 1000));
//     return { status: 200 };
//   },
// };
// ============================================================================

const PasswordRequirement = ({ label, isMet }) => (
  <div
    className={`flex items-center text-[10px] uppercase tracking-wider font-medium transition-colors duration-300 ${
      isMet ? "text-emerald-600" : "text-neutral-400"
    }`}
  >
    {isMet ? (
      <CheckCircle2 size={12} className="mr-1.5" />
    ) : (
      <XCircle size={12} className="mr-1.5" />
    )}
    <span>{label}</span>
  </div>
);

function Register() {
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordValidity, setPasswordValidity] = useState({
    length: false,
    number: false,
    specialChar: false,
    capitalChar: false,
  });

  //checks password for each time
  useEffect(() => {
    setPasswordValidity({
      length: password.length >= 8,
      number: /\d/.test(password), // Checks for at least one number
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password), // Checks for special characters
      capitalChar: /[A-Z]/.test(password), // Checks for at least one capital letter
    });
  }, [password]);

  const handleregister = async (e) => {
    e.preventDefault();
    const trimmedname = name.trim();

    if (!trimmedname) {
      toast("Enter name fully", {
        icon: "⚠️",
        style: { background: "#fcbe03", color: "white" },
      });
      return;
    }

    if (
      !passwordValidity.length ||
      !passwordValidity.number ||
      !passwordValidity.specialChar ||
      !passwordValidity.capitalChar
    ) {
      toast.error("Please ensure your password meets all requirements.");
      return;
    }

    try {
      // Ensure you use your real ENV variable in production
      const baseUrl = import.meta.env?.VITE_API_URL || "";
      const res = await api.post(`${baseUrl}/Auth/register`, {
        username: name,
        email: email,
        password: password,
      });

      if (res.status === 200) {
        toast.success("Registration successfull, Please Login");
        navigate("/Login");
      }
    } catch (err) {
      console.log("Error", err);

      if (err.response) {
        if (err.response.data.errors) {
          toast.error("Please fix valdiation errors");
        } else if (err.response.data.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error("Registration failed. Try Again");
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4 font-sans selection:bg-black selection:text-white">
      {/* --- CENTERED CARD CONTAINER --- */}
      <div className="bg-white w-full max-w-5xl h-[700px] md:h-[750px] rounded-[2.5rem] shadow-2xl overflow-hidden flex border border-white/50 relative">
        {/* Left Section - Immersive Visual */}
        <div className="hidden md:flex w-1/2 bg-black relative overflow-hidden items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
            alt="Luxury Sneaker"
            className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen grayscale-[20%] contrast-125 hover:scale-110 transition-transform duration-[3s] ease-in-out"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

          <div className="absolute bottom-12 left-10 z-10">
            <div className="w-12 h-1 bg-white mb-6" />
            <h1 className="text-6xl font-black italic tracking-tighter text-white mb-2">
              ELEVÉ.
            </h1>
            <p className="text-white/80 text-[10px] font-bold tracking-[0.3em] uppercase">
              Join the Exclusive Club
            </p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 relative bg-white">
          <div className="w-full max-w-sm space-y-8">
            {/* Header */}
            <div className="text-center md:text-left space-y-2">
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                New Member
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-black">
                CREATE ACCOUNT
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleregister} className="space-y-6">
              {/* Name Input */}
              <div className="group relative">
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  autoComplete="username"
                  required
                  className="peer w-full border-b border-neutral-200 bg-transparent py-3 text-sm font-medium text-black placeholder-transparent focus:border-black focus:outline-none transition-colors"
                  placeholder="Full Name"
                  id="name_input"
                />
                <label
                  htmlFor="name_input"
                  className="absolute left-0 -top-3.5 text-[10px] font-bold text-neutral-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-neutral-400 peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-black uppercase tracking-widest"
                >
                  Full Name
                </label>
              </div>

              {/* Email Input */}
              <div className="group relative">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                  className="peer w-full border-b border-neutral-200 bg-transparent py-3 text-sm font-medium text-black placeholder-transparent focus:border-black focus:outline-none transition-colors"
                  placeholder="Email Address"
                  id="email_input"
                />
                <label
                  htmlFor="email_input"
                  className="absolute left-0 -top-3.5 text-[10px] font-bold text-neutral-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-neutral-400 peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-black uppercase tracking-widest"
                >
                  Email Address
                </label>
              </div>

              {/* Password Input */}
              <div className="group relative">
                <div className="relative">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    className="peer w-full border-b border-neutral-200 bg-transparent py-3 text-sm font-medium text-black placeholder-transparent focus:border-black focus:outline-none transition-colors pr-10"
                    placeholder="Password"
                    id="password_input"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-0 top-3 text-neutral-400 hover:text-black transition-colors"
                  >
                    {isPasswordVisible ? (
                      <EyeOff size={18} strokeWidth={1.5} />
                    ) : (
                      <Eye size={18} strokeWidth={1.5} />
                    )}
                  </button>
                  <label
                    htmlFor="password_input"
                    className="absolute left-0 -top-3.5 text-[10px] font-bold text-neutral-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-neutral-400 peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-black uppercase tracking-widest"
                  >
                    Password
                  </label>
                </div>

                {/* Password Requirements - Minimalist Design */}
                {password.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 gap-2 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <PasswordRequirement
                      label="8+ Characters"
                      isMet={passwordValidity.length}
                    />
                    <PasswordRequirement
                      label="At least one number"
                      isMet={passwordValidity.number}
                    />
                    <PasswordRequirement
                      label="Special character"
                      isMet={passwordValidity.specialChar}
                    />
                    <PasswordRequirement
                      label="At least one capital letter"
                      isMet={passwordValidity.capitalChar}
                    />
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="group relative w-full overflow-hidden bg-black py-4 text-white transition-all hover:bg-neutral-900 rounded-full mt-2"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em]">
                  Join Elevé{" "}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </button>
            </form>

            {/* Footer */}
            <div className="text-center pt-2">
              <p className="text-xs text-neutral-500 font-medium">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/Login")}
                  className="font-bold text-black cursor-pointer uppercase tracking-wide border-b border-black ml-1 hover:text-neutral-700 hover:border-neutral-700 transition-colors"
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
