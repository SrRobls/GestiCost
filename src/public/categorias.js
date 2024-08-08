
let lasSelectedItem;
function selectOption(event) {
  event.preventDefault(); // Previene el comportamiento por defecto del enlace

  // remover la clase is-active de la ultima categoria seleccionada 
  if(lasSelectedItem) {
    lasSelectedItem.classList.remove('is-active');
  }

  // Obtén el elemento en el que se hizo clic
  const selectedItem = event.currentTarget;

  // Actualiza el contenido del botón con el texto de la opción seleccionada
  const selectedText = selectedItem.textContent.trim();
  document.getElementById('dropdown-text').textContent = selectedText;
  document.getElementById('categoria-seleccionada').value = selectedText;

  // Obtén el valor de la opción seleccionada
  const selectedValue = selectedItem.getAttribute('data-value');

  // Muestra el valor en la consola (o haz lo que necesites con él)
  console.log('Opción seleccionada:', selectedValue);

  // Opcional: Cierra el dropdown después de seleccionar una opción
  const dropdown = document.querySelector('.dropdown');
  if (dropdown.classList.contains('is-active')) {
    dropdown.classList.remove('is-active');
  }


  // Añade la clase 'is-active' a la opción seleccionada
  selectedItem.classList.add('is-active');
  lasSelectedItem = selectedItem
}

// inserta las categorias al dropdown
function cargarCategoriasDropdown(data) {
  const dropdownDivOptions = document.getElementById('container-options');
  let optionsDropdown = ''
  for (const [key, categoria] of Object.entries(data)) {
    optionsDropdown += `
    <div style="display: flex;">

      <a href="#" class="dropdown-item" style="width: 90%; display: flex;" data-value="${categoria.nombre}" onclick="selectOption(event)"> 
        ${categoria.nombre} 
      </a>
      <a class="dropdown-item" style="width: 5%; display: flex;" onclick="openModalEditCategoria('${key}', '${categoria.nombre}');">
        <i class="fa-solid fa-pen-to-square"></i>
      </a>
    </div>
    `
  }

  // insertar options al dropdown
  dropdownDivOptions.innerHTML = optionsDropdown;
}

async function obtenerCategorias() {
  const idToken = localStorage.getItem('idToken');
  try {
    const response = await fetch('/api/categorias', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${idToken}`
        }
    });
    // Verifica que la respuesta sea exitosa
    if (!response.ok) {
      // Maneja errores de estado HTTP no exitosos
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if(data == null){
      console.log('No se encontraron Categorias')
      return false;
    } else {
      return data;
    }
  } catch (error) {
    console.error(`Ocurrió un error al obtener las categorias: ${error}`)
    return false;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Obtén el elemento del dropdown
  const dropdown = document.querySelector('.dropdown');
  const trigger = dropdown.querySelector('.dropdown-trigger');
  const icon = document.getElementById('dropdown-icon');
  const dropdownButton = document.getElementById('.dropdown-button');

  // Maneja el clic en el botón
  trigger.addEventListener('click', () => {
    // Alterna la clase 'is-active' en el dropdown
    dropdown.classList.toggle('is-active');

    dropdownButton.classList.toggle('is-focused');
    // Cambia el ícono según el estado del dropdown
    if (dropdown.classList.contains('is-active')) {
      icon.classList.remove('fa-angle-right');
      icon.classList.add('fa-angle-down');
    } else {
      icon.classList.remove('fa-angle-down');
      icon.classList.add('fa-angle-right');
    }
  });

  // Cierra el dropdown si se hace clic fuera de él
  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target) && dropdown.classList.contains('is-active')) {
      dropdown.classList.remove('is-active');
    }
  });

  const data = await obtenerCategorias();
  if(data) {
    cargarCategoriasDropdown(data);
  }
});



// aca abrimos el modal para crear una categoria
function toggleModalCrearCategoria() {
  const modal = document.getElementById('modal-crear-categoria');
  modal.classList.toggle('is-active');

  // focused input
  const inputNombreCategoria = document.getElementById('nombre-categoria');
  inputNombreCategoria.focus()
}


// Petición para crear una categoira
document.getElementById('crear-categoria-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.target;

  const nombreInput = form.nombre.value.trim();
  if(nombreInput == '') {
      alert('El nombre de la categoria es obligatorio.');
      return;
  }

  const categoria = {
      nombre: form.nombre.value
  };

  const idToken = localStorage.getItem('idToken');

  if (!idToken) {
      console.error('No se encontró el token de ID');
      return;
  }

  try {
      const response = await fetch('/api/crear-categoria', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify(categoria)
      });

      // Verifica que la respuesta sea exitosa
      if (response.ok) {
        const data = await obtenerCategorias();
        if(data) {
          cargarCategoriasDropdown(data);
        }
      } else {
        // Leer el mensaje de error en caso de estado HTTP no exitoso
        const errorMessage = await response.text();  // Usa response.json() si el servidor devuelve JSON
        throw new Error(`${response.status} ${response.statusText}: ${errorMessage}`);
      }
  } catch (error) {
      alert(error)
      console.error('Error al crear la categoria:', error);
  }
});


// Petición para eliminar una categoria
async function eliminarCategoria(id) {
  const idToken = localStorage.getItem('idToken');
  if (!idToken) {
      console.error('No se encontró el token de ID');
      return;
  }
  try {
      const response = await fetch('/api/eliminar-categoria/' + id, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${idToken}`
          }
      });

      if (response.ok) {
        const data = await obtenerCategorias();
        if(data) {
          cargarCategoriasDropdown(data);
        }
      } else {
          // Maneja errores de estado HTTP no exitosos
          throw new Error(`${response.status} ${response.statusText}`);
      }
  } catch (error) {
      console.error('Error al eliminar la categoria:', error);
  }
}


// Petición para editar una categoria
function openModalEditCategoria(id, nombre) {
  const modal = document.getElementById('modal-edit-categoria');
  modal.classList.add('is-active');
  
  // focus input
  const inputNombreCategoria = document.getElementById('nombre-categoria-edit');
  inputNombreCategoria.focus()
  // assign value to input
  inputNombreCategoria.value = nombre

  // const form = modal.getElementById('form-edit');
  const form = document.getElementById('form-edit-categoria');
  form.onsubmit = async (e) => {
      e.preventDefault();
    
      const nombreInput = form.nombre.value.trim();
      if(nombreInput == '') {
          alert('El nombre de la categoria es obligatorio.');
          return;
      }

      const idToken = localStorage.getItem('idToken');
      if (!idToken) {
          console.error('No se encontró el token de ID');
          return;
      }

      const data = {
          nombre: document.getElementById('nombre-categoria-edit').value,
      };

      try {
          const response = await fetch('/api/editar-categoria/' + id, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${idToken}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          });

          if (response.ok) {
            const data = await obtenerCategorias();
            if(data) {
              cargarCategoriasDropdown(data);
            }
            closeModalEditCategoria();
          } else {
            // Maneja errores de estado HTTP no exitosos
            throw new Error(`${response.status} ${response.statusText}`);
        }
      } catch (error) {
          console.error('Error al editar la categoria:', error);
      }
  };
}



// y aca con esta función cerramos el modal para editar una categoria
function closeModalEditCategoria() {
  const modal = document.getElementById('modal-edit-categoria');
  modal.classList.remove('is-active');
}