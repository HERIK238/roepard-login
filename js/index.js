$(document).ready(function() {
    // Verificar sesión al cargar la página
    $.get("../api/check_session.php", function (resp) {
        if (!resp.logged) {
            // Si no está logueado, redirigir a auth
            window.location.href = "../views/auth.html";
        } else {
            // Si está logueado, redirigir a dashboard
            window.location.href = "../views/dashboard.html"; 
        }
    }, "json").fail(function() {
        // En caso de error en la solicitud, redirigir a auth
        window.location.href = "../views/auth.html";
    });
});