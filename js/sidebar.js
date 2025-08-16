/* global bootstrap: false */
(() => {
    'use strict'
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl)
    })
  })()
  
$(document).ready(function() {
    // Manejo del envío del formulario de inicio de sesión
    $('#logout-btn').click(function (event) {
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
                window.location.href = "../index.php";
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