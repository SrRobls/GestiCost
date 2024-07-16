

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

// Crea una ruta para que la usamos para crear una transacción
router.post('/crear-transaccion', (req, res) => {
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
    db.ref('transacciones').push(transaccion, (error) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error al guardar la transacción');
        } else {
            res.status(200).redirect('/');
        }
    });
});

module.exports = router;

