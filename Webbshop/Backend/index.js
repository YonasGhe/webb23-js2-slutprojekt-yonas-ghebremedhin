const fs = require(`fs`);
const express = require(`express`);
const app = express();
app.use(express.json());

app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
    
    next();

});

app.get("/products", (req, res) => {
    let body = [];
    console.log("Get request received at /products");

    const rawProducts = fs.readFileSync("./json/products.json", "utf8");
    const products= JSON.parse(rawProducts);

    if (req.query.title != undefined){
        const queryTitle = req.query.title.toLowerCase();

        products.forEach((product) => {
            const productName = product.name.toLowerCase();
            if (productName.includes(queryTitle)) {
                body.push(product);
            }
        });
    } else {
        body = products;
    }
    res.send(body);

});
  
app.patch("/products", (req, res) => {
    const purchasedProducts = req.body;

    try { 
    const rawProducts = fs.readFileSync("./json/products.json", "utf8");
    const products= JSON.parse(rawProducts);

    for (let i = 0; i < purchasedProducts.length; i++) { 
        const product = purchasedProducts[i];
            const productInFile = products.find((p) => p.id === product.product.id);
            
            if(productInFile){
                productInFile.store -= product.quantity;
            } 
        }

        fs.writeFileSync("./json/products.json", JSON.stringify(products, null, 2));

    res.send({ message: "Purchase updates successfully"});

    } catch (error){
        console.error("Error updating products file: ", error);
    
     }
});

app.listen(3008, () => {
    console.log("App listening on port 3008!");
});