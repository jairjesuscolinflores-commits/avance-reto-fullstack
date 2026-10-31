const mongoose = require('mongoose');

// Definimos la estructura de cómo se verá una Tarea en la base de datos
const tareaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio']
    },
    descripcion: {
        type: String,
        default: ''
    },
    completada: {
        type: Boolean,
        default: false
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

// Exportamos el modelo para poder usarlo en otras partes de la app
module.exports = mongoose.model('Tarea', tareaSchema);