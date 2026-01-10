import { replace, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState,useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import toast from "react-hot-toast";
import api from "../utils/api";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const[showPassword,setShowPassword]=useState(false);
  const[showNewPassword,setShowNewPassword]=useState(false);
  
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
      const errormsg=err.response?.data || "Something went wrong";
      toast.error(typeof errormsg==='string' ? errormsg : "USer not found");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 p-4">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden flex max-w-4xl w-full">
        {/* Left Image Section */}
        <div className="hidden md:block w-1/2">
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            alt="Sneaker luxury"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Login Section */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
              Elevé
            </h1>
            <p className="text-gray-500 mt-2">Luxury Sneaker Store</p>
          </div>

          <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handlelogin} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter your Email"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none pr-12"
                  placeholder="Enter your Password"
                />
                {/* ICON BUTTON */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="text-right mt-2">
                <span
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm text-indigo-600 cursor-pointer hover:underline"
                >
                  Forgot Password?
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/Register")}
              className="text-indigo-600 font-medium cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </div>
      </div>

      {/* --- FORGOT PASSWORD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {step === 1 ? "Forgot Password" : "Verify OTP"}
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              {step === 1
                ? "Enter your registered email..."
                : `Enter the code sent to ${resetEmail}`}
            </p>

            {step === 1 ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendOtp();
                }}
                className="space-y-4"
              >
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Email Address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
                >
                  {loading ? "Sending..." : "Send Reset Code"}
                </button>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleResetPassword();
                }}
                className="space-y-6"
              >
                <input
                  type="hidden"
                  name="username"
                  value={resetEmail}
                  autoComplete="username"
                />
                <div className="flex justify-between gap-2">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="w-12 h-12 border-2 rounded-lg text-center text-xl font-bold border-gray-300 focus:border-indigo-500 outline-none"
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onFocus={(e) => e.target.select()}
                    />
                  ))}
                </div>
                {/* NEW PASSWORD WITH ICON */}
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="new-password"
                    autoComplete="new-password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
                >
                  {loading ? "Resetting..." : "Verify & Reset"}
                </button>
                <p
                  onClick={() => setStep(1)}
                  className="text-center text-indigo-600 text-sm cursor-pointer hover:underline"
                >
                  Back to email
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default Login;
