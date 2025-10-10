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

    const user = await getUserStatus();
    if (!user.status){
        window.location.href = "login.html";
        return;
    }
    
    const username = getAccount() || user.user.username;

    const editButton = document.querySelector("#edit-button");
    if (user.user && user.user.username === username){
        editButton.addEventListener("click", () => {
            console.log("Editing Account " + user.user.username);
            editProfile(user.user);
        });
        editButton.classList.remove("hidden");
    } else {
        editButton.classList.add("hidden");
    }

    await loadAccountProfile(username);
}

const loadAccountProfile = async function(username){
    try {
        const response = await fetch(`/account/${username}`);
        if (!response.ok)
            throw new Error("User Not Found")
        const data = await response.json();

        document.querySelector("#profile-heading").textContent = username + "'s Reviews";
        
        document.querySelector("#account-username").textContent = data.username;
        document.querySelector("#account-pronouns").textContent = data.pronouns;
        document.querySelector("#account-bio").textContent = data.bio;

        const faves = document.querySelector("#account-faves")
        faves.innerHTML = "";
        if (data.faves && data.faves.length > 0){
            data.faves.forEach((i, j) => {
                if (i){
                    const fave = document.createElement("li");
                    fave.textContent = "Number " + j + ": " + i;
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
    document.querySelector("#edit-title").innerText = "Editing " + user.username + "'s Account";

    document.querySelector("#edit-pronouns").value = user.pronouns;
    document.querySelector("#edit-bio").value = user.bio;
    document.querySelector("#edit-fav-number-one").value = user.faves[1];
    document.querySelector("#edit-fav-number-two").value = user.faves[2];
    document.querySelector("#edit-fav-number-three").value = user.faves[3];
    document.querySelector("#edit-fav-number-four").value = user.faves[4];
    document.querySelector("#edit-fav-number-five").value = user.faves[5];

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
        loadReviews();
    } else {
        console.error("ERROR: Error Modifying Account");
    }
  })
})