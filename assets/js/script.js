const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}

/**
 * navbar toggle
 */

const navToggler = document.querySelector("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  navToggler.classList.toggle("active");
}

addEventOnElem(navToggler, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);

/**
 * active header when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const activeElemOnScroll = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", activeElemOnScroll);

/**
 * Cart functionality
 */

let cartItems = [];
const cartCountElem = document.querySelector(".btn-badge");
const cartModal = document.getElementById("cart-modal");
const cartItemsList = document.getElementById("cart-items-list");
const closeCartModalBtn = document.getElementById("close-cart-modal");
const cartIconBtn = document.querySelector("[aria-label='cart']");
const totalPriceElem = document.getElementById("total-price");

const updateCartCount = function () {
  cartCountElem.textContent = cartItems.reduce((total, item) => total + item.quantity, 0);
}

const updateTotalPrice = function () {
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  totalPriceElem.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

const addToCart = function (product) {
  const existingProductIndex = cartItems.findIndex(item => item.title === product.title);
  if (existingProductIndex > -1) {
    alert("This item is already in the cart.");
  } else {
    product.quantity = 1;
    cartItems.push(product);
  }
  updateCartCount();
  updateTotalPrice();
  updateCartModal();
}

const removeFromCart = function (index) {
  cartItems.splice(index, 1);
  updateCartCount();
  updateTotalPrice();
  updateCartModal();
}

const updateQuantity = function (index, increment) {
  if (cartItems[index].quantity + increment > 0) {
    cartItems[index].quantity += increment;
  } else {
    removeFromCart(index);
  }
  updateCartCount();
  updateTotalPrice();
  updateCartModal();
}

const updateCartModal = function () {
  cartItemsList.innerHTML = '';
  cartItems.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
    <img src="${item.image}" alt="${item.title}" width="50">
    <span>${item.title} - $${item.price}</span>
    <span>Quantity: ${item.quantity}</span>
    <span>Total: $${(item.price * item.quantity).toFixed(2)}</span>
    <button onclick="updateQuantity(${index}, 1)">+</button>
    <button onclick="updateQuantity(${index}, -1)">-</button>
    <button onclick="removeFromCart(${index})">Remove</button>
  `;
    cartItemsList.appendChild(listItem);
  });
}

const showCartModal = function () {
  cartModal.style.display = "block";
}

const hideCartModal = function () {
  cartModal.style.display = "none";
}

addEventOnElem(cartIconBtn, "click", showCartModal);
addEventOnElem(closeCartModalBtn, "click", hideCartModal);
window.onclick = function (event) {
  if (event.target == cartModal) {
    cartModal.style.display = "none";
  }
}

/**
 * add event listeners to "Add to Cart" buttons
 */

const addToCartButtons = document.querySelectorAll(".card-action-btn");

addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productCard = button.closest('.product-card');
    const title = productCard.querySelector('.card-title').textContent;
    const price = parseFloat(productCard.querySelector('.card-price').getAttribute('value'));
    const image = productCard.querySelector('.default').src;
    addToCart({ title, price, image });
  });
});

