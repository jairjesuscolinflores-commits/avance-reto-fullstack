const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// REGISTRO
router.post('/register', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        
        // Verificar si el usuario ya existe
        const usuarioExiste = await Usuario.findOne({ email });
        if (usuarioExiste) return res.status(400).json({ mensaje: 'El correo ya está registrado' });

        const nuevoUsuario = new Usuario({ nombre, email, password });
        await nuevoUsuario.save();
        
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Buscar usuario
        const usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(400).json({ mensaje: 'Credenciales inválidas' });

        // Comparar contraseña
        const passwordCorrecto = await usuario.compararPassword(password);
        if (!passwordCorrecto) return res.status(400).json({ mensaje: 'Credenciales inválidas' });

        // Crear Token JWT
        const token = jwt.sign(
            { id: usuario._id, nombre: usuario.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ mensaje: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el login', error: error.message });
    }
});

module.exports = router;