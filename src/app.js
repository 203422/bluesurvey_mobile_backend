const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/routes')
const createRoles = require('./libs/initialSetup')

require('dotenv').config();

const port = process.env.PORT || '4000';
const app = express();
createRoles.createRoles();

app.use(cors());
app.use(express.json());
app.use(routes)

app.listen(port, () => {
    console.log('Servidor ejecutándose en el puerto:', port);
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a la base de datos'))
    .catch((error) => console.log(error))

