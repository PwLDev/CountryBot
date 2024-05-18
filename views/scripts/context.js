window.onload = () => {
    document.getElementById("pfp")
    .oncontextmenu = event => {
        event.preventDefault();
        document.getElementById("usercontext").style.opacity = 1;
        document.getElementById("usercontext").style.visibility = "visible"
        document.getElementById("usercontext").style.left = event.x + "px";
        document.getElementById("usercontext").style.top = event.y + "px";
    }

    document.onclick = () => {
        if (document.getElementById("usercontext").style.visibility === "visible") {
            document.getElementById("usercontext").style.opacity = 0;
            document.getElementById("usercontext").style.visibility = "hidden"
        }
    }
}

function inviteBot() {
    const a = document.createElement("a");
    a.href = "https://discord.com/api/oauth2/authorize?client_id=1090811431391334520&permissions=138513017936&scope=applications.commands%20bot";
    a.target = "_blank";
    a.click();
    a.remove();
}