# WyvernStore

WyvernStore es una tienda online de mangas y cómics construida con HTML, CSS y JavaScript puro. Incluye un catálogo responsivo con tarjetas de producto y un carrito de compras que calcula el total en tiempo real.

## Inicio de sesión con Firebase
1. Crea un proyecto en Firebase y habilita **Authentication** (correo/contraseña y Google si lo deseas).
2. Copia tus credenciales en `auth.js` reemplazando `TU_API_KEY`, `TU_AUTH_DOMAIN`, `TU_PROJECT_ID` y `TU_APP_ID`.
3. Abre `index.html` y usa el botón **Iniciar sesión** para abrir el modal. Desde ahí puedes **crear cuenta** (correo/contraseña), iniciar con Google o cerrar sesión. Si no hay configuración válida, verás una advertencia en consola y un aviso dentro del modal.

## Cómo usar
1. Abre `index.html` en tu navegador preferido o levanta un servidor local (por ejemplo `python3 -m http.server 5500`).
2. Explora el catálogo y pulsa **Agregar** para enviar tomos al carrito.
3. Ajusta cantidades o elimina artículos desde el panel del carrito; el total se actualiza automáticamente.

La interfaz utiliza un estilo oscuro moderno inspirado en tiendas geek y se adapta tanto a escritorio como a móviles.
