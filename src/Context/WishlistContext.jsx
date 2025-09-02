import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { currentUser, updateUserInAuthContext } = useAuth();
  const navigate = useNavigate();

 //syncing backend
  const syncWithBackend= async(updatedWishlist)=>{
    try{
        await axios.patch(`http://localhost:3000/users/${currentUser.id}`,{
            wishlist:updatedWishlist
        });

        const updatedUser={...currentUser, wishlist : updatedWishlist}
        updateUserInAuthContext(updatedUser)
    }
    catch(error){
        console.log("An error occured while syncing",error)
        alert("Error while syncing")
    }
  };

// Add function
  const addToWishlist = async (product) => {
    if (!currentUser) {
      alert("Please log in to add items to your wishlist.");
      navigate("/login");
      return;
    }

  try {
    const currentWishlist = currentUser.wishlist || []; 
    const itemExists = currentWishlist.find((item) => item.id === product.id);

    if (itemExists) {
      alert(`${product.name} is already in your wishlist.`);
      return;
    }
      const updatedWishlist = [...currentWishlist, product];
      syncWithBackend(updatedWishlist)
      alert(`${product.name} has been added to your wishlist!`);
     
}
    catch (err) {
      console.error("Failed to add item to wishlist", err);
      alert("An error occurred while adding the item.");
    }
  };

  // Remove function
   const removeFromWishlist = async (productId) => {
     if (!currentUser) return;

     try {
       const updatedWishlist = currentUser.wishlist.filter(
         (item) => item.id !== productId
       );

       syncWithBackend(updatedWishlist)
       alert(`This product is removed`)
     } catch (err) {
       console.error("Failed to remove item from wishlist", err);
       alert("An error occurred while removing the item.");
     }
   };


  const value = {
    wishlistItems: currentUser?.wishlist || [],
    addToWishlist,
    removeFromWishlist
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  return context;
};
