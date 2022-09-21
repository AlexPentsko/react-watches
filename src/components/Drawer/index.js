import { useState } from "react";
import Info from "../Info";
import axios from "axios";
import { useCart } from "../../hooks/useCart";
import styles from './Drawer.module.scss'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function Drawer({ onClose, onRemove, items = [], opened }) {

  const {cartItems, setCartItems, totalPrice} = useCart();
  const [orderId, setOrderId] = useState(null);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tax = (totalPrice / 100 * 5);

  const onClickOrder = async () =>{
    try {
      setIsLoading(true)
      const {data} = await axios.post('https://6323394a362b0d4e7ddf2cdf.mockapi.io/watches/v1/Orders', {
        items: cartItems
      });
      setOrderId(data.id);
      setIsOrderComplete(true);
      setCartItems([]);
      
      for(let i = 0; i< cartItems.length; i++){
        const item = cartItems[i];
        await axios.delete('https://6323394a362b0d4e7ddf2cdf.mockapi.io/watches/v1/cart/'+ item.id);
        await delay(1000);
      }
    } catch (error) {
      alert("Can't order :(")
    }
    setIsLoading(false)

  }

  return (
    <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ""}`}>
      <div className={styles.drawer}>
        <h2 className="d-flex justify-between mb-30">
          Cart <img onClick={onClose} className="cu-p" src="/img/remove-btn.svg" alt="Close" />
        </h2>

        {items.length > 0 ? (
          <div className="d-flex flex-column flex">
            <div className="items flex">
              {items.map((obj) => (
                <div key={obj.id} className="cartItem d-flex align-center mb-20">
                  <div
                    style={{ backgroundImage: `url(${obj.imageUrl})` }}
                    className="cartItemImg"></div>

                  <div className="mr-20 flex">
                    <p className="mb-5">{obj.title}</p>
                    <b>${obj.price}</b>
                  </div>
                  <img
                    onClick={() => onRemove(obj.id)}
                    className="removeBtn"
                    src="/img/remove-btn.svg"
                    alt="Remove"
                  />
                </div>
              ))}
            </div>
            <div className="cartTotalBlock">
              <ul>
                <li>
                  <span>Tax 5% (included):</span>
                  <div></div>
                  <span>${tax.toFixed(2)}</span>
                </li>
                <li>
                  <b className="total">Total:</b>
                  <div></div>
                  <b>${totalPrice.toFixed(2)}</b>
                </li>
              </ul>
              <button disabled={isLoading} onClick={onClickOrder} className="greenButton">
                Checked <img src="/img/arrow.svg" alt="Arrow" />
              </button>
            </div>
          </div>
        ) : (
          <Info 
            title = {isOrderComplete ? "Order completed!" : "Cart is empty!"} 
            description ={isOrderComplete ? `Your order number is №${orderId}. Our manager will contact you soon.` : "Add something to order."}
            image={isOrderComplete ? "/img/ordered.svg" : "/img/cartIsEmpty.svg"}
          />
        )}
      </div>
    </div>
  );
}

export default Drawer;
