import React from "react";

export default function Navigation({ cart, activeSection, handleChange}) {
    const countOrder = cart.reduce((total, item) => total + item.quantity, 0);
    return (
        <div className="nav">
            <li>
                <a href="#" onClick={(e) =>{
                    e.preventDefault();
                    handleChange("products");
                }}
                className={activeSection === "products" ? "active" : ""}
                >
                products
                </a>
                </li>
            <li>
                <a href="#" 
                onClick={(e) =>{
                    e.preventDefault();
                    handleChange("cart");
                }}
                className={activeSection === "cart" ? "active" : ""}
                >
                    cart <p>{countOrder}</p>
                    </a>
                    </li>
        </div>
    
    );
}