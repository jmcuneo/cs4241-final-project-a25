const loadUsers = async function(){
  const response = await fetch("/users");
  if (!response.ok){
    window.location.href = "login.html";
    return;
  }

  const logLink = document.querySelector("#log-link");
  logLink.onclick = async (event) => {
    event.preventDefault();
    await fetch("/logout", { method: "POST" });
    location.reload();
  }

  const data = await response.json();
  
  const users = document.querySelector("#users");
  users.innerHTML = "";

  data.forEach(i => {
    const user = document.createElement("li");
    user.innerText = i.username;
    users.appendChild(user);
  })
}

window.onload = async function(){
    loadUsers();
}