$(function () {
    $.get("../api/check_session.php", function (resp) {
        if (resp.logged) {
            // nada
        } else {
            window.location.href = "../index.html";
        }
    }, "json");
});