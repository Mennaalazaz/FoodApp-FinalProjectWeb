// API Base URL
const API_BASE = 'http://localhost:3000/api';

// Utility function to get auth token
function getToken() {
  return localStorage.getItem('token');
}

// Utility function to get user ID from token
function getUserId() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// Utility function to get user-specific cart key
function getCartKey() {
  const userId = getUserId();
  return userId ? `cart_${userId}` : 'cart';
}

// Utility function for API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  if (getToken()) {
    config.headers.Authorization = `Bearer ${getToken()}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ==================== AUTHENTICATION APIs ====================
async function registerUser(userData) {
  return await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

async function loginUser(credentials) {
  return await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

// ==================== CATEGORY APIs ====================
async function getCategories() {
  return await apiRequest('/categories');
}

async function addCategory(categoryData) {
  return await apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData)
  });
}

// ==================== FOOD APIs ====================
async function getFoodsByCategory(categoryId) {
  return await apiRequest(`/foods/category/${categoryId}`);
}

async function getFoodsByRestaurant(restaurantId) {
  return await apiRequest(`/foods/restaurant/${restaurantId}`);
}

async function getFoodDetails(foodId) {
  return await apiRequest(`/foods/details/${foodId}`);
}

async function addFood(foodData) {
  return await apiRequest('/foods', {
    method: 'POST',
    body: JSON.stringify(foodData)
  });
}

// ==================== RESTAURANT APIs ====================
async function getRestaurants() {
  return await apiRequest('/restaurants');
}

// ==================== ORDER APIs ====================
async function getUserOrders(userId) {
  return await apiRequest(`/orders/user/${userId}`);
}

async function placeOrder(orderData) {
  return await apiRequest('/orders/place', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
}

async function getRestaurantOrders(restaurantId) {
  return await apiRequest(`/orders/restaurant/${restaurantId}`);
}

async function getOrderStatus(orderId) {
  return await apiRequest(`/orders/status/${orderId}`);
}

// ==================== REVIEW APIs ====================
async function getOrderStatus(orderId) {
  return await apiRequest(`/reviews/${orderId}/status`);
}

async function updateOrderStatus(orderId, status) {
  return await apiRequest(`/reviews/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
}

