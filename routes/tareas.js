const express = require('express');
const router = express.Router();
const Tarea = require('../models/Tarea');
const auth = require('./authMiddleware'); // Importamos el guardia de seguridad

// 1. CREATE (Crear una tarea) - POST (Protegido)
router.post('/', auth, async (req, res) => {
    try {
        const nuevaTarea = new Tarea(req.body);
        const tareaGuardada = await nuevaTarea.save();
        res.status(201).json(tareaGuardada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la tarea', error: error.message });
    }
});

// 2. READ (Leer todas las tareas) - GET (Público)
router.get('/', async (req, res) => {
    try {
        const tareas = await Tarea.find();
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las tareas', error: error.message });
    }
});

// 3. UPDATE (Actualizar una tarea) - PUT (Protegido)
router.put('/:id', auth, async (req, res) => {
    try {
        const tareaActualizada = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tareaActualizada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        res.json(tareaActualizada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar la tarea', error: error.message });
    }
});

// 4. DELETE (Eliminar una tarea) - DELETE (Protegido)
router.delete('/:id', auth, async (req, res) => {
    try {
        const tareaEliminada = await Tarea.findByIdAndDelete(req.params.id);
        if (!tareaEliminada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        res.json({ mensaje: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la tarea', error: error.message });
    }
});

module.exports = router;