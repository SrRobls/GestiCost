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

// la funcion de abrir modal-edit esta en trasacciones.js que ese mismo tambine hace la peticion

