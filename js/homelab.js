$(function () {
    $.get("../api/check_session.php", function (resp) {
        if (resp.logged) {
            
        } else {
            window.location.href = "../views/auth.html";
        }
    }, "json");
});