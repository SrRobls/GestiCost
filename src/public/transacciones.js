// Validación de formularios
function validarTransaccion(form) {
  const costoInput = form.costo.value;
  const descripcionInput = form.descripcion.value;
  const longitudMaxima = 70; // Define la longitud máxima permitida para la descripción

  // Validación del costo
  if (isNaN(costoInput) || costoInput.trim() === '' || parseFloat(costoInput) <= 0) {
      alert('El costo debe ser un número positivo.');
      return false;
  }

  // Validación de la longitud de la descripción
  if (descripcionInput.length > longitudMaxima) {
      alert(`La descripción no debe exceder los ${longitudMaxima} caracteres.`);
      return false;
  }

  // Truncar la descripción si es más larga de 20 caracteres
  if (descripcionInput.length > 20) {
      form.descripcion.value = descripcionInput.substring(0, 20) + '...';
  }

  return true;
}

document.addEventListener('DOMContentLoaded', async () => {
  // Obtener idToken del localStorage
  const idToken = await localStorage.getItem('idToken');

  // Obtener y mostrar transacciones
  if (idToken) {
      try {
          const response = await fetch('/api/transacciones', {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${idToken}`
              }
          });

          const data = await response.json();
          const transaccionesDiv = document.getElementById('transacciones');

          if (data && Object.keys(data).length > 0) {
              let tableHTML = `
                  <table class="table is-fullwidth">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Costo</th>
                        <th>Método de Pago</th>
                        <th>Categoría</th>
                        <th>Descripción</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                `;

              for (const [key, transaccion] of Object.entries(data)) {
                  tableHTML += `
                    <tr>
                      <td>${transaccion.nombre}</td>
                      <td>${transaccion.costo}</td>
                      <td>${transaccion.metodo}</td>
                      <td>${transaccion.categoria}</td>
                      <td>${transaccion.descripcion}</td>
                      <td>
                        <button onClick="eliminar('${key}')" class="button is-danger">Eliminar</button>
                        <button
                          onclick="openModalEdit('${key}', '${transaccion.nombre}', '${transaccion.costo}', '${transaccion.metodo}', '${transaccion.categoria}', '${transaccion.descripcion}');"
                          class="button is-primary">Editar</button>
                      </td>
                    </tr>
                  `;
              }

              tableHTML += `
                    </tbody>
                  </table>
                `;

              transaccionesDiv.innerHTML = tableHTML;
          } else {
              transaccionesDiv.innerHTML = '<p>No hay transacciones ¡Crea una!</p>';
          }
      } catch (error) {
          console.error('Error al obtener las transacciones:', error);
      }
  } else {
      console.error('No se encontró el token de ID');
  }
});

// Petición para crear una transacción
document.getElementById('crear-transaccion-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.target;

  if (!validarTransaccion(form)) {
      return;
  }

  const transaccion = {
      nombre: form.nombre.value,
      costo: form.costo.value,
      metodo_pago: form.metodo_pago.value,
      categoria: form.categoria.value,
      descripcion: form.descripcion.value
  };

  const idToken = localStorage.getItem('idToken');

  if (!idToken) {
      console.error('No se encontró el token de ID');
      return;
  }

  try {
      const response = await fetch('/api/crear-transaccion', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify(transaccion)
      });

      if (response.ok) {
          window.location.href = '/transacciones';
      } else {
          console.error('Error al crear la transacción:', response.statusText);
      }
  } catch (error) {
      console.error('Error al crear la transacción:', error);
  }
});

// Petición para editar una transacción
function openModalEdit(id, nombre, costo, metodo, categoria, descripcion) {
  const modal = document.getElementById('modal-edit');
  document.getElementById('nombre-trans-edit').value = nombre;
  document.getElementById('costo-trans-edit').value = costo;
  document.getElementById('metodo-pago-edit').value = metodo;
  document.getElementById('categoria-trans-edit').value = categoria;
  document.getElementById('descripcion-trans-edit').value = descripcion;
  modal.classList.add('is-active');

  const form = document.getElementById('form-edit');
  form.onsubmit = async (e) => {
      e.preventDefault();
      
      if (!validarTransaccion(form)) {
          return;
      }

      const idToken = await localStorage.getItem('idToken');
      if (!idToken) {
          console.error('No se encontró el token de ID');
          return;
      }

      const data = {
          nombre: document.getElementById('nombre-trans-edit').value,
          costo: document.getElementById('costo-trans-edit').value,
          metodo_pago: document.getElementById('metodo-pago-edit').value,
          categoria: document.getElementById('categoria-trans-edit').value,
          descripcion: document.getElementById('descripcion-trans-edit').value
      };

      try {
          const response = await fetch('/api/editar-transaccion/' + id, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${idToken}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          });

          if (response.ok) {
              window.location.href = '/transacciones';
          } else {
              console.error('Error al editar la transacción');
          }
      } catch (error) {
          console.error('Error al editar la transacción:', error);
      }
  };
}

// Petición para eliminar una transacción
async function eliminar(id) {
  const idToken = await localStorage.getItem('idToken');
  if (!idToken) {
      console.error('No se encontró el token de ID');
      return;
  }
  try {
      const response = await fetch('/api/eliminar-transaccion/' + id, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${idToken}`
          }
      });

      if (response.ok) {
          window.location.href = '/transacciones';
      } else {
          console.error('Error al eliminar la transacción');
      }
  } catch (error) {
      console.error('Error al eliminar la transacción:', error);
  }
}
