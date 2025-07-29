$(function () {
    $.get("../api/check_session.php", function (resp) {
        if (resp.logged) {
            window.location.href = "../views/dashboard.html";
        } else {
            window.location.href = "../views/auth.html";
        }
    }, "json");
});