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
document
  .getElementById("crear-meta-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;

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
      const response = await fetch("/api/crear-meta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(meta),
      });

      if (response.ok) {
        window.location.href = "/metas";
      } else {
        console.error("Error al crear la transacción:", response.statusText);
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
                          <button onClick="eliminar('${key}')" class="button is-danger">Eliminar</button>
                          <button
                            onclick="openModalMetaEdit('${key}', '${meta.nombre}', '${meta.objetivo}', '${meta.monto}');"
                            class="button is-primary">Editar</button>
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
        window.location.href = "/metas";
      } else {
        console.error("Error al editar la transacción");
      }
    } catch (error) {
      console.error("Error al editar la transacción:", error);
    }
  };
}

function closeModalMetaEdit() {
    const modal = document.getElementById('modal-meta-edit');
    modal.classList.remove('is-active');
}
