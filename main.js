
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (path.includes("cart.html")) {
        loadCartPage();
    } else if (path.includes("product.html")) {
        loadSingleProductPage();
    } else if (path.includes("index.html")) {
        loadProductsPage();
    }

    updateNavbarCartCount();
});

// HTML-cards

function createHTMLProducts(product){
    return   `
    <div class="col">
        <div class="card">
            <img src="${product.image}"
             class="card-img-top my-4" alt="${product.title}" style="height: 200px; object-fit: contain;">
            <div class="card-body">
                <h4><a href="product.html?id=${product.id}" 
                class="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">
                ${product.title}</a></h4>
                <p class="card-text"><strong>${product.price} $</strong></p>
                <div>
                    <button type="button" class="btn btn-secondary mt-2" onclick="addToStorage(${product.id}, '${product.title}', ${product.price}, '${product.image}', 1)">
                    Add to cart</button>
                </div>
            </div>
        </div>
    </div>`;
}

function createHTMLSingleProduct(product){
    return `<div class="row justify-content-center">
                                         <div class="col-lg-4 col-12 p-4">
                                             <div class="image-container">
                                                 <img src="${product.image}" class="img-fluid" id="product-image" alt="...">
                                             </div>
                                        </div>
                                        <div class="col-lg-4 col-12 p-4">
                                        <div class="product-details">
                                            <div id="product-title" class="h5">${product.title}</div>
                                            <div id="product-description">${product.description}</div>
                                            <div id="product-price">${product.price}</div>
                                            <div id="product-button">
                                                <button type="button" class="btn btn-secondary mt-2"
                                                onclick="addToStorage(${product.id}, '${product.title}', ${product.price}, '${product.image}', 1)">
                                                Add to cart</button>
                                            </div>
                                        </div>
                                        </div>
                                    </div>`;
}

function createHTMLCartProduct(product){
    return `<div class="list-group list-unstyled">
                <div class="d-flex flex-column flex-md-row align-items-center border-bottom">

                    <img src="${product.image}" class="img-fluid m-3"  style="width: 150px;" alt="${product.title}">

                    <div class="d-flex flex-column flex-grow-1">
                      <h5 class="m-3">${product.title}</h5>
                      <p class="mx-3" id="unit-price">Unit price: ${product.price} $</p>
                      <p class="mx-3" id="total-for-product-${product.id}"></p>
                    </div>

                    <div class="d-flex align-items-center justify-content-center my-3 mx-md-3">
                      <button class="btn btn-outline-primary" onclick="quantityMinus(${product.id})">−</button>
                      <input type="text" value="${product.quantity}" min="1" class="form-control text-center mx-2" style="width: 60px;" readOnly>
                      <button class="btn btn-outline-primary" onclick="quantityPlus(${product.id})">+</button>
                    </div>

                </div>
            </div>`;
}


async function fetchProducts(){
    return await fetch("https://fakestoreapi.com/products")
        .then(response => response.json());
}

async function fetchProductById(productId) {
    const products = await fetchProducts();
    return products.find(product => product.id === Number(productId));
}

//Products-page

async function loadProductsPage(){
    let productsContainer = document.getElementById("products");
    const products = await fetchProducts();

    let html = "";
    products.forEach(product => {
        html += createHTMLProducts(product);
    });

    productsContainer.innerHTML += html;
}


//Single product page

function loadSingleProductPage(){
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    let productContainer = document.getElementById("product-container");

    fetchProductById(productId).then(product => {
        productContainer.innerHTML += createHTMLSingleProduct(product);
    });
}


//Shopping cart-page

function loadCartPage(){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartElement = document.getElementById("shopping-cart");

    cartElement.innerHTML = "";
    let currentTotal = 0;
    
    cart.forEach(product => {
        cartElement.innerHTML += createHTMLCartProduct(product);
        document.getElementById(`total-for-product-${product.id}`).textContent = "Total: " + (parseFloat(product.price) * parseFloat(product.quantity)).toFixed(2) + " $";
        currentTotal+= parseFloat(product.price) * parseFloat(product.quantity);
    });

    document.getElementById("total").textContent = currentTotal.toFixed(2) + "$";
}

// Shopping cart functions

function getCartInStorage(){
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function getProductFromCart(cart, id){
    return cart.find(product => product.id === id);
}

function addToStorage(id, title, price, image, quantity) {
    let cart = getCartInStorage();
    let existingProduct = getProductFromCart(cart, id);
    
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ id, title, price, image, quantity});
    }
    localStorage.setItem("cart", JSON.stringify(cart));


    updateCart();
}

function quantityPlus(id){

    let cart = getCartInStorage();
    let existingProduct = getProductFromCart(cart, id);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
    }
}

function quantityMinus(id){

    let cart = getCartInStorage();
    let existingProduct = getProductFromCart(cart, id);
    
    if (existingProduct) {
        if (existingProduct.quantity > 1) {
            existingProduct.quantity -= 1;
        } else {
            cart = cart.filter(product => product.id != existingProduct.id);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
    }
}


function updateNavbarCartCount(){
    let cart = getCartInStorage();
    let count = 0;

    cart.forEach(product => {
        count += product.quantity;
    });

    let cartCountIcon = document.getElementById("cart-count");
    cartCountIcon.textContent = count;
}

function updateCart(){
    updateNavbarCartCount();
    loadCartPage();
}