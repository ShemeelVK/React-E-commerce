import { replace, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import toast from "react-hot-toast";
import api from "../utils/api";
import { Eye, EyeOff, ArrowRight, X, ChevronLeft } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  // --- Forgot Password States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Pass
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);

  const handlelogin = async (e) => {
    e.preventDefault();

    const result = await loginUser({ email, password });

    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success("Login Successfull");
    }
  };

  const handleSendOtp = async () => {
    if (!resetEmail) return toast.error("Please enter your email");
    setLoading(true);
    try {
      await api.post("/Auth/Forgot-Password", { email: resetEmail });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      const errormsg = err.response?.data || "Something went wrong";
      toast.error(typeof errormsg === "string" ? errormsg : "User not found");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const otpString = otp.join("");
    if (otpString.length < 6) return toast.error("Enter full OTP");
    if (newPassword.length < 6) return toast.error("Password too short");

    setLoading(true);
    try {
      await api.post("/Auth/Reset-Password", {
        email: resetEmail,
        otp: otpString,
        newPassword: newPassword,
      });
      toast.success("Password Reset Successful!");
      setIsModalOpen(false);
      setStep(1);
      setOtp(new Array(6).fill(""));
    } catch (err) {
      toast.error(err.response?.data || "Invalid/Expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    // Focus next
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4 font-sans selection:bg-black selection:text-white">
      {/* --- CENTERED CARD CONTAINER --- */}
      <div className="bg-white w-full max-w-5xl h-[650px] md:h-[700px] rounded-[2.5rem] shadow-2xl overflow-hidden flex border border-white/50 relative">
        {/* Left Section - Immersive Visual */}
        <div className="hidden md:flex w-1/2 bg-black relative overflow-hidden items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1000&auto=format&fit=crop"
            alt="Luxury Editorial"
            className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen grayscale contrast-125 hover:scale-110 transition-transform duration-[3s] ease-in-out"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

          <div className="absolute bottom-12 left-10 z-10">
            <div className="w-12 h-1 bg-white mb-6" />
            <h1 className="text-6xl font-black italic tracking-tighter text-white mb-2">
              ELEVÉ.
            </h1>
            <p className="text-white/80 text-[10px] font-bold tracking-[0.3em] uppercase">
              Future • Fashion • Footwear
            </p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 relative bg-white">
          <div className="w-full max-w-sm space-y-10">
            {/* Header */}
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-black">
                WELCOME BACK
              </h2>
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                Login
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handlelogin} className="space-y-6">
              {/* Email Input */}
              <div className="group relative">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="peer w-full border-b border-neutral-200 bg-transparent py-3 text-sm font-medium text-black placeholder-transparent focus:border-black focus:outline-none transition-colors"
                  placeholder="Email"
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
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="peer w-full border-b border-neutral-200 bg-transparent py-3 text-sm font-medium text-black placeholder-transparent focus:border-black focus:outline-none transition-colors pr-10"
                    placeholder="Password"
                    id="password_input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-3 text-neutral-400 hover:text-black transition-colors"
                  >
                    {showPassword ? (
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

                <div className="flex justify-end mt-3">
                  <span
                    onClick={() => setIsModalOpen(true)}
                    className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 cursor-pointer hover:text-black transition-colors"
                  >
                    Forgot Password?
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="group relative w-full overflow-hidden bg-black py-4 text-white transition-all hover:bg-neutral-900 rounded-full mt-4"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em]">
                  Sign In{" "}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </button>
            </form>

            {/* Footer */}
            <div className="text-center pt-4">
              <p className="text-xs text-neutral-500 font-medium">
                Not a member?{" "}
                <span
                  onClick={() => navigate("/Register")}
                  className="font-bold text-black cursor-pointer uppercase tracking-wide border-b border-black ml-1 hover:text-neutral-700 hover:border-neutral-700 transition-colors"
                >
                  Register Now
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- FORGOT PASSWORD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-white/80 backdrop-blur-xl transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-white border border-neutral-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2rem] p-10 animate-in fade-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-10">
              <h3 className="text-xl font-black text-black uppercase tracking-tight mb-2">
                {step === 1 ? "Account Recovery" : "Security Check"}
              </h3>
              <div className="w-8 h-1 bg-black mx-auto rounded-full mb-4" />
              <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                {step === 1
                  ? "Authentication via Email"
                  : `Code sent to ${resetEmail}`}
              </p>
            </div>

            {step === 1 ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendOtp();
                }}
                className="space-y-8"
              >
                <div className="relative">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full border-b border-neutral-200 py-3 text-center text-lg font-medium outline-none focus:border-black placeholder:text-neutral-300 transition-colors"
                    placeholder="user@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-lg"
                >
                  {loading ? "Processing..." : "Send Code"}
                </button>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleResetPassword();
                }}
                className="space-y-8"
              >
                {/* RING FOCUSED OTP INPUTS */}
                <div className="flex justify-center gap-3">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="w-12 h-12 rounded-full border-2 border-neutral-200 text-center text-xl font-bold text-black outline-none transition-all focus:border-black focus:scale-110 shadow-sm"
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onFocus={(e) => e.target.select()}
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="block text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    New Credential
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="******"
                      className="w-full border-b border-neutral-200 py-3 text-center text-lg font-medium outline-none focus:border-black transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-0 top-3 text-neutral-400 hover:text-black transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-lg"
                >
                  {loading ? "Verifying..." : "Confirm Reset"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest hover:text-black flex items-center justify-center gap-1 mx-auto transition-colors"
                  >
                    <ChevronLeft size={12} /> Change Email
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
