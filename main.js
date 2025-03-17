async function fetchJewelery(){
    let response = await fetch("https://fakestoreapi.com/products/category/jewelery")
    let products = await response.json();

    let randomIndex = Math.floor(Math.random() * products.length);
    let randomProduct = products[randomIndex];
    
    document.getElementById("jewelery").src = randomProduct.image;

}
fetchJewelery();

async function fetchWomenShirt(){
    let response = await fetch("https://fakestoreapi.com/products/category/women's clothing")
    let products = await response.json();

    let randomIndex = Math.floor(Math.random() * products.length);
    let randomProduct = products[randomIndex];
    
    document.getElementById("women-shirt-image").src = randomProduct.image;

}
fetchWomenShirt();

async function fetchMensShirt(){
    let response = await fetch("https://fakestoreapi.com/products/category/men's clothing")
    let products = await response.json();

    let randomIndex = Math.floor(Math.random() * products.length);
    let randomProduct = products[randomIndex];
    
    document.getElementById("mens-shirt-image").src = randomProduct.image;

}

fetchMensShirt();

async function fetchElectronic(){
    let response = await fetch("https://fakestoreapi.com/products/category/electronics")
    let products = await response.json();

    let randomIndex = Math.floor(Math.random() * products.length);
    let randomProduct = products[randomIndex];
    
    document.getElementById("electronic").src = randomProduct.image;

}

fetchElectronic()


//Products-page

async function loadProducts(){
    let response = await fetch("https://fakestoreapi.com/products");
    let products = await response.json();
    let productsContainer = document.getElementById("products");


    products.forEach(product => {
        let productCard = document.createElement("div");
        productCard.classList.add("col");
        productCard.innerHTML = `
        <div class="card">
            <img src="${product.image}" class="card-img-top" alt="${product.title}" style="height: 200px; object-fit: contain;">
            <div class="card-body">
                <h3><a href="product.html?id=${product.id}" class="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">${product.title}</a></h3>
                <p class="card-text"><strong>${product.price} $</strong></p>
            </div>
        </div>`;
        productsContainer.appendChild(productCard);
    });
}


loadProducts();

function loadSingleProduct(){
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    fetch(`https://fakestoreapi.com/products/${productId}`).then(response => response.json()).then(product => {
        document.getElementById("product-title").textContent = product.title;
        document.getElementById("product-image").src = product.image;
        document.getElementById("product-description").textContent = product.description;
        document.getElementById("product-price").textContent = product.price + "$";
    })
}

loadSingleProduct();

//Product-page

function addToCart(id, title, price, image){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({id, title, price, image});
    localStorage.setItem("cart", JSON.stringify(cart));
}


//Shopping cart-page

function displayCart(){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartContainer = document.getElementById("cart");
    cartContainer.innerHTML = "";
    
    cart.forEach(product => {
        cartContainer.innerHTML += `
        <li class="list-group-item">
            ${product.title}
            <button class="btn btn-danger btn-sm float-end" onclick="removeItem(${product.id})">X</button>
        </li>`;
    });
}

function removeItem(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

document.addEventListener("DOMContentLoaded", displayCart);

document.addEventListener("DOMContentLoaded", function () {
    let addToCartButton = document.getElementById('add-to-cart-button');

    if (addToCartButton != null) {
        addToCartButton.addEventListener('click', function () {
            let productId = new URLSearchParams(window.location.search).get("id");
            let title = document.getElementById("product-title").textContent;
            let price = document.getElementById("product-price").textContent.replace("$", "");
            let image = document.getElementById("product-image").src;

            addToCart(productId, title, price, image);
            displayCart();
        });
    }
});

displayCart();

