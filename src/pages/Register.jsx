import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState,useEffect } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, XCircle ,Eye,EyeOff} from "lucide-react";

const PasswordRequirement = ({ label, isMet }) => (
  <div className={`flex items-center text-sm transition-colors ${
      isMet ? "text-green-600" : "text-red-500"
    }`}
  >
    {isMet ? (
      <CheckCircle2 size={16} className="mr-2" />
    ) : (
      <XCircle size={16} className="mr-2" />
    )}
    <span>{label}</span>
  </div>
);

function Register(){
    const [name,setname]=useState("")
    const [email,setEmail]=useState("")
    const [password,setpassword]=useState("")
    const navigate=useNavigate();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [passwordValidity, setPasswordValidity] = useState({
       length: false,
       number: false,
       specialChar: false,
      });

      //checks password for each time
        useEffect(() => {
          setPasswordValidity({
            length: password.length >= 8,
            number: /\d/.test(password), // Checks for at least one number
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password), // Checks for special characters
          });
        }, [password]);

    const handleregister=async (e)=>{
        e.preventDefault();
        const trimmedname=name.trim();

        if(!trimmedname){
          toast("Enter name fully", {
            icon: "⚠️",
            style: { background: "#fcbe03", color: "white" },
          });
          return;
        }

        if (
          !passwordValidity.length ||
          !passwordValidity.number ||
          !passwordValidity.specialChar
        ) {
          toast.error("Please ensure your password meets all requirements.");
          return;
        }


        try{
           const res = await axios.get(`http://localhost:3000/users?email=${email}`);
           if (res.data.length>0){
             toast.error("User already exists")
             navigate("/Login")
             return;
           }

           else {
            await axios.post("http://localhost:3000/users",{
                name,
                email,
                password,
                role:"user",
                status:"active",
                cart:[],
                wishlist:[],
                orders:[]
            });

            }

            toast.success("Registration Successfull !!")
            navigate("/Login")
            }

       catch(err){
        console.log("Error",err);
       }
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100">
        <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full">
          {/* Brand Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
              Elevé
            </h1>
            <p className="text-gray-500 mt-2">Luxury Sneaker Store</p>
          </div>

          {/* Page Heading */}
          <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
            Create your account
          </h2>

          {/* Form */}
          <form onSubmit={handleregister} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setname(e.target.value)}
                autoComplete="username"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {password.length > 0 && (
                <div className="mt-3 space-y-1">
                  <PasswordRequirement
                    label="At least 8 characters long"
                    isMet={passwordValidity.length}
                  />
                  <PasswordRequirement
                    label="Contains at least one number"
                    isMet={passwordValidity.number}
                  />
                  <PasswordRequirement
                    label="Contains a special character"
                    isMet={passwordValidity.specialChar}
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Register
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/Login")}
              className="text-indigo-600 font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    );
}
export default Register