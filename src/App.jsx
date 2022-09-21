import {useState, useEffect} from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import React from 'react';
import AppContext from './context';
import Orders from './pages/Orders';



function App() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [cartOpened, setCartOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData(){
      try {
        const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
          axios.get('https://6323394a362b0d4e7ddf2cdf.mockapi.io/watches/v1/cart'), 
          axios.get('https://6323394a362b0d4e7ddf2cdf.mockapi.io/watches/v1/favorites'),
          axios.get('https://6323394a362b0d4e7ddf2cdf.mockapi.io/watches/v1/watches')
        ])

        setIsLoading(false);
        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert('Error: Can`t load data.')
      }
    }

    fetchData();
  }, []);

  const onAddToCart = async(obj) => {
    try {
      const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id))
      if (findItem) {
        setCartItems((prev) => prev.filter(item => Number(item.parentId) !== Number(obj.id)))
        await axios.delete(`https://6323394a362b0d4e7ddf2cdf.mockapi.io/watches/v1/cart/${findItem.id}`);
      }else{
        setCartItems((prev) => [...prev, obj]);
        const {data} = await axios.post('https://6323394a362b0d4e7ddf2cdf.mockapi.io/watches/v1/cart', obj)
        setCartItems((prev) => prev.map(item => {
          if(item.parentId === data.parentId){
            return {
              ...item,
              id: data.id
            }
          }
          return item;
        }));
        
      }
    } catch (error) {
      alert(`Error: Add to cart is failed`);
    }
    
  };

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://6323394a362b0d4e7ddf2cdf.mockapi.io/watches/v1/cart/${id}`);
    setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
    } catch (error) {
      alert("Error: Delete is failed")
    }
    
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        axios.delete(`https://6323394a362b0d4e7ddf2cdf.mockapi.io/watches/v1/favorites/${obj.id}`);
        setFavorites(prev => prev.filter(item => Number(item.id) !== Number(obj.id)))
      } else {
        const { data } = await axios.post('https://6323394a362b0d4e7ddf2cdf.mockapi.io/watches/v1/favorites', obj);
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert(`Error: Can't add to favorites`);
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) =>{
    return cartItems.some((obj) => Number(obj.parentId) === Number(id))
  }

  return (
    <AppContext.Provider value={{items, cartItems, favorites, isItemAdded, onAddToFavorite, onAddToCart, setCartOpened, setCartItems}}>
      <div className="wrapper clear">
        <div>
          <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem} opened={cartOpened} />
        </div>
        

        <Header onClickCart={() => setCartOpened(true)} />
        <Routes>
          <Route path="/" element={
            <Home
              items={items}
              cartItems = {cartItems}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onChangeSearchInput={onChangeSearchInput}
              onAddToFavorite={onAddToFavorite}
              onAddToCart={onAddToCart}
              isLoading = {isLoading}
            />}>
          </Route>
          <Route path="/favorites" element={<Favorites/>}></Route>
          <Route path="/orders" element={<Orders/>}></Route>
        </Routes>

      </div>
    </AppContext.Provider>
  );
}

export default App;
