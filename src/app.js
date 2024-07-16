// Importamos express para crear las peticiones y respuestas del servidor
const express = require('express');
// Importamos morgan para ver las peticiones en consola
const morgan = require('morgan'); 
// Importamos express-handlebars y usamos desestructuración para obtener la función engine para configurar el motor de plantillas esto hace que los archivos .hbs sean como html con js
const { engine } = require('express-handlebars');
// Importamos path para manejar las rutas de los archivos
const path = require('path');
// Creamos una instancia de express para poder usar sus métodos
const app = express();

// CONFIGURACIÓN
// Configuramos el puerto y las vistas
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
// Configuramos el motor de plantillas con la función engine
app.engine('.hbs', engine({
    defaultLayout: 'main',
    extname: '.hbs',
}));
app.set('view engine', '.hbs');

// MIDDLEWARES
// Usamos morgan para ver las peticiones en consola, configuramos el servidor para que pueda recibir datos de formularios y usamos json para recibir y enviar datos en formato json
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// ARCHIVOS ESTÁTICOS
// Configuramos la carpeta public para que los archivos estáticos puedan ser accedidos
app.use(express.static(path.join(__dirname, 'public')));

// RUTAS
// las rutas son archivos que contienen las peticiones y respuestas del servidor
app.use(require('./routers/index'));

// Exportamos el objeto app
module.exports = app;