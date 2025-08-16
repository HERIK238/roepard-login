// Inicialización de variables y eventos para el manejo de autenticación
const container = document.querySelector(".container");
const register = document.querySelector(".register-btn");
const login = document.querySelector(".login-btn");

register.addEventListener("click", () => {
    container.classList.add("active");
});

login.addEventListener("click", () => {
    container.classList.remove("active");
});

$(function () {
    $.get("../api/check_session.php", function (resp) {
        if (resp.logged) {
            window.location.href = "../views/dashboard.php";
        } else {
            // window.location.href = "../index.html";
        }
    }, "json");
});

$(document).ready(function() {
    // Manejo del envío del formulario de inicio de sesión
    $('#LoginForm').submit(function (event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        // console.log("Login process started");

        // Obtener los valores de los campos de entrada
        var username = $.trim($('input[name="username"]').val()); // 'email' es el campo combinado para email, username o phone
        var password = $.trim($('input[name="password"]').val()); // Obtener la contraseña

        // DEBUG
        console.log("Username: " + username);
        console.log("Password: " + password);

        // Llamar a la función para hacer el login
        LoginUser(username, password);
    });
});

// Función para loguear al usuario
function LoginUser(username, password) {
    // Verificar si los campos están vacíos
    if (!username || !password) {
        console.log("Vacio");
        return; // Salir de la función si hay campos vacíos
    }

    // Enviar datos de inicio de sesión al servidor
    $.ajax({
        url: '../api/auth_user.php', // URL de la API de autenticación
        method: 'POST', // Método HTTP para la petición
        data: { username: username, password: password }, // Datos a enviar en la petición
        dataType: 'json', // Tipo de dato esperado en la respuesta
        success: function (message) {
            if (message.status === "success") {
                console.log("Correcto");
                window.location.href = "../views/dashboard.php";
            } else {
                console.log("Error");
            }
        },
        error: function(xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}

// Función para registrar un nuevo usuario
$(document).ready(function() {
    $('#RegisterForm').submit(function (event) {
        event.preventDefault();
        // console.log("Register process started");
        
        // Obtener valores del formulario usando IDs
        var first_name = $('#first_name').val().trim();
        var last_name = $('#last_name').val().trim();
        var phone = $('#phone').val().trim();
        var username = $('#username').val().trim();
        var email = $('#email').val().trim();
        var password = $('#password').val().trim();

        // Debug: Mostrar valores en la consola
        console.log('Form Values:', {
            first_name: first_name,
            last_name: last_name,
            phone: phone,
            username: username,
            email: email,
            password: password
        });

        // Validación de campos requeridos
        let missingFields = [];
        
        if (!first_name) missingFields.push('Nombre');
        if (!last_name) missingFields.push('Apellido');
        if (!phone) missingFields.push('Teléfono');
        if (!username) missingFields.push('Nombre de usuario');
        if (!email) missingFields.push('Email');
        if (!password) missingFields.push('Contraseña');

        if (missingFields.length > 0) {
            let message = "Por favor, complete los siguientes campos faltantes:\n\n" + missingFields.join('\n');
            alert(message);
            return;
        }

        // Llamada a la función para registrar usuario
        RegisterUser(first_name, last_name, phone, username, email, password);
    });
});

// Función para registrar un nuevo usuario
function RegisterUser(first_name, last_name, phone, username, email, password) {
    $.ajax({
        url: '../api/reg_user.php',
        method: 'POST',
        data: { 
            first_name: first_name,
            last_name: last_name,
            phone: phone,
            username: username,
            email: email,
            password: password
        },
        dataType: 'json',       
        success: function (response) {
            console.log("Response: ", response);
            if (response.status == "success") {
                console.log("Register response: ", response.message);
                window.location.href = "../views/dashboard.php";
            } else {
                console.log(response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX error: " + error);
            if (xhr.responseText) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    alert(response.message || "An error occurred during registration.");
                } catch (e) {
                    alert("An error occurred during registration. Please try again.");
                }
            } else {
                alert("An error occurred during registration. Please try again.");
            }
        }
    });
}

