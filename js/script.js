function loggedIn() {
    const username = document.cookie.username;
    if(username !== "")  {
        console.log(username);
    } else {
        console.log("no username");
    }
}

loggedIn();