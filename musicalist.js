$(document).ready(function () {

    var lesutilisateurs
    var login = $("#login")
    var register = $("#register")

    $("#listfavoris").hide()


    if (!localStorage.getItem("Utilisateurs")) {
        lesutilisateurs = {"users": []}
    } else {
        lesutilisateurs = JSON.parse(localStorage.getItem("Utilisateurs"))
    }

    function saveJSON() {
        localStorage.setItem("Utilisateurs", JSON.stringify(lesutilisateurs))
    }

    function saveJSON2() {
        localStorage.setItem("MesFavoris", JSON.stringify(lesfavoris))
    }

    /* Création de l'id unique utilisateur */

    function create_UUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    /* Changement de fenetre au clic sur première inscription ou sur connexion */

    $("#dejacompte").click(function () {
        register.hide()
        login.show()
    })

    $("#firstvisit").click(function () {
        login.hide()
        register.show()
    })

    /* Formulaire d'inscription avec Regex sur MdP */

    $("#form2").submit(function (event) {
        event.preventDefault()

        var emailexist = false
        var pseudoexist = false
        var newmdp = $("#newmdp").val()
        var userId = create_UUID()
        var pp = $("#profilpic").val()
        var regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\&\#\-\_\+\=\@\{\}\[\]\(\)])[A-Za-z\d\&\#\-\_\+\=\@\{\}\[\]\(\)]{6,}$/
        var mdpregex = newmdp.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\&\#\-\_\+\=\@\{\}\[\]\(\)])[A-Za-z\d\&\#\-\_\+\=\@\{\}\[\]\(\)]{6,}$/)

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
            if (newmdp.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\&\#\-\_\+\=\@\{\}\[\]\(\)])[A-Za-z\d\&\#\-\_\+\=\@\{\}\[\]\(\)]{6,}$/) == actualUser.mdp) {
                alert("Veuillez saisir un Mot de Passe non utilisé.")
                break
            }
        }
        if((!localStorage.getItem("Utilisateurs") && newmdp != "" && newmail != "" && pp != "") || (emailexist == false && pseudoexist == false && newmdp != (!mdpregex && actualUser.mdp) && pp != "") ){
            if (newmdp != mdpregex){
                alert("Veuillez saisir un Mot de Passe comportant 6 caractères minimums, 1 chiffre, 1 caractère spécial &#{([-_@)]=+}, une patte de poulet et le sang d'une vierge.")
            }
            else
            {
                alert("Inscription réussis")
                register.hide()
                login.show()

                var info = {
                    id: userId,
                    mail: $("#newmail").val(),
                    pseudo: $("#newpseudo").val(),
                    mdp: $("#newmdp").val(),
                    pp: $("#profilpic").val(),
                    fav : [],
                }
                lesutilisateurs.users.push(info)
                saveJSON()

                newmail = $("#newmail").val("")
                newpseudo: $("#newpseudo").val("")
                newmdp: $("#newmdp").val("")
                pp = $("#profilpic").val("")
            }
        }
        if (newmail != "" || newpseudo != "" || newmdp != "" || pp != "") {
            alert("Veuillez remplir les champs")
        }

    })

    /* Formulaire de connexion */

    $("#form1").submit(function (event) {
        event.preventDefault()
        var userexist = false
        let isConnected = false
        let x
        for (x in lesutilisateurs.users) {
            var mail = $("#mail").val()
            var mdp = $("#mdp").val()
            let thisUser = lesutilisateurs.users[x]
            if (mail == "" || mdp == "") {
                alert("Veuillez remplir les champs.")
                break
            }
            if ((thisUser.mail == mail || thisUser.pseudo == mail)) {
                if (thisUser.mdp == mdp) {
                    userexist = true
                    let actualUser = lesutilisateurs.users[x]
                    sessionStorage.setItem("actualUser", JSON.stringify(actualUser))
                    alert("Connexion réussis")
                    $("#login").hide()
                    $("#mainpage").show()
                    $(".navbar").show()
                    $(".footer").show()
                    $(".deco").show()
                    $(".photoprofil").attr("src", actualUser.pp).show()
                    break;
                }
                else if ((thisUser.mail == mail || thisUser.pseudo == mail) && thisUser.mdp != mdp){
                    alert("Mot de Passe incorrect")
                    break
                }
            }

        }

        $("#mail").val("")
        $("#mdp").val("")


    })

    /* Création du bouton déconnexion et envoie dans le session storage pour rester connecter après un refresh */

    $(".deco").click(function (event) {
        event.preventDefault()
        $("#mainpage").hide()
        $("#login").show()
        $(".deco").hide()
        $(".photoprofil").hide()
        sessionStorage.clear()
    })

    if (!sessionStorage.getItem("actualUser")) {
        $('#mainpage').hide()
        $("#register").show()
    } else {
        let thisUser = JSON.parse(sessionStorage.getItem("actualUser"))
        $('#mainpage').show()
        $("#register").hide()
        $(".deco").show()
        $(".photoprofil").attr("src", thisUser.pp).show()
        $(".navbar").show()
        $(".footer").show()

    }

    /* Appel de l'API et affichage du contenue dans la page d'accueil */

    var lesmusics;

    $.get("https://raw.githubusercontent.com/MasquimeRoronoa/CCP1/master/jsonMusique.json", function(response){
        lesmusics = JSON.parse(response);
        var allSongs = lesmusics.songs;


        var test =-1;
        allSongs.forEach(function (music) {
                console.log(music.name)
                test++;

            $('#myTable').children('tbody').append(`
                    <tr>
                        <td> 
                        <div class="changetitle" src="${music.name} / ${music.artist} ">
                        <div src="${music.song}" class="listen"> 
                        <img id="${test}" src="${music.image}"  class="imgacc" > <br> <p>${music.name} / ${music.artist} </p>
                        </div>
                        </div>
                        </td>
                        
                    </tr>
                `)
        })

        /* Modification du titre de la chanson dans le footer au moment du clic*/


        $(".changetitle").click(function (event) {
            event.preventDefault()
            $(".titlesong").text($(this).attr('src'))
            $(".titlesong").attr("src", $(this).attr('src'))
            var titreMusic = $(".titlesong").attr("src")
            console.log(titreMusic)

        })

        /* Modification de l'image de la chanson dans le footer au moment du clic */

            $(".imgacc").click(function (event) {
                event.preventDefault()
                $(".imgfoot").attr("src", $(this).attr('src'))
                $("#index").attr("data",$(this).attr('id'))
            })

        /* Modification de la source de la chanson dans le lecteur du footer au moment du clic */

            $(".listen").click(function (event) {
                event.preventDefault()
                $(".lecture").attr("src", $(this).attr("src"))
            })

/* Bouton suivant et précédent */

                $(".nextbtn").click(function (event) {
                event.preventDefault()
                var indexChansonlance = $("#index").attr('data');
                var x = parseInt(indexChansonlance) +1;
                if (x < 39) {
                    $(".lecture").attr("src", allSongs[x].song)
                    $(".imgfoot").attr("src", allSongs[x].image)
                    $(".titlesong").text(allSongs[x].name + " / " + allSongs[x].artist)

                    $("#index").attr('data', x)
                }
                else {
                    var indexChansonlance = $("#index").attr('data');
                    var x = parseInt(indexChansonlance) - 39;

                    $(".lecture").attr("src", allSongs[x].song)
                    $(".imgfoot").attr("src", allSongs[x].image)
                    $(".titlesong").text(allSongs[x].name + " / " + allSongs[x].artist)

                    $("#index").attr('data', x)
                }
                })


        $(".prevbtn").click(function (event) {
            event.preventDefault()
            var indexChansonlance = $("#index").attr('data');
            var x = parseInt(indexChansonlance) -1;

            if (x < 39) {
                $(".lecture").attr("src", allSongs[x].song)
                $(".imgfoot").attr("src", allSongs[x].image)
                $(".titlesong").text(allSongs[x].name + " / " + allSongs[x].artist)

                $("#index").attr('data', x)
            }
        })


        let searchstr = $(".recherche").val("")
        for (searchstr in allSongs.name){
            console.log(searchstr)
            if (music.name.contains(searchstr)){
                $('#myTable').hide()

            }
        }

/* Ajout du contenue en favoris */

        $(".like").click(function (event) {
            event.preventDefault()
            if (!localStorage.getItem("MesFavoris")) {
                lesfavoris = {"favoris": []}
            } else {
                lesfavoris = JSON.parse(localStorage.getItem("MesFavoris"))
            }

            var myFav = {
                id : JSON.parse(sessionStorage.getItem("actualUser")).id,
                title : $(".titlesong").text(),
                img : $(".imgfoot").attr("src"),
                song : $(".lecture").attr("src"),
            }
            var actualUser = JSON.parse(sessionStorage.getItem("actualUser")).id
            var titreMusic = $(".titlesong").attr("src")

                lesfavoris.favoris.push(myFav)
                saveJSON2()


        })

/* Tentative de modification de l'icon de like si la chanson est dejà en favoris */

        $(".imgacc").click(function (event) {
            event.preventDefault()

            if (!localStorage.getItem("MesFavoris")) {
                lesfavoris = {"favoris": []}
            } else {
                lesfavoris = JSON.parse(localStorage.getItem("MesFavoris"))
            }

            let x
            for (x in lesfavoris.favoris[x]) {
                var thisfav = lesfavoris.favoris[x]
                var thissong = $(".titlesong").attr("src", $(this).attr('src'))
                if (thisfav.title == thissong){
                    $(".like").removeClass("far")
                    $(".like").addClass("fas")
                }
            }
        })

/* Affichage des favoris */

        $(".favoris").click(function (event) {
            event.preventDefault()

            if (!localStorage.getItem("MesFavoris")) {
                lesfavoris = {"favoris": []}
            } else {
                lesfavoris = JSON.parse(localStorage.getItem("MesFavoris"))
            }
                $("#accueil").hide()
                $("#listfavoris").show()

            var allfav = JSON.parse(localStorage.getItem("MesFavoris"))


                let x
                for (x in allfav.favoris)
                    var tabfav = allfav.favoris[x]

            {
                        $('#favTable').children('tbody').append(`
                    <tr>
                        <td> 
                        <div class="changetitle" src="${tabfav.title}">
                        <div src="${tabfav.song}" class="listen"> 
                        <img src="${tabfav.img}"  class="imgacc"> <br> <p>${tabfav.title}</p>
                        </div>
                        </div>
                        </td>  
                    </tr>
                `)


                    $(".changetitle").click(function (event) {
                        event.preventDefault()
                        $(".titlesong").text($(this).attr('src'))
                    })
                    $(".imgacc").click(function (event) {
                        event.preventDefault()
                        $(".imgfoot").attr("src", $(this).attr('src'))
                    })
                    $(".listen").click(function (event) {
                        event.preventDefault()
                        $(".lecture").attr("src", $(this).attr("src"))
                    })
                }
        })

    })

})