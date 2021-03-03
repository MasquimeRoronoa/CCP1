$(document).ready(function () {

    var lesutilisateurs
    var login = $("#login")
    var register = $("#register")

    $("#mainpage").hide()
    login.hide()
    $(".deco").hide()
    $(".photoprofil").hide()

    if (!localStorage.getItem("Utilisateurs")) {
        lesutilisateurs = {"users": []}
    } else {
        lesutilisateurs = JSON.parse(localStorage.getItem("Utilisateurs"))
    }

    function saveJSON() {
        localStorage.setItem("Utilisateurs", JSON.stringify(lesutilisateurs))
    }

    function create_UUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    $("#dejacompte").click(function () {
        register.hide()
        login.show()
    })

    $("#firstvisit").click(function () {
        login.hide()
        register.show()
    })

    $("#form2").submit(function (event) {
        event.preventDefault()

        if (newmail == "" || newpseudo == "" || newmdp == "" || pp == "") {
            alert("Veuillez remplir les champs")
        }

        var emailexist = false
        var pseudoexist = false
        var newmdp = $("#newmdp").val()
        var userId = create_UUID()
        var pp = $("#profilpic").val()
        var regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\&\#\-\_\+\=\@\{\}\[\]\(\)])[A-Za-z\d\&\#\-\_\+\=\@\{\}\[\]\(\)]{6,}$/

        let x
        for (x in lesutilisateurs.users) {
            let newmail = $("#newmail").val()
            let newpseudo = $("#newpseudo").val()
            let actualUser = lesutilisateurs.users[x]
            if (actualUser.mail == newmail) {
                alert("Email déjà utilisé")
                emailexist = true
                break
            }
            if (actualUser.pseudo == newpseudo) {
                pseudoexist = true
                alert("Pseudo déjà utilisé")
                break
            }
            if (!newmdp.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\&\#\-\_\+\=\@\{\}\[\]\(\)])[A-Za-z\d\&\#\-\_\+\=\@\{\}\[\]\(\)]{6,}$/)) {
                alert("Veuillez saisir un Mot de Passe comportant 6 caractères minimums, 1 chiffre, 1 caractère spécial &#{([-_@)]=+}, une patte de poulet et le sang d'une vierge.")
                break
            }
        }
        if (emailexist == false && pseudoexist == false && newmdp == newmdp.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\&\#\-\_\+\=\@\{\}\[\]\(\)])[A-Za-z\d\&\#\-\_\+\=\@\{\}\[\]\(\)]{6,}$/) && pp != "") {
            alert("Inscription réussis")
            register.hide()
            login.show()

            var info = {
                id: userId,
                mail: $("#newmail").val(),
                pseudo: $("#newpseudo").val(),
                mdp: $("#newmdp").val(),
                pp: $("#profilpic").val()
            }
            lesutilisateurs.users.push(info)
            saveJSON()

            newmail = $("#newmail").val("")
            newpseudo: $("#newpseudo").val("")
            newmdp: $("#newmdp").val("")

        }

    })

    $("#form1").submit(function (event) {
        event.preventDefault()
        var userexist = false
        var actualUser = {
            mail: $("#mail").val(),
            pseudo: $("#mail").val(),
            mdp: $("#mdp").val(),
        }
        let x
        for (x in lesutilisateurs.users) {
            var mail = $("#mail").val()
            var mdp = $("#mdp").val()
            let actualUser = lesutilisateurs.users[x]
            if (mail == "" || mdp == "") {
                alert("Veuillez remplir les champs.")
                break
            }
            if ((actualUser.mail == mail || actualUser.pseudo == mail)) {
                if (actualUser.mdp == mdp) {
                    userexist = true
                    alert("Connexion réussis")
                    login.hide()
                    $("#mainpage").show()
                    $(".deco").show()
                    $(".photoprofil").show()
                    break;
                }
            }
            if ((actualUser.mail != mail || actualUser.pseudo != mail)) {
                if (actualUser.mdp == mdp) {
               alert("Mail ou Pseudo incorrect")
                break
            }
            }
            if ((actualUser.mail == mail || actualUser.pseudo == mail)) {
                if (actualUser.mdp != mdp) {
                    userexist = true
                    alert("Mot de Passe incorrect")
                    break;
                }
            }
        }
        if (!userexist) {
            //user not found
            alert("Connexion Impossible")
        }

    })

    $(".deco").click(function (event) {
        event.preventDefault()
        $("#mainpage").hide()
        $("#login").show()
    })


})