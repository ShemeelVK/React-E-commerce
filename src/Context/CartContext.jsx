import { createContext, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { currentUser, updateUserInAuthContext } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
   setCartItems(currentUser?.cart || []);
   }, [currentUser]);



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
      alert("An error occurred while updating the cart.");
    }
  };

  const addToCart = async (product) => {
    if (!currentUser) {
      alert("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    const currentCart = currentUser.cart;
    const itemExists = currentCart.find((item) => item.id === product.id);

    if (itemExists) {
      alert(`${product.name} is already in your cart.`);
      return;
    }

    const updatedCart = [...currentCart, { ...product, quantity: 1 }];
    await syncCartWithBackend(updatedCart);

    alert(`${product.name} has been added to your cart!`);
  };

  const increaseQuantity = async (productId) => {
    const updatedCart = currentUser.cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    await syncCartWithBackend(updatedCart);
  };

  const decreaseQuantity = async (productId) => {
    const updatedCart = currentUser.cart.map((item) =>
      item.id === productId
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    );
    await syncCartWithBackend(updatedCart);
  };

  const removeFromCart = async (productId) => {
    const updatedCart = currentUser.cart.filter(
      (item) => item.id !== productId
    );
    alert("Removed from Cart succesfully")
    await syncCartWithBackend(updatedCart);
  };

  const value = {
    cartItems: currentUser?.cart || [],
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  return context;
};
