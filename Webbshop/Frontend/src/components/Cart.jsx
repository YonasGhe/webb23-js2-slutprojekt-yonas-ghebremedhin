import React, { useState } from "react";

export default function Cart({cart, empty, buyProducts}){
    const total = cart.reduce((acc, cartItem) => {
            const product = cartItem.product;
            return acc + (parseFloat(product.price) * cartItem.quantity);
    }, 0);

    
    return(
        <div className="cart">
            {cart.length === 0 ?(
                null
            ): (
                <div>
                <ul>
                    {cart.map((cartItem) => (
                        <li key={cartItem.product.id}>
                             {cartItem.product.name} - {cartItem.quantity} picies
                        </li>
                    ))}
                </ul>
             <p>Total: {total} kr</p>
            <button onClick={empty}>Empty</button>
            <button onClick={buyProducts}>Pay</button>
        </div>
        )}
        </div>
    );
}