async function addReview(reviewData) {
  return await apiRequest('/reviews/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });
}

async function getReviews(type, id) {
  return await apiRequest(`/reviews/reviews/${type}/${id}`);
}

// ==================== DASHBOARD APIs ====================
async function getRestaurantOrdersDashboard(restaurantId) {
  return await apiRequest(`/dashboard/orders/${restaurantId}`);
}

async function updateOrderStatusDashboard(orderId, status) {
  return await apiRequest(`/dashboard/order-status/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
}

async function getRestaurantStats(restaurantId) {
  return await apiRequest(`/dashboard/stats/${restaurantId}`);
}

// ==================== REPORTS APIs ====================
async function getDailyReport(restaurantId) {
  return await apiRequest(`/reports/daily/${restaurantId}`);
}

async function getWeeklyReport(restaurantId) {
  return await apiRequest(`/reports/weekly/${restaurantId}`);
}

async function getMonthlyReport(restaurantId) {
  return await apiRequest(`/reports/monthly/${restaurantId}`);
}

// ==================== MENU FUNCTIONS ====================
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('menu-items')) {
    loadCategories(); // Load categories dynamically
    loadFoodsByRestaurant(1); // Load restaurant 1 foods initially

    // Add search functionality
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    if (searchButton && searchInput) {
      searchButton.addEventListener('click', function() {
        const query = searchInput.value.toLowerCase().trim();
        if (query === '') {
          displayFoods(allFoods); // Show all if no query
        } else {
          const filteredFoods = allFoods.filter(food =>
            food.Name.toLowerCase().includes(query)
          );
          displayFoods(filteredFoods);
        }
      });
    }
  }
  updateCartCount();
});


// =======================
// Load Categories
// =======================
async function loadCategories() {
  try {
    const res = await fetch("http://localhost:3000/api/categories");
    const categories = await res.json();

    const tabs = document.getElementById("categoryTabs");
    tabs.innerHTML = "";

    categories.forEach(cat => {
      const tab = document.createElement("button");
      tab.className = "category-tabs";
      tab.innerText = cat.Name;

      tab.onclick = () => loadFoodsByCategory(cat.Category_ID);
      tab.ondblclick = () => displayFoods(allFoods); // Double-click to return to all
      tabs.appendChild(tab);
    });

  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

// =======================
// Load foods by restaurant
// =======================
let allFoods = [];

async function loadFoodsByRestaurant(restaurantId) {
  try {
    const res = await fetch(`http://localhost:3000/api/foods/restaurant/${restaurantId}`);
    allFoods = await res.json();
    displayFoods(allFoods);

  } catch (error) {
    console.error("Error loading foods:", error);
  }
}

// =======================
// Load foods by category
// =======================
async function loadFoodsByCategory(categoryId) {
  try {
    const res = await fetch(`http://localhost:3000/api/foods/category/${categoryId}`);
    const foods = await res.json();
    displayFoods(foods);

  } catch (error) {
    console.error("Error loading foods by category:", error);
  }
}

// =======================
// Display Foods Grid
// =======================
function displayFoods(foods) {
  const grid = document.getElementById("menu-items");
  grid.innerHTML = "";

  if (foods.length === 0) {
    grid.innerHTML = "<p>No items found.</p>";
    return;
  }

  foods.forEach(food => {
    grid.innerHTML += `
      <div class="menu-card">
        <img src="${food.imageURL}" alt="${food.Name}">
        <h3>${food.Name}</h3>
        <p>${food.Description || ""}</p>
        <span class="price">${food.Price} EGP</span>
        <button class="add-to-cart-btn" onclick="addToCart(${food.Food_ID}, '${food.Name}', ${food.Price})">Add to Cart</button>
      </div>
    `;
  });
}





// ==================== CART FUNCTIONS ====================
function addToCart(foodId, name, price) {
  const cartKey = getCartKey();
  let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');

  const existingItem = cart.find(item => item.id === foodId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: foodId,
      name: name,
      price: price,
      quantity: 1
    });
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  alert(`${name} added to cart!`);
  updateCartCount();
}

function updateCartCount() {
  const cartKey = getCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Update cart count in header if exists
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}

// ==================== UI FUNCTIONS ====================
function openSidebar() {
  document.getElementById("mySidebar").style.width = "250px";
}

function closeSidebar() {
  document.getElementById("mySidebar").style.width = "0";
}



// handle login form submission
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Save token (if the backend sends one)
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Save user data for dashboard
      if (data.type === "restaurant") {
        localStorage.setItem("userType", "restaurant");
        localStorage.setItem("restaurantId", data.restaurant.Restaurant_ID);
      } else {
        localStorage.setItem("userType", "user");
      }

      alert("Login successful!");

      // Redirect based on user type
      if (data.type === "restaurant") {
        window.location.href = "Dashboard.html";
      } else {
        window.location.href = "Home.html";
      }

    } catch (error) {
      console.error("Error during login:", error);
      alert("Server error. Please try again.");
    }
  });
});

// signup form submission
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const location = document.getElementById("location").value.trim();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, phone, location }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Account created successfully!");
      window.location.href = "index.html";

    } catch (error) {
      console.error("Signup error:", error);
      alert("Server error. Please try again.");
    }
  });
});


// Track Order Progress System
let currentStep = 0;
let orderTimer;
let selectedRating = 0;

document.addEventListener('DOMContentLoaded', function() {
    // ... الكود القديم بتاعك ...
    
    // Initialize order tracking if on track page
    if (document.getElementById('progressBar')) {
        initializeOrderTracking();
    }
    
    // Star Rating System
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            updateStarRating(selectedRating);
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            updateStarRating(rating);
        });
    });
    
    document.getElementById('starRating')?.addEventListener('mouseleave', function() {
        updateStarRating(selectedRating);
    });
});

function initializeOrderTracking() {
    // Start from order placed
    updateOrderStatus(0);
}

