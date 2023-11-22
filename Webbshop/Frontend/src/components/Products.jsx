import { useState } from "react";

export default function Products({product, addToCart}){ 
    addProductToCart = () =>{
        if(product.store > 0 ){
            addToCart(product);
        }
    };

    return(
        <div className="product">
            <img src={product.image} alt={product.name} />
            <h4>{product.name}</h4>
            <p>{product.price}kr</p>
            <button onClick={addProductToCart} disabled={product.store === 0}>Buy</button>
            <p>store: {product.store}</p>
        </div>
    );
}