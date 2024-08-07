// usmoas el router de express para crear las rutas de la aplicación y exportamos el router para poder usarlo en otros archivos
const { Router } = require("express");
// Importamos la base de datos de Firebase para poder usarla en las rutas
const { admin } = require("../firebase");
// router es un objeto que nos permite crear rutas en nuestra aplicación
const router = Router();

const db = admin.database();

router.get("/", (req, res) => {
  res.render("login");
});

// router.get('/transacciones', (req, res) => {
//     // Obtenemos los datos de la base de datos de Firebase
//     db.ref('transacciones').once('value', (snapshot) => {
//         // Guardamos los datos en la variable data_transacción
//         const data_transacción = snapshot.val();
//         console.log(data_transacción);
//         // Aqui se renderiza la vista index.hbs de la carpeta views, entonces cada vez que se haga una petición a la ruta principal se renderizará la vista index.hbs
//         // y se le pasará la variable transacciones con los datos de la base de datos de Firebase
//         res.render('index', {transacciones: data_transacción});
//     });
// });

//para que se pueda ver la vista index.hbs se tiene que hacer una petición a la ruta /transacciones
router.get("/transacciones", (req, res) => {
  res.render("index"); // Renderiza la vista index.hbs
});

// para obtener las transacciones de la base de datos de Firebase se crea una nueva ruta /api/transacciones
router.get("/api/transacciones", async (req, res) => {
  const idToken = req.headers.authorization.split("Bearer ")[1];

  try {
    // Verificar el token de autenticación
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Obtener las transacciones del usuario autenticado
    const snapshot = await db
      .ref("transacciones")
      .orderByChild("uid")
      .equalTo(uid)
      .once("value");
    const transacciones = snapshot.val();
    console.log(transacciones);
    res.json(transacciones);
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(401).json({ error: "No autorizado" });
  }
});

router.get("/2", (req, res) => {
  // Aca otra ejemplo y es que ahora cuando se mandan a llamar la ruta /2 se renderiza la vista prueba.hbs
  res.render("prueba");
});

// En JavaScript, async y await son palabras clave que se utilizan en conjunto para trabajar con funciones asíncronas de manera más sencilla y legible.
// Cuando una función se declara con la palabra clave async, se convierte en una función asíncrona.
// Asincronia significa que las tareas se ejecutan en segundo plano y la ejecución del programa continúa sin esperar a que se completen las tareas en segundo plano.
// Por otro lado, await se utiliza dentro de una función asíncrona para esperar a que una promesa se resuelva o se rechace. lo que significa que la ejecución de la función se pausa hasta que la promesa se resuelva.
// por ejemplo await db.ref('transacciones').push(transaccion); se pausará hasta que la promesa (que es la función push) se resuelva o se rechace.

// Crea una ruta para que la usamos para crear una transacción
// por eje,plo se coloca async para que la función sea asíncrona y se pueda usar await que es algo muy importante para trabajar con base de datos ya que se espera a que se cree la transacción en la base de datos de Firebase
// router.post('/crear-transaccion', async (req, res) => {
//     try {
//         // Obtenemos los datos del formulario desde la vista de index.hbs
//         console.log(req.body);
//         const transaccion = {
//             nombre: req.body.nombre,
//             costo: req.body.costo,
//             metodo: req.body.metodo_pago,
//             categoria: req.body.categoria,
//             descripcion: req.body.descripcion
//         };
//         // Guardamos la transacción en la base de datos de Firebase

//         // por ejemplo await db.ref('transacciones').push(transaccion); se pausará hasta que la promesa (que es la función push) se resuelva o se rechace.
//         await db.ref('transacciones').push(transaccion);
//         res.status(200).redirect('/transacciones');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error al guardar la transacción');
//     }
// });

router.post("/api/crear-transaccion", async (req, res) => {
  const idToken = req.headers.authorization.split("Bearer ")[1];

  try {
    // Verificar el token de autenticación
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Obtenemos los datos del formulario desde la vista de index.hbs
    console.log(req.body);
    const transaccion = {
      uid: uid, // Incluir el UID del usuario en la transacción
      nombre: req.body.nombre,
      costo: req.body.costo,
      metodo: req.body.metodo_pago,
      categoria: req.body.categoria,
      descripcion: req.body.descripcion,
    };
    // alert(transaccion);

    // Guardamos la transacción en la base de datos de Firebase
    await db.ref("transacciones").push(transaccion);
    res.status(200).redirect("/transacciones");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al guardar la transacción");
  }
});