function updateOrderStatus(step) {
    const steps = document.querySelectorAll('.step');
    const deliveryTimeEl = document.getElementById('deliveryTime');
    
    steps.forEach((stepEl, index) => {
        stepEl.classList.remove('completed', 'current');
        
        if (index < step) {
            stepEl.classList.add('completed');
        } else if (index === step) {
            stepEl.classList.add('current');
        }
    });
    
    // Update delivery time based on step
    const deliveryTimes = [
        'Estimated Delivery: 30 minutes',
        'Estimated Delivery: 20 minutes',
        'Estimated Delivery: 10 minutes',
        'Delivered! 🎉'
    ];
    
    if (deliveryTimeEl) {
        deliveryTimeEl.textContent = deliveryTimes[step] || deliveryTimes[0];
    }
    
    currentStep = step;
    
    // Show review modal when delivered
    if (step === 3) {
        setTimeout(() => {
            showReviewModal();
        }, 1000);
    }
}

// Simulate order progress (for testing)
async function simulateOrderProgress() {
    const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
    if (!currentOrder) {
        alert('No active order to simulate.');
        return;
    }

    let step = 0;
    const statusMap = ['pending', 'preparing', 'ready', 'delivered'];

    clearInterval(orderTimer);

    orderTimer = setInterval(async () => {
        if (step <= 3) {
            try {
                // Update backend status
                await apiRequest(`/orders/simulate-status/${currentOrder.orderId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ status: statusMap[step] })
                });

                // Update localStorage currentOrder status
                currentOrder.status = step;
                localStorage.setItem('currentOrder', JSON.stringify(currentOrder));

                // Update order history in localStorage
                let orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
                const orderIndex = orderHistory.findIndex(order => order.orderId === currentOrder.orderId);
                if (orderIndex !== -1) {
                    orderHistory[orderIndex].status = step;
                    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
                }

                // Update frontend
                updateOrderStatus(step);
                step++;
            } catch (error) {
                console.error('Error updating order status:', error);
                alert('Error updating order status: ' + error.message);
                clearInterval(orderTimer);
            }
        } else {
            clearInterval(orderTimer);
        }
    }, 3000); // كل 3 ثواني ينتقل لخطوة جديدة
}

// Show Review Modal
function showReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.classList.add('show');
        selectedRating = 0;
        updateStarRating(0);
        document.getElementById('reviewText').value = '';
    }
}

// Update Star Rating Display
function updateStarRating(rating) {
    const stars = document.querySelectorAll('.star');
    const ratingText = document.getElementById('ratingText');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
    
    const ratingTexts = [
        'Select your rating',
        '⭐ Poor',
        '⭐⭐ Fair',
        '⭐⭐⭐ Good',
        '⭐⭐⭐⭐ Very Good',
        '⭐⭐⭐⭐⭐ Excellent!'
    ];
    
    if (ratingText) {
        ratingText.textContent = ratingTexts[rating];
    }
}

// Submit Review
function submitReview() {
    const reviewText = document.getElementById('reviewText').value;
    
    if (selectedRating === 0) {
        alert('⚠️ Please select a rating!');
        return;
    }
    
    // Save review to localStorage
    const review = {
        orderId: '12345',
        rating: selectedRating,
        comment: reviewText,
        date: new Date().toLocaleDateString()
    };
    
    // Get existing reviews or create new array
    let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    alert(`✅ Thank you for your ${selectedRating}-star review!`);
    closeReviewModal();
}

// Skip Review
function skipReview() {
    if (confirm('Are you sure you want to skip the review?')) {
        closeReviewModal();
    }
}

// Close Review Modal
function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.classList.remove('show');
    }
}


// Handle Checkout Form
document.addEventListener('DOMContentLoaded', function() {
    // ... الكود القديم ...

    const checkoutForm = document.getElementById('checkoutForm');

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const customerName = document.getElementById('customerName').value.trim();
            const customerEmail = document.getElementById('customerEmail').value.trim();
            const customerPhone = document.getElementById('customerPhone').value.trim();
            const streetAddress = document.getElementById('streetAddress').value.trim();
            const city = document.getElementById('city').value.trim();
            const postalCode = document.getElementById('postalCode').value.trim();
            const paymentMethod = document.querySelector('input[name="payment"]:checked');

            // Validate all fields
            if (!customerName || !customerEmail || !customerPhone || !streetAddress || !city || !postalCode) {
                alert('⚠️ Please fill in all fields!');
                return;
            }

            if (!paymentMethod) {
                alert('⚠️ Please select a payment method!');
                return;
            }

            // Get cart items
            const cartKey = getCartKey();
            const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
            if (cart.length === 0) {
                alert('⚠️ Your cart is empty!');
                return;
            }

            // Prepare order data for backend
            const orderData = {
                address: `${streetAddress}, ${city}, ${postalCode}`,
                payment_method: paymentMethod.value,
                items: cart.map(item => ({
                    food_id: item.id,
                    quantity: item.quantity
                })),
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };

            try {
                // Place order via API
                const orderResponse = await placeOrder(orderData);
                const orderId = orderResponse.orderId;

                // Generate order number for display
                const orderNumber = generateOrderNumber();

                // Create order object for localStorage
                const order = {
                    orderId: orderId,
                    orderNumber: orderNumber,
                    customerName: customerName,
                    customerEmail: customerEmail,
                    customerPhone: customerPhone,
                    address: {
                        street: streetAddress,
                        city: city,
                        postalCode: postalCode
                    },
                    paymentMethod: paymentMethod.value,
                    items: cart,
                    total: orderData.total,
                    status: 0, // 0: Order Placed, 1: Preparing, 2: Out for Delivery, 3: Delivered
                    orderDate: new Date().toISOString(),
                    estimatedDelivery: 30
                };

                // Save order to localStorage
                localStorage.setItem('currentOrder', JSON.stringify(order));

                // Add to order history
                let orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
                orderHistory.push(order);
                localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

                // Clear cart
                localStorage.removeItem('cart');
                updateCartCount();

                // Show confirmation modal
                showOrderConfirmation(orderNumber);
            } catch (error) {
                console.error('Error placing order:', error);
                alert('❌ Failed to place order. Please try again.');
            }
        });
    }
});

// Generate random order number
function generateOrderNumber() {
    return Math.floor(10000 + Math.random() * 90000);
}

// Show Order Confirmation Modal
function showOrderConfirmation(orderNumber) {
    const modal = document.getElementById('orderConfirmModal');
    const orderNumberEl = document.getElementById('orderNumber');
    
    if (modal && orderNumberEl) {
        orderNumberEl.textContent = orderNumber;
        modal.classList.add('show');
    }
}

// Go to Track Order Page
function goToTrackOrder() {
    window.location.href = 'trackMyOrder.html';
}


async function initializeOrderTracking() {
    // Load current order from localStorage
    const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));

    if (currentOrder) {
        // Update order display
        document.getElementById('orderNumberDisplay').textContent = `Order #${currentOrder.orderNumber}`;
        document.getElementById('deliveryTime').textContent = `Estimated Delivery: ${currentOrder.estimatedDelivery} minutes`;

        // Display items
        const itemsText = currentOrder.items.map(item =>
            `${item.name} x${item.quantity}`
        ).join(', ');
        document.getElementById('orderItems').textContent = `Items: ${itemsText}`;

        // Display address
        const addressEl = document.getElementById('deliveryAddress');
        if (addressEl) {
            addressEl.textContent = `Delivering to: ${currentOrder.address.street}, ${currentOrder.address.city}`;
        }

        // Fetch real-time order status from backend
        try {
            const statusResponse = await getOrderStatus(currentOrder.orderId);
            const statusMap = {
                'pending': 0,
                'confirmed': 0,
                'preparing': 1,
                'ready': 2,
                'delivered': 3,
                'cancelled': 3
            };
            const statusStep = statusMap[statusResponse.status] || 0;
            updateOrderStatus(statusStep);
        } catch (error) {
            console.error('Error fetching order status:', error);
            // Fallback to localStorage status
            updateOrderStatus(currentOrder.status);
        }
    } else {
        // No active order
        updateOrderStatus(0);
    }
}
