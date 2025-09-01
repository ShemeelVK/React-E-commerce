import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";

function Login() {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const navigate=useNavigate();
    const {loginUser}=useAuth();
    
    const handlelogin=async (e)=>{
        e.preventDefault();

        try{
            const res= await axios.get(`http://localhost:3000/users?email=${email}`);
            
            if(res.data.length>0){
                const user=res.data[0];
            
              if(user.email===email && user.password===password){
                alert("Login Successfull")
                loginUser(user)
              }
              else{
                alert("Invalid Credentials")
              }
        }
        }
        catch(err){
            console.log("Error",err);
            alert("An error occured during Login")
        }
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100">
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

          {/* Page Heading */}
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
              <input
                type="password"
                name="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
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
    </div>
  ); 
}
export default Login;
