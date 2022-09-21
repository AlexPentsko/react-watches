import React, {useState, useContext} from 'react';
import styles from './Card.module.scss';
import ContentLoader from "react-content-loader"
import AppContext from '../../context';

function Card({ id, title, imageUrl, price, onFavorite, onPlus, favorited = false, loading = false}) {

  const {isItemAdded} = useContext(AppContext);
  const [isFavorite, setIsFavorite] = useState(favorited);
  const itemObj = {id, parentId: id, title, imageUrl, price}



  const onClickPlus = () => {
    onPlus(itemObj);
  };

  const onClickFavorite = () => {
    onFavorite(itemObj);
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={styles.card}>
      {
        loading ?  <ContentLoader 
        speed={2}
        width={160}
        height={297}
        viewBox="0 0 155 305"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="0" rx="10" ry="10" width="150" height="195" /> 
        <rect x="0" y="220" rx="5" ry="5" width="150" height="15" /> 
        <rect x="0" y="240" rx="5" ry="5" width="100" height="15" /> 
        <rect x="0" y="280" rx="5" ry="5" width="90" height="25" /> 
        <rect x="120" y="273" rx="10" ry="10" width="35" height="35" />
      </ContentLoader> : 
            <React.Fragment>
              {onFavorite && 
              (<div className={styles.favorite} onClick={onClickFavorite}>
                <img src={isFavorite ? '/img/fav-on.svg' : '/img/fav-off.svg'} alt="Unliked" />
              </div>)}
              <img width={150} height={200} src={imageUrl} alt="Watches" />
              <h5>{title}</h5>
              <div className="d-flex justify-between align-center">
                <div className="d-flex flex-column">
                  <span>Price:</span>
                  <b>${price}</b>
                </div>
                {onPlus && 
                (<img
                  className={styles.plus}
                  onClick={onClickPlus}
                  src={isItemAdded(id) ? '/img/add-checked.svg' : '/img/add.svg'}
                  alt="Add button"
                />)}
              </div>
            </React.Fragment>
            }
    </div>
  );
}

export default Card;
