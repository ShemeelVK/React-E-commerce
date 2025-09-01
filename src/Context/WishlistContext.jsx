import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { currentUser, updateUserInAuthContext } = useAuth();
  const navigate = useNavigate();


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
        await axios.patch(`http://localhost:3000/users/${currentUser.id}`, {
        wishlist: updatedWishlist,
      });

      const updatedUser = { ...currentUser, wishlist: updatedWishlist };
      updateUserInAuthContext(updatedUser);
      
      alert(`${product.name} has been added to your wishlist!`);
     
}
    catch (err) {
      console.error("Failed to add item to wishlist", err);
      alert("An error occurred while adding the item.");
    }
  };

  const value = {
    wishlistItems: currentUser?.wishlist || [],
    addToWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  return context;
};
