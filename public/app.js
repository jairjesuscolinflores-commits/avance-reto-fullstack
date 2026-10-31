const API_URL = 'http://localhost:3000/api';

// Lógica para la página de LOGIN
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        } else {
            document.getElementById('error-message').textContent = data.mensaje || 'Error al iniciar sesión';
        }
    });
}

// Lógica para la página de TAREAS
const listaTareas = document.getElementById('lista-tareas');
if (listaTareas) {
    const token = localStorage.getItem('token');
    
    if (!token) window.location.href = 'login.html';

    const agregarBtn = document.getElementById('agregar-btn');
    const inputTarea = document.getElementById('nueva-tarea');
    const logoutBtn = document.getElementById('logout-btn');

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    const cargarTareas = async () => {
        const res = await fetch(`${API_URL}/tareas`);
        const tareas = await res.json();
        
        listaTareas.innerHTML = '';
        tareas.forEach(tarea => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${tarea.titulo}</span>
                <button class="btn-delete" onclick="eliminarTarea('${tarea._id}')">Eliminar</button>
            `;
            listaTareas.appendChild(li);
        });
    };

    agregarBtn.addEventListener('click', async () => {
        const titulo = inputTarea.value.trim();
        if (!titulo) return alert('Escribe una tarea');

        const res = await fetch(`${API_URL}/tareas`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ titulo })
        });

        if (res.ok) {
            inputTarea.value = '';
            cargarTareas();
        } else {
            alert('Error al crear la tarea. Tu sesión podría haber expirado.');
        }
    });

    window.eliminarTarea = async (id) => {
        const res = await fetch(`${API_URL}/tareas/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) cargarTareas();
    };

    cargarTareas();
}
