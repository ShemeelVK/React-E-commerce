import { createContext, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { currentUser, updateUserInAuthContext } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
   setCartItems(currentUser?.cart || []);
   }, [currentUser]);


//updating databse
  const syncCartWithBackend = async (updatedCart) => {
    try {
      await axios.patch(`http://localhost:3000/users/${currentUser.id}`, {
        cart: updatedCart,
      });
      const updatedUser = { ...currentUser, cart: updatedCart };
      updateUserInAuthContext(updatedUser);
      setCartItems(updatedCart)
    } catch (error) {
      console.error("Failed to sync cart:", error);
      toast.error("An error occurred while updating the cart.");
    }
  };
// Add to cart
  const addToCart = async (product) => {
    if (!currentUser) {
      toast.error("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    const currentCart = currentUser.cart;
    const itemExists = currentCart.find((item) => item.id === product.id);

    if (itemExists) {
      toast.error(`${product.name} is already in your cart.`);
      return;
    }

    const updatedCart = [...currentCart, { ...product, quantity: 1 }];
    await syncCartWithBackend(updatedCart);

    toast.success(`${product.name} has been added to your cart!`);
  };
  
// increase quantity
  const increaseQuantity = async (productId) => {
    const updatedCart = currentUser.cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    await syncCartWithBackend(updatedCart);
  };

  // decrease quantity
  const decreaseQuantity = async (productId) => {
    const updatedCart = currentUser.cart.map((item) =>
      item.id === productId
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    );
    await syncCartWithBackend(updatedCart);
  };
// remove product
  const removeFromCart = async (productId) => {
    const updatedCart = currentUser.cart.filter(
      (item) => item.id !== productId
    );
    toast.success("Removed from Cart succesfully")
    await syncCartWithBackend(updatedCart);
  };

// Clear cart
  const clearCart = async () => {

    if (!currentUser) return;

    try {
      await axios.patch(`http://localhost:3000/users/${currentUser.id}`, {
        cart: [],
      });

      const updatedUser = { ...currentUser, cart: [] };

      updateUserInAuthContext(updatedUser);
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast.error("There was an error clearing the cart.");
    }
  };

  const value = {
    cartItems: currentUser?.cart || [],
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  return context;
};
