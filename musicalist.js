$(document).ready(function () {

    var lesutilisateurs
    var login = $("#login")
    var register = $("#register")

    login.hide()

    if (!localStorage.getItem("Utilisateurs")) {
        lesutilisateurs = {"users": []}
    } else {
        lesutilisateurs = JSON.parse(localStorage.getItem("Utilisateurs"))
    }

    function saveJSON() {
        localStorage.setItem("Utilisateurs", JSON.stringify(lesutilisateurs))
    }

    





})