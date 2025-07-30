$(document).ready(function() {
    let cooldownTime = 10000; // 10 segundos
    let progressBar = $('#progress-bar');
    let progressText = $('#progress-text');
    let cooldownText = $('#cooldown-text');
    let startButton = $('#start-btn');
    let interval;

    // Verificar sesión al cargar la página
    $.get("../api/check_session.php", function (resp) {
        if (!resp.logged) {
            // Si no está logueado, redirigir a auth
            window.location.href = "../views/auth.html";
            return;
        }
        
        // Si está logueado, habilitar el progress bar
        initializeProgressBar();
    }, "json").fail(function() {
        // En caso de error en la solicitud, redirigir a auth
        window.location.href = "../views/auth.html";
    });

    function initializeProgressBar() {
        startButton.click(function() {
            // Reiniciar valores
            progressBar.css('width', '0%');
            progressBar.attr('aria-valuenow', 0);
            progressText.text('0%');
            cooldownText.text('Cooldown: ' + (cooldownTime/1000) + 's');
            
            // Deshabilitar botón durante cooldown
            startButton.prop('disabled', true);
            
            let startTime = Date.now();
            
            // Actualizar progress bar cada 50ms
            interval = setInterval(function() {
                let elapsedTime = Date.now() - startTime;
                let progress = Math.min((elapsedTime / cooldownTime) * 100, 100);
                
                // Actualizar barra de progreso
                progressBar.css('width', progress + '%');
                progressBar.attr('aria-valuenow', progress);
                progressText.text(Math.round(progress) + '%');
                
                // Actualizar texto de cooldown
                let remainingTime = (cooldownTime - elapsedTime) / 1000;
                if (remainingTime > 0) {
                    cooldownText.text('Cooldown: ' + remainingTime.toFixed(1) + 's');
                } else {
                    cooldownText.text('Cooldown: 0s');
                }
                
                // Finalizar cuando se complete el cooldown
                if (progress >= 100) {
                    clearInterval(interval);
                    startButton.prop('disabled', false);
                }
            }, 50);
        });
    }
});