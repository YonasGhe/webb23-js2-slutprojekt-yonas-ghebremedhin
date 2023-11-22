import React, { useState} from "react";

export default function SearchForm({searchProducts}) {
    const [searchTerm, setSearchTerm] = useState("");

    function handleChange(e){
        setSearchTerm(e.target.value);
        
    }

    function handleSubmit(e){
        e.preventDefault();
        searchProducts(searchTerm);
        setSearchTerm("");
    
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Search products..."
             value={searchTerm} onChange={handleChange}/>
            <button type="submit">Search</button>
        </form>
    );
};