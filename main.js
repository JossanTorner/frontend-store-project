
document.addEventListener("DOMContentLoaded", loadCart);
document.addEventListener("DOMContentLoaded", loadProducts)
document.addEventListener("DOMContentLoaded", loadSingleProduct)

function createHTMLProduct(product){
    return   `
    <div class="col">
        <div class="card">
            <img src="${product.image}" class="card-img-top" alt="${product.title}" style="height: 200px; object-fit: contain;">
            <div class="card-body">
                <h4><a href="product.html?id=${product.id}" class="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">${product.title}</a></h4>
                <p class="card-text"><strong>${product.price} $</strong></p>
            </div>
        </div>
    </div>`;
}

function createHTMLCartProduct(product){
    return `<div>
                <div class="list-group list-unstyled">
                  <div class="d-flex">
                    <img src="${product.image}" class="img-fluid m-3"  style="width: 150px;" alt="${product.title}">
                    <div class="d-flex flex-column">
                      <h5 class="m-3">${product.title}</h5>
                      <p class="mx-3">${product.price} $</p>
                    </div>
                    <div class="d-flex align-items-center  ms-auto">
                      <button class="btn btn-outline-primary" data-id="${product.id}" onclick="quantityMinus(event)">−</button>
                      <input type="number" id="${product.id}" value="${product.quantity}" min="1" class="form-control text-center mx-2" style="width: 60px;">
                      <button class="btn btn-outline-primary" data-id="${product.id}" onclick="quantityPlus(event)">+</button>
                    </div>
                   </div>
                 </div>
              </div>`;
}

function createHTMLCartProductt(product){
    return `<div>
                <div class="list-group list-unstyled">
                  <div class="d-flex align-items-center">
                    <img src="${product.image}" class="img-fluid m-3"  style="width: 150px;" alt="${product.title}">
                    <div class="d-flex flex-column">
                      <h5 class="m-3">${product.title}</h5>
                      <p class="mx-3" id="unit-price">Unit price: ${product.price} $</p>
                      <p class="mx-3" id="total-for-product-${product.id}"></p>
                    </div>
                    <div class="d-flex align-items-center  ms-auto">
                      <button class="btn btn-outline-primary" data-id="${product.id}" onclick="quantityMinus(event)">−</button>
                      <input type="number" id="${product.id}" value="${product.quantity}" min="1" class="form-control text-center mx-2" style="width: 60px;" readOnly>
                      <button class="btn btn-outline-primary" data-id="${product.id}" onclick="quantityPlus(event)">+</button>
                    </div>
                   </div>
                 </div>
              </div>`;
}


//Products-page
async function loadProducts(){
    let response = await fetch("https://fakestoreapi.com/products");
    let products = await response.json();
    let productsContainer = document.getElementById("products");

    products.forEach(product => {
        productsContainer.innerHTML += createHTMLProduct(product);
    });
}

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

//Shopping cart-page
function loadCart(){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartElement = document.getElementById("shopping-cart");

    cartElement.innerHTML = "";
    let currentTotal = 0;
    
    cart.forEach(product => {
        cartElement.innerHTML += createHTMLCartProductt(product);
        document.getElementById(`total-for-product-${product.id}`).textContent = "Total: " + 
        (parseFloat(product.price) * parseFloat(product.quantity)).toFixed(2) + " $";
        currentTotal+= parseFloat(product.price) * parseFloat(product.quantity);
    });

    document.getElementById("total").textContent = currentTotal.toFixed(2) + "$";
}

// Lägger produkt i localstorage
function addToStorage(id, title, price, image, quantity) {
    // hämtar storage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    // kollar om produkten som läggs till redan finns där
    let existingProduct = cart.find(product => product.id === id);
    
    // om produkten finns, lägg ej till men öka quantity
    // annars pusha till storage
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ id, title, price, image, quantity});
    }
    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}


function quantityPlus(event){
    let clickedButton = event.target;
    let productId = clickedButton.getAttribute("data-id");
    let currentQuantity = document.getElementById(productId);
    currentQuantity.value = parseInt(currentQuantity.value) + 1;
    updateQuantityInStorage(currentQuantity.value, productId)
    loadCart(); 
}


function quantityMinus(event){
    let clickedButton = event.target;
    let productId = clickedButton.getAttribute("data-id");
    let currentQuantity = document.getElementById(productId);
    if (parseInt(currentQuantity.value) >1) {
        currentQuantity.value = parseInt(currentQuantity.value) - 1;
        updateQuantityInStorage(currentQuantity.value, productId)
    }
    else{
        removeFromCart(productId);
    }
    loadCart();
}

function updateQuantityInStorage(newQuantity, productId){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let product = cart.find(product => product.id === productId);
        if (product) {
            product.quantity = parseInt(newQuantity);
            localStorage.setItem("cart", JSON.stringify(cart));
        }
}

function removeFromCart(productId){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

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


