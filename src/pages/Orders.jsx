import { useEffect, useState } from 'react';
import Card from '../components/Card';
import axios from 'axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() =>{
    (async () => {
      try {
        const {data} = await axios.get('https://6323394a362b0d4e7ddf2cdf.mockapi.io/watches/v1/Orders')
        setOrders(data.map((obj) => obj.items).flat());
        setIsLoading(false)
      } catch (error) {
        alert(`Error: Can't load orders`)
      }
    })();
  
  }, [])

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>My orders</h1>
      </div>

      <div className="d-flex flex-wrap">

        {(isLoading ? [...Array(8)] : orders).map((item, index) => (
          <Card 
            key={index}
            loading = {isLoading}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}

export default Orders;
