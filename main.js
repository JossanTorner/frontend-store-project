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


function addToCart(id, title, price, image){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({id, title, price, image});
    localStorage.setItem("cart", JSON.stringify(cart));
}


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
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">${product.description.substring(0, 100)}...</p>
                <p class="card-text"><strong>${product.price} $</strong></p>
                <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')">
                    Lägg till i kundvagn
                    </button>
            </div>
        </div>`;
        productsContainer.appendChild(productCard);
    });
}

loadProducts();


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

displayCart();

