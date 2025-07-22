$(function () {
    $.get("../api/check_session.php", function (resp) {
        if (!resp.logged) {
            // No hay sesión, volver al login
            window.location.href = "../views/auth.html";
        } else {
            // Ya logeado -> seguir cargando la vista
        }
    }, "json");
});