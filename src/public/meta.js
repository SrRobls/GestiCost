function openModalMeta() {
    const modal = document.getElementById('modal-meta');
    modal.classList.add('is-active');
}

// con esta función cerramos el modal para crear una transacción
function closeModalMeta() {
    const modal = document.getElementById('modal-meta');
    modal.classList.remove('is-active');
}