

// usmoas el router de express para crear las rutas de la aplicación y exportamos el router para poder usarlo en otros archivos
const {Router} = require('express');

// router es un objeto que nos permite crear rutas en nuestra aplicación
const router = Router();
var admin = require("firebase-admin");
var serviceAccount = require("../../gesticost-48429-firebase-adminsdk-t36fu-d9f1cd0b2b.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gesticost-48429-default-rtdb.firebaseio.com"
});

const db = admin.database();

router.get('/', (req, res) => {
    res.render('login');
});


router.get('/trasacciones', (req, res) => {
    // Obtenemos los datos de la base de datos de Firebase
    db.ref('transacciones').once('value', (snapshot) => {
        // Guardamos los datos en la variable data_transacción
        const data_transacción = snapshot.val();
        console.log(data_transacción);
        // Aqui se renderiza la vista index.hbs de la carpeta views, entonces cada vez que se haga una petición a la ruta principal se renderizará la vista index.hbs
        // y se le pasará la variable transacciones con los datos de la base de datos de Firebase
        res.render('index', {transacciones: data_transacción});
    });
});

router.get('/2', (req, res) => {
    // Aca otra ejemplo y es que ahora cuando se mandan a llamar la ruta /2 se renderiza la vista prueba.hbs
    res.render('prueba');
});

// En JavaScript, async y await son palabras clave que se utilizan en conjunto para trabajar con funciones asíncronas de manera más sencilla y legible.
// Cuando una función se declara con la palabra clave async, se convierte en una función asíncrona. 
// Asincronia significa que las tareas se ejecutan en segundo plano y la ejecución del programa continúa sin esperar a que se completen las tareas en segundo plano.
// Por otro lado, await se utiliza dentro de una función asíncrona para esperar a que una promesa se resuelva o se rechace. lo que significa que la ejecución de la función se pausa hasta que la promesa se resuelva. 
// por ejemplo await db.ref('transacciones').push(transaccion); se pausará hasta que la promesa (que es la función push) se resuelva o se rechace.


// Crea una ruta para que la usamos para crear una transacción
// por eje,plo se coloca async para que la función sea asíncrona y se pueda usar await que es algo muy importante para trabajar con base de datos ya que se espera a que se cree la transacción en la base de datos de Firebase
router.post('/crear-transaccion', async (req, res) => {
    try {
        // Obtenemos los datos del formulario desde la vista de index.hbs
        console.log(req.body);
        const transaccion = {
            nombre: req.body.nombre,
            costo: req.body.costo,
            metodo: req.body.metodo_pago,
            categoria: req.body.categoria,
            descripcion: req.body.descripcion
        };
        // Guardamos la transacción en la base de datos de Firebase

        // por ejemplo await db.ref('transacciones').push(transaccion); se pausará hasta que la promesa (que es la función push) se resuelva o se rechace.
        await db.ref('transacciones').push(transaccion);
        res.status(200).redirect('/trasacciones');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al guardar la transacción');
    }
});

// Ruta para eliminar una transacción según su id      
router.get('/eliminar-transaccion/:id', async (req, res) => {
    const transaccionId = req.params.id;
    
    try {
        // Eliminar la transacción de la base de datos de Firebase
        await db.ref('transacciones').child(transaccionId).remove();
        res.status(200).redirect('/trasacciones');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la transacción');
    }
});

// Ruta para editar una transacción según su id
router.post('/editar-transaccion/:id', async (req, res) => {
    const transaccionId = req.params.id;
    // Obtenemos los datos del formulario de edicion desde la vista de index.hbs
    const updatedTransaccion = {
        nombre: req.body.nombre,
        costo: req.body.costo,
        metodo: req.body.metodo_pago,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion
    };

    try {
        // Actualizar la transacción en la base de datos de Firebase
        await db.ref('transacciones').child(transaccionId).update(updatedTransaccion);
        res.status(200).redirect('/trasacciones');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al editar la transacción');
    }
});





module.exports = router;