// Funcion para verificar el token de autenticación para las acciones de editar y eliminar transacciones
async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization?.split(" ")[1];
  if (!idToken) {
    return res.status(401).send("Token de autenticación no proporcionado");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(401).send("Token de autenticación inválido");
  }
}

// Ruta para editar una transacción según su id que miren que usa la función verifyToken para verificar el token de autenticación
router.post("/api/editar-transaccion/:id", verifyToken, async (req, res) => {
  const transaccionId = req.params.id;
  const updatedTransaccion = {
    nombre: req.body.nombre,
    costo: req.body.costo,
    metodo: req.body.metodo_pago,
    categoria: req.body.categoria,
    descripcion: req.body.descripcion,
  };

  try {
    // Obtén la transacción actual
    const snapshot = await db
      .ref("transacciones")
      .child(transaccionId)
      .once("value");
    const transaccion = snapshot.val();

    if (!transaccion) {
      return res.status(404).send("Transacción no encontrada");
    }

    // Verifica que el uid de la transacción coincida con el uid del usuario autenticado
    if (transaccion.uid !== req.uid) {
      return res.status(403).send("No autorizado para editar esta transacción");
    }

    // Actualiza la transacción
    await db
      .ref("transacciones")
      .child(transaccionId)
      .update(updatedTransaccion);
    res.status(200).redirect("/transacciones");
  } catch (error) {
    console.error("Error al editar la transacción:", error);
    res.status(500).send("Error al editar la transacción");
  }
});

// Ruta para eliminar una transacción según su id y verificación de token
router.post("/api/eliminar-transaccion/:id", verifyToken, async (req, res) => {
  const transaccionId = req.params.id;
  console.log(transaccionId);

  try {
    // Eliminar la transacción de la base de datos de Firebase
    await db.ref("transacciones").child(transaccionId).remove();
    res.status(200).redirect("/transacciones");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar la transacción");
  }
});

// Ruta para verificar la validez del token
router.post("/api/checkTokenValidity", async (req, res) => {
  const idToken = req.body.idToken;

  try {
    // Verificar el token de autenticación
    await admin.auth().verifyIdToken(idToken);
    res.json({ valid: true });
  } catch (error) {
    console.error("Error checking token validity:", error);
    res.json({ valid: false });
  }
});

router.get("/metas", (req, res) => {
  res.render("metas");
});

router.post("/api/crear-meta", async (req, res) => {
  const idToken = req.headers.authorization.split("Bearer ")[1];

  try {
    // Verificar el token de autenticación
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Obtenemos los datos del formulario desde la vista de index.hbs
    console.log(req.body);
    const meta = {
      uid: uid, // Incluir el UID del usuario en la transacción
      nombre: req.body.nombre,
      objetivo: req.body.objetivo,
      monto: req.body.monto,
    };
    // alert(transaccion);

    // Guardamos la transacción en la base de datos de Firebase
    await db.ref("metas").push(meta);
    res.status(200).redirect("/metas");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al guardar la transacción");
  }
});

// para obtener las transacciones de la base de datos de Firebase se crea una nueva ruta /api/transacciones
router.get("/api/metas", async (req, res) => {
  const idToken = req.headers.authorization.split("Bearer ")[1];

  try {
    // Verificar el token de autenticación
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Obtener las transacciones del usuario autenticado
    const snapshot = await db
      .ref("metas")
      .orderByChild("uid")
      .equalTo(uid)
      .once("value");
    const metas = snapshot.val();
    console.log(metas);
    res.json(metas);
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(401).json({ error: "No autorizado" });
  }
});

router.post("/api/editar-meta/:id", verifyToken, async (req, res) => {
  const metaId = req.params.id;
//   const updatedmeta = {
//     nombre: req.body.nombre,
//     costo: req.body.costo,
//     metodo: req.body.metodo_pago,
//     categoria: req.body.categoria,
//     descripcion: req.body.descripcion,
//   };

  try {
    // Obtén la transacción actual
    const snapshot = await db
      .ref("metas")
      .child(metaId)
      .once("value");
    const meta = snapshot.val();
    

    if (!meta) {
      return res.status(404).send("Transacción no encontrada");
    }

    // Verifica que el uid de la transacción coincida con el uid del usuario autenticado
    if (meta.uid !== req.uid) {
      return res.status(403).send("No autorizado para editar esta transacción");
    }

    const nuevoMonto = (meta.monto || 0)  + req.body.abono;

    // Actualiza la transacción
    await db
      .ref("metas")
      .child(metaId)
      .update({monto:  nuevoMonto});
    res.status(200).redirect("/metas");
  } catch (error) {
    console.error("Error al editar la transacción:", error);
    res.status(500).send("Error al editar la transacción");
  }
});

module.exports = router;
