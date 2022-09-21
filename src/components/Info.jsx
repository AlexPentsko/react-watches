import React from 'react'
import { useContext } from 'react';
import AppContext from '../context';

const Info = ({image, title, description}) => {

    const {setCartOpened} = useContext(AppContext)

    return (
        <div class="cartEmpty d-flex align-center justify-center flex-column flex">
            <img class="mb-20" width="120px" height="120px" src={image} alt="Empty" />
            <h2>{title}</h2>
            <p class="opacity-6">{description}</p>
            <button onClick={() => setCartOpened(false)} class="greenButton">
                <img src="/img/arrow.svg" alt="Arrow" />
                Return back
            </button>
        </div>
    )
}

export default Info;
