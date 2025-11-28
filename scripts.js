const products = [
  {
    id: 'mha-01',
    title: 'My Hero Academia Vol. 1',
    price: 12.99,
    tag: 'Shonen',
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jujutsu-03',
    title: 'Jujutsu Kaisen Vol. 3',
    price: 14.5,
    tag: 'Acción',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'chainsaw-02',
    title: 'Chainsaw Man Vol. 2',
    price: 13.25,
    tag: 'Demonios',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'onepiece-99',
    title: 'One Piece Vol. 99',
    price: 15.99,
    tag: 'Aventura',
    image: 'https://images.unsplash.com/photo-1582719478219-2f6c3801d9f1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'batman-001',
    title: 'Batman: Año Uno',
    price: 16.75,
    tag: 'DC',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spider-verse',
    title: 'Spider-Man: Into the Spider-Verse',
    price: 18.4,
    tag: 'Marvel',
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80'
  }
];

const cartState = new Map();

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function renderProducts(grid) {
  if (!grid) return;

  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card__cover">
        <img src="${product.image}" alt="${product.title}">
        <span class="card__tag">${product.tag}</span>
      </div>
      <h3 class="card__title">${product.title}</h3>
      <div class="card__meta">
        <span class="price">${formatPrice(product.price)}</span>
        <span class="caption">En stock</span>
      </div>
      <div class="actions">
        <button class="pill pill--ghost" data-id="${product.id}" aria-label="Ver detalles de ${product.title}">Detalles</button>
        <button class="pill pill--primary" data-add="${product.id}" aria-label="Agregar ${product.title} al carrito">Agregar</button>
      </div>
    `;

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

function renderCart(cartItems, cartTotal) {
  if (!cartItems || !cartTotal) return;

  cartItems.innerHTML = '';

  if (cartState.size === 0) {
    cartItems.innerHTML = '<p class="empty">Tu carrito está vacío. Agrega un tomo para comenzar.</p>';
    cartTotal.textContent = '$0.00';
    return;
  }

  let total = 0;
  const fragment = document.createDocumentFragment();

  cartState.forEach((item) => {
    total += item.price * item.quantity;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${item.image}" alt="${item.title}" width="64" height="64">
      <div>
        <p class="cart-item__title">${item.title}</p>
        <p class="cart-item__meta">${formatPrice(item.price)} · ${item.tag}</p>
        <div class="quantity" aria-label="Cantidad de ${item.title}">
          <button data-dec="${item.id}" aria-label="Disminuir cantidad">−</button>
          <span>${item.quantity}</span>
          <button data-inc="${item.id}" aria-label="Aumentar cantidad">+</button>
        </div>
      </div>
      <button class="icon-button" data-remove="${item.id}" aria-label="Quitar ${item.title} del carrito">🗑</button>
    `;

    fragment.appendChild(row);
  });

  cartItems.appendChild(fragment);
  cartTotal.textContent = formatPrice(total);
}

function addToCart(productId, cartItems, cartTotal, cart) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cartState.get(productId) || { ...product, quantity: 0 };
  existing.quantity += 1;
  cartState.set(productId, existing);
  renderCart(cartItems, cartTotal);
  if (cart) {
    openCart(cart);
  }
}

function updateQuantity(productId, delta, cartItems, cartTotal) {
  const item = cartState.get(productId);
  if (!item) return;

  const newQty = item.quantity + delta;
  if (newQty <= 0) {
    cartState.delete(productId);
  } else {
    cartState.set(productId, { ...item, quantity: newQty });
  }
  renderCart(cartItems, cartTotal);
}

function removeFromCart(productId, cartItems, cartTotal) {
  cartState.delete(productId);
  renderCart(cartItems, cartTotal);
}

function clearCart(cartItems, cartTotal) {
  cartState.clear();
  renderCart(cartItems, cartTotal);
}

function openCart(cart) {
  cart?.classList.add('is-open');
}

function closeCart(cart) {
  cart?.classList.remove('is-open');
}

function handleCatalogClick(event, cartItems, cartTotal, cart) {
  const addId = event.target.getAttribute('data-add');
  if (addId) {
    addToCart(addId, cartItems, cartTotal, cart);
  }
}

function handleCartClick(event, cartItems, cartTotal) {
  const decId = event.target.getAttribute('data-dec');
  const incId = event.target.getAttribute('data-inc');
  const removeId = event.target.getAttribute('data-remove');

  if (decId) updateQuantity(decId, -1, cartItems, cartTotal);
  if (incId) updateQuantity(incId, 1, cartItems, cartTotal);
  if (removeId) removeFromCart(removeId, cartItems, cartTotal);
}

function initWyvernStore() {
  const productGrid = document.getElementById('product-grid');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const clearCartBtn = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout');
  const cartToggle = document.getElementById('cart-toggle');
  const cart = document.getElementById('cart');
  const closeCartBtn = document.getElementById('close-cart');

  if (!productGrid || !cartItems || !cartTotal) {
    console.warn('WyvernStore: No se encontró el layout esperado en el DOM.');
    return;
  }

  renderProducts(productGrid);
  renderCart(cartItems, cartTotal);

  productGrid.addEventListener('click', (event) => handleCatalogClick(event, cartItems, cartTotal, cart));
  cartItems.addEventListener('click', (event) => handleCartClick(event, cartItems, cartTotal));
  clearCartBtn?.addEventListener('click', () => clearCart(cartItems, cartTotal));
  checkoutBtn?.addEventListener('click', () => alert('Ajusta tus datos de envío para completar la compra.'));

  cartToggle?.addEventListener('click', () => {
    cart?.classList.toggle('is-open');
  });

  closeCartBtn?.addEventListener('click', () => closeCart(cart));
}

document.addEventListener('DOMContentLoaded', initWyvernStore);
