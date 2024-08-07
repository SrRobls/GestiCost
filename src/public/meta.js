function openModalMeta() {
  const modal = document.getElementById("modal-meta");
  modal.classList.add("is-active");
}

// con esta función cerramos el modal para crear una transacción
function closeModalMeta() {
  const modal = document.getElementById("modal-meta");
  modal.classList.remove("is-active");
}

// Petición para crear una Meta
document.getElementById("crear-meta-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.target;

  // DESCOMENTAR CUANDO VALIDAR META ESTE HECHA
  // if (!validarTransaccion(form)) {
  //   return;
  // }

  const meta = {
    nombre: form.nombre_meta.value,
    objetivo: form.total_meta.value,
    monto: form.monto_meta.value,
  };

  const idToken = localStorage.getItem("idToken");

  if (!idToken) {
    console.error("No se encontró el token de ID");
    return;
  }

  try {
    const [metaResponse, transaccionResponse] = await Promise.all([
      fetch("/api/crear-meta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(meta),
      }),
      fetch("/api/crear-transaccion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          nombre: 'Ahorro de: ' + form.nombre_meta.value,
          costo: form.monto_meta.value,
          metodo_pago: "Para Mis Ahorros",
          categoria: "Meta",
          descripcion: "",
        }),
      }),
    ]);

    if (metaResponse.ok && transaccionResponse.ok) {
      console.log("Transacción de meta creada exitosamente");
      window.location.href = "/metas";
    } else {
      console.error(
        "Error al crear la transacción:",
        metaResponse.statusText,
        transaccionResponse.statusText
      );
    }
  } catch (error) {
    console.error("Error al crear la transacción:", error);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  // Obtener idToken del localStorage
  const idToken = await localStorage.getItem("idToken");

  // Obtener y mostrar transacciones
  if (idToken) {
    try {
      const response = await fetch("/api/metas", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await response.json();
      const metasDiv = document.getElementById("metas");

      if (data && Object.keys(data).length > 0) {
        let metasHtml = ``;
        for (const [key, meta] of Object.entries(data)) {
          metasHtml += `
                      <div>
                        <strong>${meta.nombre}</strong><br>
                        <strong>Objetivo a ahorrar: </strong><span>${meta.objetivo}</span><br>
                        <strong>Monto actual: </strong><span>${meta.monto}</span><br>
                        <div>
                          <button onClick="eliminar_meta('${key}')" class="button is-danger">Eliminar</button>
                          <button
                            onclick="openModalMetaEdit('${key}', '${meta.nombre}', '${meta.objetivo}', '${meta.monto}');"
                            class="button is-primary">Agregar Monto</button>
                        </div>
                      </div>
                    `;
        }

        metasDiv.innerHTML = metasHtml;
      } else {
        metasDiv.innerHTML = "<p>No hay metas ¡Crea una!</p>";
      }
    } catch (error) {
      console.error("Error al obtener las metas:", error);
    }

  } else {
    console.error("No se encontró el token de ID");
  }


});

// Petición para editar una meta
function openModalMetaEdit(id, nombre, objetivo, monto) {
  const modal = document.getElementById("modal-meta-edit");
  document.getElementById("nombre-meta-edit").value = nombre;
  document.getElementById("objetivo-meta-edit").value = objetivo;
  document.getElementById("monto-meta-edit").value = monto;
  modal.classList.add("is-active");

  const form = document.getElementById("form-edit-meta");
  form.onsubmit = async (e) => {
    e.preventDefault();

    // DESCOMENTAR CUANDO VALIDAR EDICION DE META ESTE HECHA
    // if (!validarMetaEdicion(form)) {
    //   return;
    // }

    const idToken = await localStorage.getItem("idToken");
    if (!idToken) {
      console.error("No se encontró el token de ID");
      return;
    }

    const data = {
      abono: document.getElementById("abono-meta-edit").value,
    };

    try {
      const response = await fetch("/api/editar-meta/" + id, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Petición para crear una transacción con el valor del abono
        try {
          const transaccionResponse = await fetch("/api/crear-transaccion", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              nombre: 'Ahorro de: ' + nombre,
              costo: data.abono,
              metodo_pago: "Para Mis Ahorros",
              categoria: "Meta",
              descripcion: "",
            }),
          });

          if (transaccionResponse.ok) {
            console.log("Transacción de meta creada exitosamente");
            window.location.href = "/metas";
          } else {
            console.error("Error al crear la transacción:", transaccionResponse.statusText);
          }
        } catch (error) {
          console.error("Error al crear la transacción:", error);
        }
      } else {
        console.error("Error al editar la transacción");
      }
    } catch (error) {
      console.error("Error al editar la transacción:", error);
    }
  };
}

// Petición para eliminar una transacción
async function eliminar_meta(id) {
  const idToken = await localStorage.getItem('idToken');
  if (!idToken) {
      console.error('No se encontró el token de ID');
      return;
  }
  try {
      const response = await fetch('/api/eliminar-meta/' + id, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${idToken}`
          }
      });

      if (response.ok) {
          window.location.href = '/metas';
      } else {
          console.error('Error al eliminar la metas');
      }
  } catch (error) {
      console.error('Error al eliminar la metas:', error);
  }
}

function closeModalMetaEdit() {
    const modal = document.getElementById('modal-meta-edit');
    modal.classList.remove('is-active');
}


// MODIFICAR Y DESCOMENTAR
// function validarMeta(form) {
//   const nombreInput = form.nombre.value.trim();
//   const costoInput = form.costo.value;
//   const descripcionInput = form.descripcion.value;
//   const longitudMaxima = 70; // Define la longitud máxima permitida para la descripción

//   // Validación del nombre
//   if (nombreInput === '') {
//       alert('El nombre es obligatorio.');
//       return false;
//   }

//   // Validación del costo
//   if (isNaN(costoInput) || costoInput.trim() === '' || parseFloat(costoInput) <= 0) {
//       alert('El costo debe ser un número positivo.');
//       return false;
//   }

//   // Validación de la longitud de la descripción
//   if (descripcionInput.length > longitudMaxima) {
//       alert(`La descripción no debe exceder los ${longitudMaxima} caracteres.`);
//       return false;
//   }

//   // Truncar la descripción si es más larga de 20 caracteres
//   if (descripcionInput.length > 20) {
//       form.descripcion.value = descripcionInput.substring(0, 20) + '...';
//   }

//   return true;
// }