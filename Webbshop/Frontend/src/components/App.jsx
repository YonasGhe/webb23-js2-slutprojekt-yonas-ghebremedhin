import React, { useEffect, useState } from "react";
import Css from "../css/App.css";
import products from "./Products";
import Cart from "./Cart";
import Navigation from "./Navigation";
import SearchForm from "./SearchForm";
import Error from "./Error";

export default function App() { 
    const initialProducts = [ 
        {id: 1, name: "Optimum-Whey", price: 850, store: 11, image: "https://www.proteinbolaget.se/img/bilder/artiklar/zoom/PB-00018-7_1.jpg?m=1603279466"},
        {id: 2, name: "Premium-Iso", price: 449, store: 5, image:  "https://lh3.googleusercontent.com/At1pVM9yPkLq2-Kn7Oeovenao3gmqODAPDNfElfpRVJ43XcPXixBYuwlN9hXIIRw5x77HpdAGIipYzBqhYJOY8K3ZDINDxL9=l80-w780-h790-nu"},
        {id: 3, name: "Whey-80", price: 259, store: 8, image: "https://www.gymgrossisten.com/dw/image/v2/BDJH_PRD/on/demandware.static/-/Sites-hsng-master-catalog/default/dw99dc79a1/Nya_produktbilder/Star_Nutrition/585R_Starnutrition_Whey80_Strawberry_1kg_Feb20.jpg?sw=655&sh=655&sm=fit&sfrm=png"},
        {id: 4, name: "Pulverprotein", price: 260, store: 3, image: "https://cdn.mmsports.se/images/D/BSC-Whey100-Natural-960_190812.jpg"},
        {id: 5, name: "Iso Zero", price: 899, store: 10, image: "https://media.meds.se/meds/images/maxx-27397490-g-2019-12-23-095301257/550/550/fill/c/biotech-usa-iso-whey-chocolate-2-27-kg.jpg"},
        {id: 6, name: "Protein-shake", price: 349, store: 0, image: "https://cdn.mmsports.se/images/D/BodyScience_ProteinDelight_VanillaMilkshake-2pack.jpg"},
        {id: 7, name: "Vega protein", price: 650, store: 7, image: "https://myvega.com/cdn/shop/products/VegaPremiumSportVanilla29.2ozTub.png?v=1681853439&width=900"},
        {id: 8, name: "Elit Nutrition", price: 399, store: 4, image: "https://cdn.abicart.com/shop/images/187915393-origpic-308343/ws58/38958/art58/h5393/Whey_900g_Caramel.png"}
    ];
    
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [activeSection, setActiveSection] = useState("products");
    const [store, setStore] = useState([...initialProducts]);
    const [showMessage, setShowMessage] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    async function searchProducts(searchTerm) {
        const apiUrl = `http://localhost:3008/products?title=${searchTerm || ""}`;
        
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.length > 0) {
                setProducts(data);
            } else {
                console.log("No products found", searchTerm);
                setProducts([]);
            }
       
        } catch (error) {
            console.error("An error occured", error);
        }
    };

    useEffect(() => {
        searchProducts(searchTerm);
    }, [searchTerm]);
    
    
    function addToCart(product) {
        if(product.store > 0){
        const updateCart = [...cart];
        const itemIndex = updateCart.findIndex((cartItem) => cartItem.product.id === product.id);

        if(itemIndex !== -1) { 
            const item = updateCart[itemIndex];
                if (item.quantity + 1 <= product.store) {
                    item.product.store -= 1;
                    item.quantity += 1;
                } else {
                    console.log("Can't add more items to cart than available in the store");
                }
        } else {
            updateCart.push({product: {...product, store: product.store - 1}, quantity: 1});
             }

          setCart(updateCart);
        
        const updateStore = [...store];
        const productInStore = updateStore.find((item) => item.id === product.id);

        if(productInStore && productInStore.store > 0) {
            productInStore.store -= 1;
        }

        setStore(updateStore);
        searchProducts(searchTerm);
        setShowMessage(false);
    }
    }
    
    async function buyProducts(){
        const url = `http://localhost:3008/products`;
    
    try {
        const options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(cart),
          };
      
          const response = await fetch(url, options);
          const data = await response.json();
      
          if (data.length === 0) {
            throw `Error`;
          }
          
          searchProducts(searchTerm);
          setShowMessage(true);
          setCart([]);
              
    } catch (error) {
        console.log("An error occurred", error);
    }
  }
    
    function empty() {
        const updateStore = [...store];

        cart.forEach((cartItem) => {
            const productInStore = updateStore.find((item) => item.id === cartItem.product.id);
            
            if(productInStore){
                productInStore.store += cartItem.quantity;
            }
        });
    
        setCart([]);
        setStore(updateStore);
        searchProducts(searchTerm);

        setActiveSection("products");
        setShowMessage(false);
        resetApp();
        };

    function resetApp() {
       setStore([...initialProducts]);

        const updateProducts = products.map((product) => {
            const initialProduct = initialProducts.find((initial) => initial.id === product.id);
            if(initialProduct){
                return {...product, store: initialProduct.store};
            }
            return product;
        });
        
        setProducts(updateProducts);
        setProducts([...initialProducts]);
        setCart([]);
    }

    return(
        <div className="App">
            <Navigation cart={cart} activeSection={activeSection} handleChange={setActiveSection}/>
            <SearchForm searchProducts={setSearchTerm} />
            {activeSection === "products" && (
            <div className="products">
            {products && products.map((product) => (
            <div className="product" key={product.id}>
                <img src={product.image} alt={product.name}/>
                <div className="product-details">
                <div className="product-name"> {product.name}</div>
                <div className="product-price"> {product.price}kr</div>
                </div>
                <div className="store-buy">
                <div className="store"> Store: {product.store}</div>
                <button className="buy-button" onClick={() => addToCart(product)}>Buy</button>
            </div>    
            </div> 
            ))}
            </div>
             )}
            {activeSection === "cart" && (
            <div className="cart">
            <Cart cart={cart} empty={empty} buyProducts={buyProducts}/>
            {showMessage && (
            <div className="message">
            <h3>Your purchase has been completed.</h3>
            <h1>Thank you for your purchase!</h1>
            </div>
             )}
            </div>
            )}
        </div>
    );       
}
