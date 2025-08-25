import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import ProductCard from "../Components/ProductCard";
function Home(){
    const navigate=useNavigate();
    const [products,setProducts]=useState([]);

    useEffect(()=>{
      const fetchproducts=async ()=>{
        try{
        const res = await axios.get("http://localhost:3000/products");
        setProducts(res.data.slice(0,10));
        console.log("Fetched data:", response.data);
        }
        catch(err){
          console.log('Failed to fetch Products: ',err);
        }

      }
      fetchproducts();
    },[])

    function handleLogout(){
        localStorage.removeItem("user")
        navigate("./Login")
    }

    return (
      <>
        <div
          className="min-h-screen bg-cover  bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1330&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          <Navbar />

          {/* Hero Section */}
          <div className="pt-60 text-center text-white drop-shadow-lg px-6">
            <h1 className="text-[4rem] md:text-6xl font-extrabold mb-6">
              Elevé: Luxe in Every Step
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Discover limited-edition sneakers crafted for the elite.
            </p>
            <button
              onClick={() => navigate("/Shop")}
              className="mt-10 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white font-semibold shadow-lg transition duration-300"
            >
              Shop Now
            </button>
          </div>
        </div>

        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
              Featured Collection
            </h2>
            {/* --- The Product Grid --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </>
    );
}
export default Home