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
            } else {
                console.log("Error");
            }
        },
        error: function(xhr, status, error) {
            console.log(status + ": " + error);
        }
    });
}