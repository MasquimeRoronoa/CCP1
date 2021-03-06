$(document).ready(function () {

    var lesutilisateurs
    var login = $("#login")
    var register = $("#register")


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
                    pp: $("#profilpic").val()
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
            if ((thisUser.mail || thisUser.pseudo) != mail && thisUser.mdp == mdp) {
                alert("Mail ou Pseudo incorrect")
                break
            }
            if ((thisUser.mail || thisUser.pseudo) == mail && thisUser.mdp != mdp) {
                alert("Mot de Passe incorrect")
                break
            }
            if ((thisUser.mail || thisUser.pseudo) != mail && thisUser.mdp != mdp) {
                alert("Veuillez vous créer un compte.")
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
            }


        }

        $("#mail").val("")
        $("#mdp").val("")


    })

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


    var lesmusics;

    $.get("https://raw.githubusercontent.com/MasquimeRoronoa/CCP1/master/jsonMusique.json", function(response){
        lesmusics = JSON.parse(response);
        var allSongs = lesmusics.songs;

        allSongs.forEach(function (music) {
                var titre = music.name
                console.log(music)
                console.log(music.song)

            $('#myTable').children('tbody').append(`
                    <tr>
                        <td> 
                        <div class="changetitle" src="${music.name} / ${music.artist} ">
                        <div src="${music.song}" class="listen"> 
                        <img src="${music.image}"  class="imgacc" > <br> <p>${music.name} / ${music.artist} </p>
                        </div>
                        </div>
                        </td>
                        
                    </tr>
                `)
                $(".changetitle").click(function (event) {
                    event.preventDefault()
                    $(".titlesong").text($(this).attr('src'))
                })
                $(".nextbtn").click(function (event) {
                    event.preventDefault()
                        $(".lecture").attr("src", music.song.length[i]+1)


                })
        })

            $(".imgacc").click(function (event) {
                event.preventDefault()
                $(".imgfoot").attr("src", $(this).attr('src'))
            })
            $(".listen").click(function (event) {
                event.preventDefault()
                $(".lecture").attr("src", $(this).attr("src"))
            })

        })


})