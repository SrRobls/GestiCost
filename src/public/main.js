// aca abrimos el modal para crear una transacción
function openModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('is-active');
}

// con esta función cerramos el modal para crear una transacción
  function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('is-active');
}

// y aca con esta función cerramos el modal para editar una transacción
function closeModalEdit() {
    const modal = document.getElementById('modal-edit');
    modal.classList.remove('is-active');
}

// Función para abrir el modal de reporte
function openModalReport() {
  const modal = document.getElementById('reportModal');
  modal.classList.add('is-active');
  generarReporte();
}

// Función para cerrar el modal de reporte
function closeModalReport() {
  const modal = document.getElementById('reportModal');
  modal.classList.remove('is-active');
}
// la funcion de abrir modal-edit esta en trasacciones.js que ese mismo tambine hace la peticion

const cerrarSesion = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('idToken');
    window.location.href = '/';
}

// Hace para que no se vean las secciones y el boton de cerrar sesón si no hay un usuario logueado


// Ahora, vamos a agregar una función para verificar la validez del token mientras navega en la app.
const checkTokenValidity = () => {
  const idToken = localStorage.getItem('idToken');
  fetch('/api/checkTokenValidity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  })
    .then(response => response.json())
    .then(data => {
      // Si el token no es válido, eliminamos el token y redirigimos al usuario a la página
      if (!data.valid) {
        localStorage.removeItem('idToken');
        localStorage.removeItem('name');
        if (window.location.pathname !== '/') {
          alert('Tu sesión ha expirado o tiene problemas. Por favor, inicia sesión de nuevo.');
          window.location.href = '/';
        }
      }
    })
    .catch(error => {
      console.error('Error checking token validity:', error);
    });
};

checkTokenValidity();