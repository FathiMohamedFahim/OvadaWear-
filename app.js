// Array to store cart items
let cart = [];

// Function to add a product to the cart
function addToCart(productName, productPrice) {
  cart.push({ name: productName, price: productPrice });
  updateCart();
}

// Function to display the cart content
function updateCart() {
  const cartContainer = document.querySelector("#cart-items");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty!</p>";
  } else {
    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.innerHTML = `
        <p>${item.name} - $${item.price.toFixed(2)}</p>
        <button onclick="removeFromCart(${index})">Remove</button>
      `;
      cartContainer.appendChild(cartItem);
    });
  }
}

// Function to remove a product from the cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Fetch products from API and display them
async function fetchProducts() {
  const response = await fetch("/api/products");
  const products = await response.json();

  const productList = document.querySelector(".product-list");
  productList.innerHTML = ""; // Clear existing products

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
    `;
    productList.appendChild(productDiv);
  });
}

// Call fetchProducts on page load
fetchProducts();

async function checkout() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: cart,
      total,
    }),
  });

  if (response.ok) {
    alert("Order placed successfully!");
    cart = [];
    updateCart();
  } else {
    alert("Error placing order.");
  }
}
