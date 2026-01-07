import { createContext, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import toast from "react-hot-toast";
import api from "../utils/api.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { currentUser} = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isProcessingCheckout,setIsProcessingCheckout]=useState(false);
  


  useEffect(() => {
   const fetchCart=async ()=>{
    if(currentUser){
      try{
        const res=await api.get(`${import.meta.env.VITE_API_URL}/Cart/Cart-Products`);

        const normalizedCart=res.data.map(item=>({
          ...item,
          name:item.productName || item.name,
          id:item.productId || item.id,
          imageUrl: item.imageUrl || item.image,
          category:item.category || "Sneakers"
        }));


        setCartItems(normalizedCart);
      }
      catch (error){
        console.log("Failed to fetch Cart: ",error);
      }
    }
    else{
      setCartItems([]);
    }
   };
   fetchCart();
   }, [currentUser]);


// Add to cart
  const addToCart = async (product) => {
    if (!currentUser) {
      toast.error("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    // const currentCart = currentUser.cart;
    const itemExists = cartItems.find((item) => item.id === product.id || item.productId===product.id);

    if (itemExists) {
      await removeFromCart(product.id)
      // toast.error(`${product.name} is already in your cart.`);
      return;
    }

    try{
      const newItem={...product,productId:product.id,quantity:1}
      setCartItems([...cartItems,newItem]);

      await api.post(`${import.meta.env.VITE_API_URL}/Cart/Add-To-Cart`,{
        productId:product.id,
        quantity:1
      });

      toast.success(`${product.name} has been added to your cart!`);
    }
    catch (error){
      setCartItems(cartItems);
      console.log("Failed to add to cart",error)
      toast.error("Failed to add item")
    }
    // const updatedCart = [...currentCart, { ...product, quantity: 1 }];
    // await syncCartWithBackend(updatedCart);

  };
  
// increase quantity
  const increaseQuantity = async (productId) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCartItems(updatedCart)
  };

  // decrease quantity
  const decreaseQuantity = async (productId) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    );
    setCartItems(updatedCart);

  };
// remove product
  const removeFromCart = async (productId) => {
    const previosCart=[...cartItems];
    const updatedCart=cartItems.filter((item)=> item.productId!==productId && item.productId!==productId);

    setCartItems(updatedCart);


    try {
      await api.delete(`${import.meta.env.VITE_API_URL}/Cart/Remove-from-Cart?itemId=${productId}`);
      toast.success("Removed from Cart successfully");
    } catch (error) {
      setCartItems(previosCart);
      toast.error("Failed to remove item");
    }
  };

// Clear cart
  const clearCart = async () => {

    if (!currentUser) return;
    setCartItems([]);

    try {
      await api.delete(
        `${import.meta.env.VITE_API_URL}/Cart/Clear-Cart`
      );

      toast.success("Cart Cleared Succesfully")

    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast.error("There was an error clearing the cart.");
    }
  };

  const processCheckout=async () =>{
    if(cartItems.length===0){
      toast.error("Cart is empty");
      return;
    }

    setIsProcessingCheckout(true)
    let hasError=false;

    for(const item of cartItems){
      try {
        await api.put(`${import.meta.env.VITE_API_URL}/Cart/Product-Quantity?itemId=${item.productId}`,
          {newQuantity:item.quantity}
        );
      } catch (error) {
        hasError=true;
        console.log("Error occured: ",error);

        //backend sends "stock is not available" if the quantity exceed the limit
        if(error.response && error.response.data.error){
          toast.error(`${item.productName || "Item"}: Stock is insufficient`)
        }
        else{
          toast.error(
            `Could not update quantity for ${item.productName || "an item"}`
          );
        }
        break;
      }
    }

    setIsProcessingCheckout(false);

    if(!hasError){
      navigate("/payment");
    }

    
  }

  const value = {
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    processCheckout,
    isProcessingCheckout
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  return context;
};
