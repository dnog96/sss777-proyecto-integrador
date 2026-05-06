const navToggle = document.querySelector('.nav__toggle');
const navLinks  = document.querySelector('.nav__links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');

  // Cambia el ícono según el estado
  const icon = navToggle.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
});

// Cierra el menú al hacer click en un link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const icon = navToggle.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
  });
});

// Cierra el menú al hacer click fuera
document.addEventListener('click', (event) => {
  const clickDentroNav = navToggle.contains(event.target) ||
                         navLinks.contains(event.target);
  if (!clickDentroNav) {
    navLinks.classList.remove('open');
    const icon = navToggle.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
  }
});

// ── CARRITO ───────────────────────────────────────────
let cantidadCarrito = 0;
const cartCount = document.querySelector('.cart-count');

const botonesAgregar = document.querySelectorAll('.btn--small');

botonesAgregar.forEach(btn => {
  btn.addEventListener('click', () => {
    cantidadCarrito++;
    cartCount.textContent = cantidadCarrito;

    // Animación del ícono del carrito
    cartCount.classList.add('cart-bump');
    setTimeout(() => cartCount.classList.remove('cart-bump'), 300);
  });
});

// ── WISHLIST ──────────────────────────────────────────
const botonesWishlist = document.querySelectorAll('.card__wishlist');

botonesWishlist.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
  });
});