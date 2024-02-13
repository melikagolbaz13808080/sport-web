$(function () {
    $("#includedFooter").load("footer.html");
});

function isLoggedIn() {
    if (localStorage.getItem("is_login") == "true") {
        return true;
    } else {
        return false;
    }
}

let profile_nav = document.getElementById('profile-nav')
let login_nav = document.getElementById('auth-nav')

if (!isLoggedIn()) {
    profile_nav.style.display = 'none';
    login_nav.style.display = '';
} else {
    profile_nav.style.display = '';
    login_nav.style.display = 'none';
}