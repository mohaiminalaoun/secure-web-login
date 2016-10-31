/**
 * Created by Jesse on 10/30/2016.
 */
window.onload = function() {
    var btn = document.getElementById("signupbutton");
    btn.onclick = function () {
        let allow = true;
        let usernameSignup = document.getElementById("nameInput").value;
        //check username manually
        console.log(usernameSignup);
        if (usernameSignup.length < 6 || usernameSignup.length > 16) {
            console.log(usernameSignup);
        }

        let pwd = document.getElementById("passwordInput").value;
        console.log(pwd);
            $.ajax({
                url: "/v1/user",
                context: document.body,
                type: "POST",
                data: {
                    username: usernameSignup,
                    password: pwd
                },
                success: function (res, status, xhr) {
                    console.log("there was succss");
                    location.href = "/profile/" + usernameSignup;
                    if (xhr.status === 201) {
                        location = "./profile/" + usernameSignup;

                    }
                    // go there anyways

                    //window.location = "./profile.html?username="+usernameSignup;

                },
                error: function (e) {
                    //alert("error in server");
                    console.log(e);
                }
            });


        }



};