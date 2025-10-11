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

const getAccount = function(){
    const username = new URLSearchParams(window.location.search);
    return username.get("username");
}

const loadAccount = async function(){
    const logLink = document.querySelector("#log-link");
    logLink.onclick = async (event) => {
        event.preventDefault();
        await fetch("/logout", { method: "POST" });
        location.reload();
    }

    const userStatus = await getUserStatus();
    if (!userStatus.status){
        window.location.href = "login.html";
        return;
    }
    
    const username = getAccount() || userStatus.user.username;

    const editButton = document.querySelector("#edit-button");
    if (userStatus.user && userStatus.user.username === username){
        try {
            const response = await fetch(`/account/${userStatus.user.username}`);
            account = await response.json();
            editButton.addEventListener("click", () => {
                // console.log("Editing Account " + userStatus.user.username);
                editProfile(account);
            });
            editButton.classList.remove("hidden");
        } catch (error){
            console.error("Failed to Load User Data", error);
        }
    } else {
        editButton.classList.add("hidden");
    }

    await loadProfile(username);
}

const loadProfile = async function(username){
    try {
        const response = await fetch(`/account/${username}`);
        if (!response.ok)
            throw new Error("User Not Found")
        const data = await response.json();

        document.querySelector("#profile-heading").textContent = username + "'s Account";
        
        document.querySelector("#account-username").textContent = data.username;
        document.querySelector("#account-pronouns").textContent = data.pronouns;
        document.querySelector("#account-bio").textContent = data.bio;

        const faves = document.querySelector("#account-faves")
        faves.innerHTML = "";
        if (data.faves && data.faves.length > 0){
            data.faves.forEach((i, j) => {
                if (i){
                    const fave = document.createElement("li");
                    const rank = j + 1
                    fave.textContent = "Number " + rank + ": " + i;
                    faves.appendChild(fave);
                }
            });
        }
    } catch (error){
        console.error("Error Loading Profile: ", error);
        window.location.href = "users.html";
    }
}

const editProfile = function(user){
    document.querySelector("#edit-title").innerText = "Editing " + user.username + "'s Profile";

    document.querySelector("#edit-pronouns").value = user.pronouns;
    document.querySelector("#edit-bio").value = user.bio;
    if (user.faves && user.faves.length > 0) {
        document.querySelector("#edit-fav-number-one").value = user.faves[0];
        document.querySelector("#edit-fav-number-two").value = user.faves[1];
        document.querySelector("#edit-fav-number-three").value = user.faves[2];
        document.querySelector("#edit-fav-number-four").value = user.faves[3];
        document.querySelector("#edit-fav-number-five").value = user.faves[4];
    }

    // document.querySelector("#submit-edit-button").dataset.id = user.id;
    
    document.querySelector("#edit-window").classList.remove("hidden");
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadAccount();

  document.querySelector("#cancel-edit-button").addEventListener("click", () => {
    console.log("Cancelling Edit")
    document.querySelector("#edit-window").classList.add("hidden");
  })

  document.querySelector("#submit-edit-button").addEventListener("click", async () => {
    const user = await getUserStatus();
    console.log("Submitting Edit of Account " + user.user.username);

    const editedAccount = {
        pronouns: document.querySelector("#edit-pronouns").value,
        bio: document.querySelector("#edit-bio").value,
        faves: [
            document.querySelector("#edit-fav-number-one").value,
            document.querySelector("#edit-fav-number-two").value,
            document.querySelector("#edit-fav-number-three").value,
            document.querySelector("#edit-fav-number-four").value,
            document.querySelector("#edit-fav-number-five").value
        ]
    }

    const response = await fetch(`/edit-account/${user.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedAccount)
    })

    if (response.ok){
        document.querySelector("#edit-window").classList.add("hidden");
        loadAccount();
    } else {
        console.error("ERROR: Error Modifying Account");
    }
  })
})