$(function () {
    $.get("../api/check_session.php", function (resp) {
        if (!resp.logged) {
            // No hay sesión, volver al login
            window.location.href = "../index.html";
        } else {
            // Ya logeado -> seguir cargando la vista
        }
    }, "json");
});

$(document).ready(function() {
    // Manejo del envío del formulario de inicio de sesión
    $('.logout-btn').click(function (event) {
        event.preventDefault(); 
        LogoutUser();
    });
    
});

function LogoutUser() {
    $.ajax({
        url: '../api/logout.php',
        method: 'POST',
        success: function (response) {
            if (response.success === true) {
                console.log(response.message);
                window.location.href = "../index.html";
            } else if (response.success === false) {
                console.log(response.message);
                alert(response.message);
            }
        },
        error: function(xhr, status, error) {
            console.log(status + ": " + error);
            alert(error);
        }
    });
}