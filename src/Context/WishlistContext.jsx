import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api.js";
import Wishlist from "../pages/Wishlist.jsx";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [wishlistItems,setWishlistItems]=useState([]);

      useEffect(()=>{
        const fetchWishlist=async () =>{
          if(currentUser){
            try{
              const res=await api.get(`${import.meta.env.VITE_API_URL}/Wishlist/All-Products`);
              const realData=res.data.map(item=>({
                ...item,
                id:item.productId,
                WishlistId:item.id,
                name:item.productName || item.name,
                imageUrl:item.imageUrl,
                price:item.price,
                category:item.category || "Sneakers",
                description:item.description
              }))
              console.log("context fetched wishlist: ",res.data)
              setWishlistItems(realData);
            }
            catch(error){
              console.log("Failed to fetch Wishlist",error);
            }
          }
          else{
            setWishlistItems([]);
          }
        };
        fetchWishlist();
      },[currentUser]);

  const isProductInWishlist=(productId)=>{
    return wishlistItems.find((item)=>(item.id===productId) || (item.productId===productId));
  };

  const toggleApi=async(productId)=>{
    try{
       await api.post(`${import.meta.env.VITE_API_URL}/Wishlist/Toggle-Wishlist?productId=${productId}`)
     }
     catch(error){
        console.log("Something went wrong",error)

        toast.error("Connection failed: Could not sync wishlist");
      }
  };


// Add function
  const addToWishlist = async (product) => {
    if (!currentUser) {
      toast.error("Please log in to add items to your wishlist.");
      navigate("/login");
      return;
    }

    const exists=wishlistItems.find((item)=>item.id===product.id || item.productId===product.id);

    if(exists){
      removeFromWishlist(product.id);
      return;
    }

    const newItem={...product,productId:product.id};
    setWishlistItems([...wishlistItems,newItem]);
    toast.success(`${product.name} added to wishlist!`);

    await toggleApi(product.id);

  };

  // Remove function
   const removeFromWishlist = async (productId) => {
     if (!currentUser) return;

     const updatedList=wishlistItems.filter((item)=>item.id!==productId && item.productId!==productId);
     setWishlistItems(updatedList);

     toast.success("Product removed from Wishlist")

     await toggleApi(productId);
   };

   const clearWishlist=async () =>{
    if(!currentUser){
      return;
    }
    setWishlistItems([])

    try{
      await api.delete(`${import.meta.env.VITE_API_URL}/Wishlist/Clear-Wishlist`);
      toast.success("Wishlist Cleared");
    }
    catch(error){
      console.log("Error occured while clearing wishlist: ",error)
    }
   }

   const isInWishlist=(productId)=>{
    return wishlistItems.find(item=> item.id===productId || item.productId===productId);
   }



  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  return context;
};
