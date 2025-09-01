import { createContext, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { currentUser, updateUserInAuthContext } = useAuth();
  const navigate = useNavigate();

  const addToCart = async (product) => {
    if (!currentUser) {
      alert("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    try {

      const currentCart = currentUser.cart || [];

      const itemExists = currentCart.find((item) => item.id === product.id);
      if (itemExists) {
        alert(`${product.name} is already in your cart.`);
        return;
      }

      const updatedCart = [...currentCart, { ...product, quantity: 1 }];

      await axios.patch(`http://localhost:3000/users/${currentUser.id}`, {
        cart: updatedCart,
      });

      const updatedUser = { ...currentUser, cart: updatedCart };
      updateUserInAuthContext(updatedUser);

      alert(`${product.name} has been added to your cart!`);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert("An error occurred while adding the item.");
    }
  };

  const value = {
    cartItems: currentUser?.cart || [],
    addToCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
