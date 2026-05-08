// ── NAVBAR MOBILE ─────────────────────────────────────
const navToggle = document.querySelector('.nav__toggle');
const navLinks  = document.querySelector('.nav__links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const icon = navToggle.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const icon = navToggle.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
  });
});

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

// ── STORAGE SEGURO (funciona con y sin Live Server) ───
let carrito   = [];
let favoritos = [];

try {
  carrito   = JSON.parse(localStorage.getItem('carrito'))   || [];
  favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
} catch(e) {
  carrito   = [];
  favoritos = [];
}

const guardarCarrito = () => {
  try { localStorage.setItem('carrito', JSON.stringify(carrito)); } catch(e) {}
};

const guardarFavoritos = () => {
  try { localStorage.setItem('favoritos', JSON.stringify(favoritos)); } catch(e) {}
};

// ── CARRITO ───────────────────────────────────────────
const cartCount = document.querySelector('.cart-count');

const actualizarContadorCarrito = () => {
  const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  cartCount.textContent = total;
  cartCount.classList.add('cart-bump');
  setTimeout(() => cartCount.classList.remove('cart-bump'), 300);
};

actualizarContadorCarrito();

document.querySelectorAll('.btn--small').forEach(btn => {
  btn.addEventListener('click', () => {
    const card   = btn.closest('.card');
    const titulo = card.querySelector('.card__title').textContent;
    const precio = card.querySelector('.card__price').textContent;
    const img    = card.querySelector('img').src;

    const existe = carrito.find(item => item.titulo === titulo);
    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({ titulo, precio, img, cantidad: 1 });
    }

    guardarCarrito();
    actualizarContadorCarrito();
    mostrarToast(`"${titulo}" agregado al carrito ✅`);
  });
});

// ── WISHLIST PANEL ────────────────────────────────────
const abrirWishlist = document.querySelector('.header__icons a[aria-label="Favoritos"]');
const wishlistPanel = document.createElement('div');
wishlistPanel.classList.add('wishlist-panel');
document.body.appendChild(wishlistPanel);

const renderWishlist = () => {
  wishlistPanel.innerHTML = `
    <div class="wishlist-panel__header">
      <h3>Mis favoritos</h3>
      <button class="wishlist-panel__close"><i class="fas fa-times"></i></button>
    </div>
    <div class="wishlist-panel__body">
      ${favoritos.length === 0
        ? '<p class="wishlist-panel__empty">No tenés favoritos todavía.</p>'
        : favoritos.map(f => `
            <div class="wishlist-item">
              <img src="${f.img}" alt="${f.titulo}">
              <div class="wishlist-item__info">
                <p class="wishlist-item__titulo">${f.titulo}</p>
                <p class="wishlist-item__precio">${f.precio}</p>
              </div>
              <button class="wishlist-item__remove" data-titulo="${f.titulo}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `).join('')
      }
    </div>
  `;

  wishlistPanel.querySelector('.wishlist-panel__close')
    .addEventListener('click', () => wishlistPanel.classList.remove('open'));

  wishlistPanel.querySelectorAll('.wishlist-item__remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const titulo = btn.dataset.titulo;
      favoritos = favoritos.filter(f => f.titulo !== titulo);
      guardarFavoritos();

      document.querySelectorAll('.card__wishlist').forEach(heart => {
        const cardTitulo = heart.closest('.card')
          .querySelector('.card__title').textContent;
        if (cardTitulo === titulo) heart.classList.remove('active');
      });

      renderWishlist();
      mostrarToast(`"${titulo}" eliminado de favoritos`);
    });
  });
};

if (abrirWishlist) {
  abrirWishlist.addEventListener('click', (e) => {
    e.preventDefault();
    renderWishlist();
    wishlistPanel.classList.toggle('open');
  });
}

document.addEventListener('click', (e) => {
  if (abrirWishlist &&
      !wishlistPanel.contains(e.target) &&
      !abrirWishlist.contains(e.target)) {
    wishlistPanel.classList.remove('open');
  }
});

document.querySelectorAll('.card__wishlist').forEach(btn => {
  const card   = btn.closest('.card');
  const titulo = card.querySelector('.card__title').textContent;
  const precio = card.querySelector('.card__price').textContent;
  const img    = card.querySelector('img').src;

  if (favoritos.find(f => f.titulo === titulo)) {
    btn.classList.add('active');
  }

  btn.addEventListener('click', () => {
    const existe = favoritos.find(f => f.titulo === titulo);
    if (existe) {
      favoritos = favoritos.filter(f => f.titulo !== titulo);
      btn.classList.remove('active');
      mostrarToast(`"${titulo}" eliminado de favoritos`);
    } else {
      favoritos.push({ titulo, precio, img });
      btn.classList.add('active');
      mostrarToast(`"${titulo}" agregado a favoritos ❤️`);
    }
    guardarFavoritos();
  });
});

// ── LOGIN MODAL ───────────────────────────────────────
const abrirLogin = document.querySelector('.header__icons a[aria-label="Mi cuenta"]');
const loginModal = document.createElement('div');
loginModal.classList.add('login-modal');
loginModal.innerHTML = `
  <div class="login-modal__box">
    <button class="login-modal__close"><i class="fas fa-times"></i></button>
    <h2>Mi cuenta</h2>
    <p>Ingresá tus datos para continuar</p>
    <form class="login-form" novalidate>
      <div class="form__group">
        <label for="login-email">E-mail <span>*</span></label>
        <input type="email" id="login-email" placeholder="tucorreo@ejemplo.com" required>
      </div>
      <div class="form__group">
        <label for="login-pass">Contraseña <span>*</span></label>
        <input type="password" id="login-pass" placeholder="••••••••" required minlength="6">
      </div>
      <button type="submit" class="btn btn--primary" style="width:100%">
        Ingresar <i class="fas fa-arrow-right"></i>
      </button>
    </form>
    <p class="login-modal__footer">
      ¿No tenés cuenta? <a>Registrate acá</a>
    </p>
  </div>
`;
document.body.appendChild(loginModal);

if (abrirLogin) {
  abrirLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.toggle('open');
  });
}

loginModal.querySelector('.login-modal__close').addEventListener('click', () => {
  loginModal.classList.remove('open');
});

loginModal.querySelector('.login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginModal.querySelector('#login-email').value;
  loginModal.classList.remove('open');
  mostrarToast(`Bienvenido, ${email} ✅`);
});

document.addEventListener('click', (e) => {
  if (abrirLogin &&
      !loginModal.contains(e.target) &&
      !abrirLogin.contains(e.target)) {
    loginModal.classList.remove('open');
  }
});

// ── TOAST ─────────────────────────────────────────────
const mostrarToast = (mensaje) => {
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
};