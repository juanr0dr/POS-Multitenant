document.addEventListener('DOMContentLoaded', () => {
    // Forzar el vaciado de todos los inputs al cargar la página
    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => {
        input.value = '';
    });
    // ==========================================
    // 1. LÓGICA DE MOSTRAR/OCULTAR CONTRASEÑA
    // ==========================================

    // Para el botón de texto "Mostrar" (Pestaña Login)
    const toggleTextBtn = document.querySelector('.toggle-password');
    const loginPasswordInput = document.getElementById('loginPassword');

    if (toggleTextBtn && loginPasswordInput) {
        toggleTextBtn.addEventListener('click', function () {
            const type = loginPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            loginPasswordInput.setAttribute('type', type);
            this.textContent = type === 'password' ? 'Mostrar' : 'Ocultar';
        });
    }

    // Para el botón de ícono (Pestaña Unirse/Registro)
    const toggleIconBtn = document.querySelector('.toggle-password-icon');
    const regPasswordInput = document.getElementById('regPassword');

    if (toggleIconBtn && regPasswordInput) {
        toggleIconBtn.addEventListener('click', function () {
            const type = regPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            regPasswordInput.setAttribute('type', type);

            // Cambiar la clase del ícono de Bootstrap
            const icon = this.querySelector('i');
            icon.classList.toggle('bi-eye-fill');
            icon.classList.toggle('bi-eye-slash-fill');
        });
    }

    // ==========================================
    // 2. LÓGICA DE ALERTAS
    // ==========================================
    const alertBox = document.getElementById('authAlert');

    function showAlert(message, type) {
        alertBox.className = `alert alert-${type} mt-4 text-center fw-semibold`;
        alertBox.textContent = message;
        alertBox.classList.remove('d-none');
    }

    // ==========================================
    // 3. LÓGICA DE REGISTRO (UNIRSE)
    // ==========================================
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const payload = {
                storeName: document.getElementById('regStoreName').value,
                slug: document.getElementById('regSlug').value,
                adminEmail: document.getElementById('regEmail').value,
                password: document.getElementById('regPassword').value
            };

            // Efecto visual de carga en el botón
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Procesando...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/tenants/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) {
                    // Guardamos el token y los datos de la tienda en localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('storeName', data.tenant.storeName);

                    showAlert('¡Tienda creada con éxito! Redirigiendo...', 'success');

                    // Redirigir al panel de administración tras 1.5 segundos
                    setTimeout(() => {
                        window.location.href = '/dashboard.html';
                    }, 1500);

                } else {
                    showAlert(data.error || 'Error en el registro', 'danger');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                showAlert('Error conectando con el servidor', 'danger');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // ==========================================
    // 4. LÓGICA DE LOGIN (Placeholder)
    // ==========================================
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const payload = {
                adminEmail: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value
            };

            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Procesando...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/tenants/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('storeName', data.tenant.storeName);

                    showAlert('¡Bienvenido! Redirigiendo...', 'success');

                    setTimeout(() => {
                        window.location.href = '/dashboard.html';
                    }, 1500);

                } else {
                    showAlert(data.error || 'Credenciales incorrectas', 'danger');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                showAlert('Error conectando con el servidor', 'danger');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

});