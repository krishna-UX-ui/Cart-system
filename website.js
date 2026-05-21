function addToCart(id) {
  flyItemToCart(id);       // arc animation
  setTimeout(() => {
    cart[id] = cart[id] || { ...product, qty: 0 };
    cart[id].qty++;
    renderCart();
    bounceCart();           // icon bounce + badge pop
  }, 420);
}

function flyItemToCart(id) {
  const src  = document.getElementById('product-' + id);
  const dest = document.getElementById('cart-svg');
  const s = src.getBoundingClientRect();
  const d = dest.getBoundingClientRect();

  const el = document.createElement('div');
  el.className = 'fly-item';
  el.textContent = emoji;
  el.style.left = s.left + 'px';
  el.style.top  = s.top  + 'px';
  document.body.appendChild(el);

  const dx = d.left - s.left;
  const dy = d.top  - s.top;

  el.animate([
    { transform: 'translate(0,0) scale(1)', opacity: 1 },
    { transform: `translate(${dx}px,${dy}px) scale(0.2)`, opacity: 0 }
  ], { duration: 420, easing: 'ease-in', fill: 'forwards' })
    .onfinish = () => el.remove();
}

function bounceCart() {
  const svg = document.getElementById('cart-svg');
  svg.classList.remove('bounce');
  void svg.offsetWidth; // force reflow to restart animation
  svg.classList.add('bounce');
}
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cartIcon').addEventListener('click', toggleCart);
    document.querySelector('.close-cart').addEventListener('click', toggleCart);
    document.getElementById('overlay').addEventListener('click', closeAllModals);
    document.querySelector('.checkout-btn').addEventListener('click', checkout);
    document.querySelector('.close-modal').addEventListener('click', closeAllModals);
    
    addProductListeners();
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });
});

function addProductListeners() {
    document.querySelectorAll('.product-card img').forEach(img => {
        img.addEventListener('click', openImageModal);
    });
    
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
}

function addToCart(e) {
    const btn = e.target.closest('.add-btn');
    const productCard = btn.closest('.product-card');
    
    const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        image: productCard.querySelector('img').src,
        quantity: 1
    };
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(product);
    }
    
    updateCartUI();
    showNotification(`✅ Added "${product.name}" to cart!`);
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('cartCount').textContent = totalItems;
    document.getElementById('cartTotal').textContent = `₹${totalPrice.toFixed(2)}`;
    renderCartItems();
}

function renderCartItems() {
    const container = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">🛒 Your cart is empty</p>';
        return;
    }
    
    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price.toFixed(2)} × ${item.quantity}</p>
            </div>
            <button class="remove-item" data-index="${index}">🗑️</button>
        </div>
    `).join('');
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeFromCart);
    });
}

function removeFromCart(e) {
    const index = parseInt(e.target.dataset.index);
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

function openImageModal(e) {
    document.getElementById('modalImage').src = e.target.dataset.full;
    document.getElementById('imageModal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeAllModals() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('imageModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function checkout() {
    if (cart.length === 0) {
        alert('🛒 Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`🎉 Order Successful!\nTotal: ₹${total.toFixed(2)}\nThank you!`);
    
    cart = [];
    updateCartUI();
    closeAllModals();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.remove();
    }, 2500);
}