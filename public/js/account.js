const getUserStatus = async function(){
    try {
        const response = await fetch("/user");
        const session = await response.json();
        const statusUser = {
            status: session.status,
            user: session.user
        }
        return statusUser;
    } catch (error){
        console.error("Failed to Fetch User Status")
    }
}

const loadUser = async function(){
    const logLink = document.querySelector("#log-link");
    logLink.onclick = async (event) => {
        event.preventDefault();
        await fetch("/logout", { method: "POST" });
        location.reload();
    }

    const user = await getUserStatus();
    if (!user.status){
        window.location.href = "login.html";
        return;
    }
    
    const username = document.querySelector("#account-username");
    username.innerText = user.user.username;
}

window.onload = async function(){
    loadUser();
}