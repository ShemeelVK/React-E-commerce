import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Login from "./Login";

function Register(){
    const [name,setname]=useState("")
    const [email,setEmail]=useState("")
    const [password,setpassword]=useState("")
    const navigate=useNavigate();

    const handleregister=async (e)=>{
        e.preventDefault();
        const trimmedname=name.trim();

        if(!trimmedname){
          alert("Enter name fully")
          return;
        }

        try{
           const res = await axios.get(`http://localhost:3000/users?email=${email}`);
           if (res.data.length>0){
             alert("User already exists")
             navigate("/Login")
             return;
           }

           else {
            await axios.post("http://localhost:3000/users",{
                name,
                email,
                password,
                cart:[],
                wishlist:[],
                orders:[]
            });

            }

            alert("Registration Successfull !!")
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
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
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