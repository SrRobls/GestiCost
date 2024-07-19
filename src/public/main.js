function openModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('is-active');
}
  function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('is-active');
}

function openModalEdit(id, nombre, costo, metodo, categoria, descripcion) {
    // alert(categoria);
    
    const modal = document.getElementById('modal-edit');
    document.getElementById('nombre-trans-edit').value = nombre;
    document.getElementById('costo-trans-edit').value = costo;
    document.getElementById('metodo-pago-edit').value = metodo;
    document.getElementById('categoria-trans-edit').value = categoria;
    document.getElementById('descripcion-trans-edit').value = descripcion;
    modal.classList.add('is-active');
    form = document.getElementById('form-edit').action = '/editar-transaccion/' + id;
}
  function closeModalEdit() {
    const modal = document.getElementById('modal-edit');
    modal.classList.remove('is-active');
}


