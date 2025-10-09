let gameSet = [];

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

const loadGames = async function(){
  const response = await fetch("/reviews");
  if (!response.ok){
    window.location.href = "login.html";
    return;
  }
  
  const userStatus = await getUserStatus();
  if (userStatus.status)
    document.querySelector("#game-cluster-heading").textContent = userStatus.user.username + "'s Game Cluster";

  const logLink = document.querySelector("#log-link");
  logLink.onclick = async (event) => {
    event.preventDefault();
    await fetch("/logout", { method: "POST" });
    location.reload();
  }

  const data = await response.json();

  const cluster = document.querySelector("#game-cluster");
  cluster.innerHTML = "";

  const displayDropdown = document.querySelector("cluster-display-dropdown");
  const dataDropdown = document.querySelector("cluster-data-dropdown");

  switch(displayDropdown.value){
    case "bar":

        break;
    case "pie":
        
        break;
    case "bubble":
        
        break;
  }

  switch(dataDropdown.value){
    case "year":

        break;
    case "gameplayRating":
        
        break;
    case "storyRating":
        
        break;
    case "visualsRating":
        
        break;
    case "musicRating":
        
        break;
    case "overallRating":

        break;
  }

  data.forEach(i => {
    
  })
}

// onload
