// let displayType = "bar";
let dataType = "overallRating";

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

const loadCluster = async function(){
    const userStatus = await getUserStatus();
    if (userStatus.status){
        document.querySelector("#game-cluster-heading").textContent = userStatus.user.username + "'s Game Cluster";
    } else {
        window.location.href = "login.html";
        return;
    }

    const logLink = document.querySelector("#log-link");
    logLink.onclick = async (event) => {
        event.preventDefault();
        await fetch("/logout", { method: "POST" });
        location.reload();
    }

    // document.querySelector("#cluster-display-dropdown").addEventListener("change", function(){
    //     displayType = this.value;
    //     loadChart();
    // });
    document.querySelector("#cluster-data-dropdown").addEventListener("change", function(){
        dataType = this.value;
        loadChart();
    });

    loadChart();
}

const loadChart = async function(){ 
    const cluster = document.querySelector("#game-cluster");
    cluster.innerHTML = "";
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 800);
    svg.setAttribute("height", 500);

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", "translate(60, 40)");
    svg.appendChild(g);

    cluster.appendChild(svg);

    try {
        const response = await fetch("/reviews");
        const data = await response.json();
        
        const margin = { top: 20, right: 30, bottom: 100, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        cluster.innerHTML = "";
        const svg = d3.select("#game-cluster")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
        
        const chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.title))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => parseFloat(d[dataType]))])
            .range([height, 0]);

        chartGroup.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.title))
            .attr("y", d => yScale(parseFloat(d[dataType])))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(parseFloat(d[dataType])))
            .attr("fill", "#ff9090")

        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "middle");

        chartGroup.append("g")
            .call(d3.axisLeft(yScale));

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(dataType);
    } catch (error){
        console.error("Error Loading Cluster: ", error);
    }
}

window.onload = async function(){
    loadCluster();
}
