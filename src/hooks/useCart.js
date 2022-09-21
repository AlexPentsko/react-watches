import AppContext from "../context";
import { useContext } from "react";

export const useCart = () =>{
    const {cartItems, setCartItems} = useContext(AppContext);
    const totalPrice = (cartItems.reduce((sum, obj) => Number(obj.price) + Number(sum), 0));


    return{ cartItems, setCartItems, totalPrice }
}
