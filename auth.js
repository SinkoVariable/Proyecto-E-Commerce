import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_AUTH_DOMAIN',
  projectId: 'TU_PROJECT_ID',
  appId: 'TU_APP_ID'
};

function getElements() {
  return {
    loginModal: document.getElementById('login-modal'),
    loginTrigger: document.getElementById('login-trigger'),
    loginClose: document.getElementById('login-close'),
    loginForm: document.getElementById('login-form'),
    loginGoogle: document.getElementById('login-google'),
    signupBtn: document.getElementById('signup'),
    status: document.getElementById('login-status'),
    userBadge: document.getElementById('user-badge'),
    userName: document.getElementById('user-name'),
    logoutBtn: document.getElementById('logout')
  };
}

function toggleModal(modal, open) {
  if (!modal) return;
  modal.setAttribute('aria-hidden', String(!open));
  modal.classList.toggle('is-open', open);
}

function setStatus(statusEl, message, type = 'info') {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.dataset.type = type;
}

function attachAuthUI(auth) {
  const {
    loginModal,
    loginTrigger,
    loginClose,
    loginForm,
    loginGoogle,
    signupBtn,
    status,
    userBadge,
    userName,
    logoutBtn
  } = getElements();

  loginTrigger?.addEventListener('click', () => toggleModal(loginModal, true));
  loginClose?.addEventListener('click', () => toggleModal(loginModal, false));
  loginModal?.addEventListener('click', (event) => {
    if (event.target === loginModal) toggleModal(loginModal, false);
  });

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      setStatus(status, 'Completa correo y contraseña.', 'error');
      return;
    }

    try {
      setStatus(status, 'Ingresando...', 'info');
      await signInWithEmailAndPassword(auth, email, password);
      setStatus(status, 'Sesión iniciada.', 'success');
      toggleModal(loginModal, false);
    } catch (error) {
      setStatus(status, 'No se pudo iniciar sesión. Revisa tus credenciales.', 'error');
      console.error('Firebase login error', error);
    }
  });

  loginGoogle?.addEventListener('click', async () => {
    try {
      setStatus(status, 'Abriendo Google...', 'info');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setStatus(status, 'Sesión iniciada.', 'success');
      toggleModal(loginModal, false);
    } catch (error) {
      setStatus(status, 'No se pudo usar Google. Verifica la configuración.', 'error');
      console.error('Google login error', error);
    }
  });

  signupBtn?.addEventListener('click', async () => {
    if (!loginForm) return;
    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      setStatus(status, 'Completa correo y contraseña para crear tu cuenta.', 'error');
      return;
    }

    try {
      setStatus(status, 'Creando cuenta...', 'info');
      await createUserWithEmailAndPassword(auth, email, password);
      setStatus(status, 'Cuenta creada e iniciada.', 'success');
      toggleModal(loginModal, false);
    } catch (error) {
      setStatus(status, 'No se pudo crear la cuenta. Revisa correo y contraseña.', 'error');
      console.error('Signup error', error);
    }
  });

  logoutBtn?.addEventListener('click', async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error', error);
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const displayName = user.displayName || user.email || 'Usuario';
      userBadge?.removeAttribute('hidden');
      if (userName) userName.textContent = displayName;
    } else {
      userBadge?.setAttribute('hidden', '');
    }
  });
}

function initFirebaseAuth() {
  const elements = getElements();
  const missingConfig = Object.values(firebaseConfig).some((value) => !value || value.includes('TU_'));

  if (missingConfig) {
    console.warn('Configura tus claves de Firebase en auth.js para habilitar el login.');
    elements.loginTrigger?.addEventListener('click', () => {
      toggleModal(elements.loginModal, true);
      setStatus(elements.status, 'Agrega tus claves de Firebase en auth.js para activar el login.', 'error');
    });
    elements.signupBtn?.addEventListener('click', () => {
      setStatus(elements.status, 'Agrega tus claves de Firebase en auth.js para crear cuentas.', 'error');
    });
    elements.loginClose?.addEventListener('click', () => toggleModal(elements.loginModal, false));
    elements.loginModal?.addEventListener('click', (event) => {
      if (event.target === elements.loginModal) toggleModal(elements.loginModal, false);
    });
    return;
  }

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  attachAuthUI(auth);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFirebaseAuth);
} else {
  initFirebaseAuth();
}
