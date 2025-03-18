

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
                <h4><a href="product.html?id=${product.id}" class="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">${product.title}</a></h3>
                <p class="card-text"><strong>${product.price} $</strong></p>
            </div>
        </div>`;
        productsContainer.appendChild(productCard);
    });
}


loadProducts();

//Product-page
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

// Lägger produkt i localstorage
function addToStorage(id, title, price, image, quantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingProduct = cart.find(product => product.id === id);
    
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ id, title, price, image, quantity});
    }
    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}




//Shopping cart-page

function loadCart(){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let shoppingCart = document.getElementById("shopping-cart");
    shoppingCart.innerHTML = "";
    let totalPrice = document.getElementById("total");
    let currentTotal = 0;
    
    cart.forEach(product => {
        let price = parseFloat(product.price);
        shoppingCart.innerHTML += `<div>
                <div class="list-group list-unstyled">
                  <div class="d-flex align-items-center">
                    <img src="${product.image}" class="img-fluid mx-3"  style="width: 150px;" alt="${product.title}">
                    <div class="d-flex flex-column">
                      <h5 class="m-3">${product.title}</h5>
                      <p class="mx-3">${price} $</p>
                    </div>
                    <div class="d-flex align-items-center">
                      <button class="btn btn-outline-primary" data-id="${product.id}" onclick="quantityMinus(event)">−</button>
                      <input type="number" id="${product.id}" value="${product.quantity}" min="1" class="form-control text-center mx-2" style="width: 60px;">
                      <button class="btn btn-outline-primary" data-id="${product.id}" onclick="quantityPlus(event)">+</button>
                    </div>
                   </div>
                 </div>
              </div>`;

                currentTotal+= price * parseFloat(product.quantity);
    });

    totalPrice.textContent = currentTotal.toFixed(2) + "$";
}

function removeItem(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function quantityPlus(event){
    let clickedButton = event.target;
    let productId = clickedButton.getAttribute("data-id");
    let currentQuantity = document.getElementById(productId);
    currentQuantity.value = parseInt(currentQuantity.value) + 1;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = cart.find(product => product.id === productId);
    if (product) {
        product.quantity = parseInt(currentQuantity.value);  // Uppdatera kvantiteten för produkten
        localStorage.setItem("cart", JSON.stringify(cart));  // Spara tillbaka till localStorage
    }
    loadCart(); 
}

function quantityMinus(event){
    let clickedButton = event.target;
    let productId = clickedButton.getAttribute("data-id");
    let currentQuantity = document.getElementById(productId);
    if (parseInt(currentQuantity.value) > 1) {
        currentQuantity.value = parseInt(currentQuantity.value) - 1;
        loadCart();
    }
    else{
        removeFromCart(productId);
    }
}

function removeFromCart(productId){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

document.addEventListener("DOMContentLoaded", loadCart);

document.addEventListener("DOMContentLoaded", function () {
    let addToCartButton = document.getElementById('add-to-cart-button');

    if (addToCartButton != null) {
        addToCartButton.addEventListener('click', function () {
            let productId = new URLSearchParams(window.location.search).get("id");
            let title = document.getElementById("product-title").textContent;
            let price = document.getElementById("product-price").textContent.replace("$", "");
            let image = document.getElementById("product-image").src;

            addToStorage(productId, title, price, image, 1);
            loadCart();
        });
    }
});


