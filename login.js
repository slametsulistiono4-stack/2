function login(){

    const loginValue =
    document.getElementById("loginInput")
    .value.trim();

    const password =
    document.getElementById("passwordInputLogin")
    .value.trim();

    if(loginValue === "" || password === ""){

        document.getElementById("error")
        .innerText = "Lengkapi data login";

        return;
    }

    let users =
    JSON.parse(localStorage.getItem("users")) || {};

    let foundUser = null;

    /*
        cari user
    */

    for(const email in users){

        const user = users[email];

        if(
            user.email === loginValue ||
            user.username === loginValue
        ){

            foundUser = user;

            break;
        }
    }

    /*
        user belum ada
    */

    if(!foundUser){

        /*
            pertama kali
            wajib email
        */

        if(!loginValue.includes("@")){

            document.getElementById("error")
            .innerText =
            "Pertama kali wajib login pakai email";

            return;
        }

        users[loginValue] = {

            username: "",

            email: loginValue,

            password: password
        };

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        localStorage.setItem(
            "currentUser",
            loginValue
        );

        localStorage.setItem(
            "isLogin",
            "true"
        );

        window.location.href =
        "index.html";

        return;
    }

    /*
        cek password
    */

    if(foundUser.password !== password){

        document.getElementById("error")
        .innerText =
        "Password salah";

        return;
    }

    /*
        login berhasil
    */

    localStorage.setItem(
        "currentUser",
        foundUser.email
    );

    localStorage.setItem(
        "isLogin",
        "true"
    );

    window.location.href =
    "index.html";
}