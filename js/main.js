document.addEventListener('DOMContentLoaded', function() {
            // Product Data
            const products = [{
                    id: 1,
                    title: "Adidas T-Shirt",
                    price: 30,
                    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
                    category: "clothing",
                    badge: "New"
                },
                {
                    id: 2,
                    title: "Wireless Earbuds",
                    price: 199,
                    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
                    category: "electronics",
                    badge: "Sale"
                },
                {
                    id: 3,
                    title: "Redtape Jacket",
                    price: 99,
                    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
                    category: "clothing",
                    badge: "Popular"
                },
                {
                    id: 4,
                    title: "Stainless Water Bottle",
                    price: 19,
                    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
                    category: "accessories"
                },
                {
                    id: 5,
                    title: "Silver Sunglasses",
                    price: 7,
                    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
                    category: "accessories"
                },
                {
                    id: 6,
                    title: "Adidas Cap",
                    price: 45,
                    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee",
                    category: "accessories",
                    badge: "New"
                },
                {
                    id: 7,
                    title: "Leather Backpack",
                    price: 50,
                    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
                    category: "accessories"
                },
                {
                    id: 8,
                    title: "Adidas Running Shoes",
                    price: 399,
                    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2",
                    category: "footwear",
                    badge: "Hot"
                }
            ];

            // Cart Array
            let cart = [];

            // Show notification
            function showNotification(message, type = 'success') {
                const notification = document.createElement('div');
                notification.classList.add('notification', type);
                notification.textContent = message;
                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.classList.add('fade-out');
                    setTimeout(() => {
                        notification.remove();
                    }, 300);
                }, 3000);
            }

            // Sort products
            function sortProducts(sortBy) {
                let sortedProducts = [...products];

                switch (sortBy) {
                    case 'price-low':
                        sortedProducts.sort((a, b) => a.price - b.price);
                        break;
                    case 'price-high':
                        sortedProducts.sort((a, b) => b.price - a.price);
                        break;
                    case 'name':
                        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
                        break;
                    default:
                        return products;
                }

                return sortedProducts;
            }

            // Render products
            function renderProducts(productsToRender) {
                const shopContent = document.querySelector(".shop-content");
                shopContent.innerHTML = '';

                productsToRender.forEach(product => {
                            const productElement = document.createElement('div');
                            productElement.classList.add('product-box');
                            productElement.innerHTML = `
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <img src="${product.image}" alt="${product.title}" class="product-img">
                <div class="product-info">
                    <h2 class="product-title">${product.title}</h2>
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-cart" data-id="${product.id}">
                        <i class='bx bx-cart'></i> Add to Cart
                    </button>
                </div>
            `;
            shopContent.appendChild(productElement);
        });

        // Add event listeners to all add to cart buttons
        document.querySelectorAll(".add-cart").forEach(button => {
            button.addEventListener("click", addToCartClicked);
        });
    }

    // Add to cart logic
    function addToCartClicked(e) {
        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);

        if (!product) return;

        // Check if item already in cart
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        // Add animation
        e.currentTarget.classList.add('animate__animated', 'animate__bounce');
        setTimeout(() => {
            e.currentTarget.classList.remove('animate__animated', 'animate__bounce');
        }, 1000);

        updateCartIcon();
        showNotification(`${product.title} added to cart`, 'success');
    }

    // Render cart items
    function renderCartItems() {
        const cartContent = document.querySelector(".cart-content");

        if (cart.length === 0) {
            cartContent.innerHTML = `
                <div class="cart-empty">
                    <i class='bx bx-cart'></i>
                    <p>Your cart is empty</p>
                    <button class="btn" id="continue-shopping">Continue Shopping</button>
                </div>
            `;

            document.getElementById("continue-shopping").addEventListener("click", () => {
                document.querySelector(".cart").classList.remove("active");
                document.querySelector(".cart-overlay").classList.remove("active");
            });
            return;
        }

        cartContent.innerHTML = '';
        cart.forEach(item => {
            const cartBox = document.createElement("div");
            cartBox.classList.add("cart-box");
            cartBox.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-img">
                <div class="detail-box">
                    <div class="cart-product-title">${item.title}</div>
                    <div class="cart-price">$${item.price.toFixed(2)}</div>
                    <input type="number" value="${item.quantity}" min="1" class="cart-quantity" data-id="${item.id}">
                </div>
                <i class='bx bx-trash cart-remove' data-id="${item.id}"></i>
            `;
            cartContent.appendChild(cartBox);
        });

        // Add event listeners for quantity changes and removal
        document.querySelectorAll(".cart-remove").forEach(button => {
            button.addEventListener("click", (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                cart = cart.filter(item => item.id !== productId);
                renderCartItems();
                updateCartIcon();
                showNotification('Item removed from cart', 'error');
            });
        });

        document.querySelectorAll(".cart-quantity").forEach(input => {
            input.addEventListener("change", (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const newQuantity = parseInt(e.target.value);

                if (isNaN(newQuantity) || newQuantity < 1) {
                    cart = cart.filter(item => item.id !== productId);
                    showNotification('Item removed from cart', 'error');
                } else {
                    const item = cart.find(item => item.id === productId);
                    if (item) item.quantity = newQuantity;
                }

                renderCartItems();
                updateCartIcon();
            });
        });

        updateTotal();
    }

    // Update total
    function updateTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.querySelector(".total-price").innerText = "$" + total.toFixed(2);
    }

    // Update cart icon
    function updateCartIcon() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector(".cart-quantity").innerText = totalItems;
    }

    // Initialize cart functionality
    function initCart() {
        // Cart toggle
        document.getElementById("cart-icon").addEventListener("click", () => {
            document.querySelector(".cart").classList.add("active");
            document.querySelector(".cart-overlay").classList.add("active");
            renderCartItems();
        });

        document.getElementById("close-cart").addEventListener("click", () => {
            document.querySelector(".cart").classList.remove("active");
            document.querySelector(".cart-overlay").classList.remove("active");
        });

        document.querySelector(".cart-overlay").addEventListener("click", () => {
            document.querySelector(".cart").classList.remove("active");
            document.querySelector(".cart-overlay").classList.remove("active");
        });
    }

    // Simulated payment processor
    function processPayment(total, items) {
        return new Promise((resolve) => {
            // Simulate API call delay
            setTimeout(() => {
                // Generate a random transaction ID
                const transactionId = 'TXN' + Math.floor(Math.random() * 1000000);
                resolve({
                    success: true,
                    transactionId: transactionId,
                    amount: total,
                    items: items
                });
            }, 1500);
        });
    }

    // Payment modal functions
    function showPaymentModal() {
        const modal = document.createElement('div');
        modal.className = 'payment-modal';
        modal.innerHTML = `
            <div class="payment-modal-content">
                <span class="close-payment-modal">&times;</span>
                <h2>Complete Your Purchase</h2>
                <div class="payment-form">
                    <div class="form-group">
                        <label for="card-number">Card Number</label>
                        <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19">
                    </div>
                    <div class="form-group">
                        <label for="card-expiry">Expiry Date</label>
                        <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5">
                    </div>
                    <div class="form-group">
                        <label for="card-cvc">CVC</label>
                        <input type="text" id="card-cvc" placeholder="123" maxlength="3">
                    </div>
                    <div class="form-group">
                        <label for="card-name">Name on Card</label>
                        <input type="text" id="card-name" placeholder="John Doe">
                    </div>
                    <button id="submit-payment" class="btn">Pay $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add input formatting
        document.getElementById('card-number').addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        });

        document.getElementById('card-expiry').addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
        });

        // Close modal
        document.querySelector('.close-payment-modal').addEventListener('click', () => {
            modal.remove();
        });

        // Submit payment
        document.getElementById('submit-payment').addEventListener('click', async () => {
            const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
            const expiry = document.getElementById('card-expiry').value;
            const cvc = document.getElementById('card-cvc').value;
            const name = document.getElementById('card-name').value;

            // Simple validation
            if (!cardNumber || !expiry || !cvc || !name) {
                showNotification('Please fill all payment details', 'error');
                return;
            }

            if (cardNumber.length !== 16) {
                showNotification('Please enter a valid card number', 'error');
                return;
            }

            showNotification('Processing payment...', 'info');

            try {
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const paymentResult = await processPayment(total, cart);

                if (paymentResult.success) {
                    showNotification('Payment successful! Thank you for your purchase.', 'success');
                    // Clear cart
                    cart = [];
                    updateCartIcon();
                    renderCartItems();
                    modal.remove();
                    
                    // Show receipt (simulated)
                    setTimeout(() => {
                        alert(`Payment Confirmation\n\nTransaction ID: ${paymentResult.transactionId}\nAmount: $${total.toFixed(2)}\n\nThank you for your purchase!`);
                    }, 500);
                } else {
                    showNotification('Payment failed. Please try again.', 'error');
                }
            } catch (error) {
                showNotification('Payment error. Please try again.', 'error');
                console.error('Payment error:', error);
            }
        });
    }

    // Initialize checkout functionality
    function initCheckout() {
        document.querySelector(".btn-buy").addEventListener("click", () => {
            if (cart.length === 0) {
                showNotification("Your cart is empty!", "error");
                return;
            }
            showPaymentModal();
        });
    }

    // Initialize server-related functionality
    function initServer() {
        // Sort products dropdown
        document.getElementById("sort-by").addEventListener("change", (e) => {
            const sortedProducts = sortProducts(e.target.value);
            renderProducts(sortedProducts);
        });
    }

    // Initialize mobile menu toggle
    document.querySelector(".hamburger").addEventListener("click", () => {
        const navMenu = document.querySelector(".nav-menu");
        navMenu.classList.toggle("active");
        document.querySelector(".hamburger").innerHTML = navMenu.classList.contains("active") ?
            '<i class="bx bx-x"></i>' : '<i class="bx bx-menu"></i>';
    });

    // Initialize all modules
    renderProducts(products);
    initCart();
    initServer();
    initCheckout();
});