let reviewSet = [];
let userCheck = false;

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
    console.log(username);
    return username.get("username");
}

const loadAccount = async function(){
  console.log("Loading Account");
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

  if (userStatus.user && userStatus.user.username === username){
    userCheck = true;
  } else {
    userCheck = false;
  }
  await loadReviews(username);
}

const loadReviews = async function(username){
  // console.log("Trying my best");
  try {
    const response = await fetch(`/reviews/${username}`);
    if (!response.ok)
      throw new Error("User Not Found");
    const data = await response.json();
    reviewSet = data;
  
    document.querySelector("#reviews-heading").textContent = username + "'s Reviews";

    const reviews = document.querySelector("#reviews");
    reviews.innerHTML = "";

    data.forEach(i => {
      const brk = document.createElement("br");
      const newReview = document.createElement("div");
      newReview.className = "review-card";
      
      const datePosted = document.createElement("div");
      datePosted.className = "timestamp";
      datePosted.innerText = i.datePosted;
      newReview.appendChild(datePosted);

      const title = document.createElement("h3");
      title.innerText = i.title + " (" + i.year + "):";
      newReview.appendChild(title);

      const blurb = document.createElement("p");
      blurb.innerText = "\"" + i.blurb + "\"";
      newReview.appendChild(blurb);

      const scoreTable = document.createElement("table")
      scoreTable.className = "nes-table is-bordered is-centered"
      scoreTable.innerHTML = `
                              <thead>
                                <tr>
                                  <th>Gameplay:</th>
                                  <th>Story:</th>
                                  <th>Visuals:</th>
                                  <th>Music:</th>
                                  <th>Overall:</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <th>${i.gameplayRating}/10</th>
                                  <th>${i.storyRating}/10</th>
                                  <th>${i.visualsRating}/10</th>
                                  <th>${i.musicRating}/10</th>
                                  <th>${i.overallRating}/10</th>
                                </tr>
                              </tbody>
                            `;
      newReview.appendChild(scoreTable);
      newReview.appendChild(brk);

      if (userCheck){
        const edit = document.createElement("button");
        edit.className = "nes-btn";
        edit.innerText = "Edit Contents";
        edit.addEventListener("click", () => {
          console.log("Editing Post " + i._id);
          editReview(i._id);
        });
        newReview.appendChild(edit);
        newReview.appendChild(brk);

        const deletion = document.createElement("button");
        deletion.className = "nes-btn";
        deletion.innerText = "Delete";
        deletion.addEventListener("click", () => {
          console.log("Deleting Post " + i._id);
          deleteReview(i._id);
        });
        newReview.appendChild(deletion);
      }

      reviews.appendChild(newReview);
    })
  } catch (error){
    console.error("Error Loading Profile: ", error);
    // window.location.href = "account.html";
  }
}

const editReview = function(id){
  // console.log("Editing Post Id: " + id);
  const auditedReview = reviewSet.find(i => i._id === id);
  if (!auditedReview)
    return console.error("ERROR: No Review Found");

  document.querySelector("#edit-title").innerText = auditedReview.title + " (" + auditedReview.year + ")";

  document.querySelector("#edit-blurb").value = auditedReview.blurb;
  document.querySelector("#edit-gameplayRating").value = auditedReview.gameplayRating;
  document.querySelector("#edit-storyRating").value = auditedReview.storyRating;
  document.querySelector("#edit-visualsRating").value = auditedReview.visualsRating;
  document.querySelector("#edit-musicRating").value = auditedReview.musicRating;

  document.querySelector("#submit-edit-button").dataset.id = id;
  
  document.querySelector("#edit-window").classList.remove("hidden");
}

const deleteReview = async function(id){
  const response = await fetch(`/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });

  if (response.ok){
    loadAccount();
  } else {
    console.error("ERROR: Error Deleting Review")
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadAccount();

  document.querySelector("#cancel-edit-button").addEventListener("click", () => {
    console.log("Cancelling Edit")
    document.querySelector("#edit-window").classList.add("hidden");
  })

  document.querySelector("#submit-edit-button").addEventListener("click", async (event) => {
    const id = event.target.dataset.id;
    console.log("Submitting Edit of Review " + id);

    const auditedReview = reviewSet.find(i => i._id === id);
    if (!auditedReview)
      return console.error("ERROR: No Review Found");

    const editedReview = {
      // title: auditedReview.title,
      // year: auditedReview.year,
      blurb: document.querySelector("#edit-blurb").value,
      gameplayRating: parseInt(document.querySelector("#edit-gameplayRating").value) || 0,
      storyRating: parseInt(document.querySelector("#edit-storyRating").value) || 0,
      visualsRating: parseInt(document.querySelector("#edit-visualsRating").value) || 0,
      musicRating: parseInt(document.querySelector("#edit-musicRating").value) || 0,
      // datePosted: auditedReview.datePosted
    }

    const response = await fetch(`/edit-review/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedReview)
    })

    if (response.ok){
      document.querySelector("#edit-window").classList.add("hidden");
      loadAccount();
    } else {
      console.error("ERROR: Error Modifying Review");
    }
  })
})
