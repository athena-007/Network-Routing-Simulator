// ======================================
// OSPF Network Simulator
// ======================================

let numberOfRouters = 0;
let links = [];
let routerPositions = [];

let shortestPath = [];
let shortestDistance = 0;

const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");


const rect = canvas.getBoundingClientRect();
canvas.width = rect.width;
canvas.height = 600;

// ======================================
// HTML Elements
// ======================================

const createNetworkBtn = document.getElementById("createNetworkBtn");
const addLinkBtn = document.getElementById("addLinkBtn");
const findPathBtn = document.getElementById("findPathBtn");

const numRoutersInput = document.getElementById("numRouters");

const router1Input = document.getElementById("router1");
const router2Input = document.getElementById("router2");
const costInput = document.getElementById("cost");

const sourceInput = document.getElementById("sourceRouter");
const destinationInput = document.getElementById("destinationRouter");

const resultDisplay = document.getElementById("result");
const loadingCard = document.getElementById("loadingCard");

// ======================================
// Create Network
// ======================================

createNetworkBtn.addEventListener("click", () => {

    const routers = parseInt(numRoutersInput.value);

    if (isNaN(routers) || routers < 2) {
        alert("Enter at least 2 routers.");
        return;
    }

    numberOfRouters = routers;

    links = [];
    shortestPath = [];
    shortestDistance = 0;

    generateRouterPositions();

    drawNetwork();

    resultDisplay.innerHTML =
        "Network created successfully.<br>Add links to begin.";

});

// ======================================
// Add Link
// ======================================

addLinkBtn.addEventListener("click", () => {

    if (numberOfRouters === 0) {
        alert("Create a network first.");
        return;
    }

    const r1 = parseInt(router1Input.value);
    const r2 = parseInt(router2Input.value);
    const cost = parseInt(costInput.value);

    if (
        isNaN(r1) ||
        isNaN(r2) ||
        isNaN(cost)
    ) {
        alert("Fill all fields.");
        return;
    }

    if (
        r1 < 0 ||
        r2 < 0 ||
        r1 >= numberOfRouters ||
        r2 >= numberOfRouters
    ) {
        alert("Invalid router number.");
        return;
    }

    if (cost <= 0) {
        alert("Cost must be greater than zero.");
        return;
    }

    links.push({
        router1: r1,
        router2: r2,
        cost: cost
    });

    shortestPath = [];

    drawNetwork();

    router1Input.value = "";
    router2Input.value = "";
    costInput.value = "";

});

// ======================================
// Generate Router Positions
// ======================================

function generateRouterPositions() {

    routerPositions = [];

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const radius = Math.min(canvas.width, canvas.height) / 2 - 90;

    for (let i = 0; i < numberOfRouters; i++) {

        const angle = (2 * Math.PI * i) / numberOfRouters;

        routerPositions.push({

            x: centerX + radius * Math.cos(angle),

            y: centerY + radius * Math.sin(angle)

        });

    }

}

// ======================================
// Draw Entire Network
// ======================================

function drawNetwork() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawLinks();

    drawRouters();

}

// ======================================
// Draw Links
// ======================================

function drawLinks() {

    ctx.lineWidth = 3;

    links.forEach(link => {

        const p1 = routerPositions[link.router1];
        const p2 = routerPositions[link.router2];

        let highlight = false;

        for (let i = 0; i < shortestPath.length - 1; i++) {

            const a = shortestPath[i];
            const b = shortestPath[i + 1];

            if (
                (a === link.router1 && b === link.router2) ||
                (a === link.router2 && b === link.router1)
            ) {
                highlight = true;
            }

        }

        if (highlight) {

            ctx.strokeStyle = "#22c55e";

            ctx.shadowBlur = 20;

            ctx.shadowColor = "#22c55e";

        } else {

            ctx.strokeStyle = "#777";

            ctx.shadowBlur = 0;

        }

        ctx.beginPath();

        ctx.moveTo(p1.x, p1.y);

        ctx.lineTo(p2.x, p2.y);

        ctx.stroke();

        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;

        ctx.fillStyle = "red";
        ctx.font = "18px Arial";
        ctx.fillText(link.cost, mx, my);

    });

}

// ======================================
// Draw Routers
// ======================================

function drawRouters() {

    routerPositions.forEach((router, index) => {

        ctx.beginPath();

        ctx.arc(router.x, router.y, 28, 0, Math.PI * 2);

        ctx.fillStyle = "#2563eb";

        ctx.fill();

        ctx.lineWidth = 4;

        ctx.strokeStyle = "#ffffff";

        ctx.stroke();

        ctx.fillStyle = "white";

        ctx.font = "bold 18px Arial";

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.fillText(index, router.x, router.y);

    });

}

// ======================================
// Find Shortest Path
// ======================================

findPathBtn.addEventListener("click", async () => {

    if (numberOfRouters === 0) {
        alert("Create a network first.");
        return;
    }

    const source = parseInt(sourceInput.value);
    const destination = parseInt(destinationInput.value);

    if (isNaN(source) || isNaN(destination)) {
        alert("Enter source and destination.");
        return;
    }

    if (
        source < 0 ||
        destination < 0 ||
        source >= numberOfRouters ||
        destination >= numberOfRouters
    ) {
        alert("Invalid router number.");
        return;
    }

    loadingCard.style.display = "block";

    const edgeList = links.map(link => [
        link.router1,
        link.router2,
        link.cost
    ]);

    const networkData = {

        nodes: numberOfRouters,

        edges: edgeList,

        source: source,

        destination: destination

    };

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/route",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(networkData)

            }
        );

        const data = await response.json();

        loadingCard.style.display = "none";

        if (!response.ok) {

            resultDisplay.innerHTML =
                `<span class="error">${data.detail}</span>`;

            return;

        }

        shortestPath = data.path;

        shortestDistance = data.distance;

        drawNetwork();

        await animatePacket();

        resultDisplay.innerHTML = `

            <div class="success">

                <h2>Shortest Path Found</h2>

                <br>

                <strong>Distance :</strong>
                ${shortestDistance}

                <br><br>

                <strong>Path :</strong>

                ${shortestPath.join(" → ")}

            </div>

        `;

    }

    catch (error) {

        loadingCard.style.display = "none";

        console.error(error);

        resultDisplay.innerHTML =
            `<span class="error">
            Unable to connect to FastAPI Backend.
            </span>`;

    }

});

// ======================================
// Animate Packet
// ======================================

async function animatePacket() {

    if (shortestPath.length < 2)
        return;

    for (let i = 0; i < shortestPath.length - 1; i++) {

        const start =
            routerPositions[shortestPath[i]];

        const end =
            routerPositions[shortestPath[i + 1]];

        await animateEdge(start, end);

    }

}

// ======================================
// Animate One Edge
// ======================================

function animateEdge(start, end) {

    return new Promise(resolve => {

        let progress = 0;

        function animate() {

            drawNetwork();

            const x =
                start.x +
                (end.x - start.x) * progress;

            const y =
                start.y +
                (end.y - start.y) * progress;

            ctx.beginPath();

            ctx.arc(x, y, 10, 0, Math.PI * 2);

            ctx.fillStyle = "#22c55e";

            ctx.shadowBlur = 30;

            ctx.shadowColor = "#22c55e";

            ctx.fill();

            progress += 0.02;

            if (progress <= 1) {

                requestAnimationFrame(animate);

            }

            else {

                resolve();

            }

        }

        animate();

    });

}

// ======================================
// Reset Canvas
// ======================================

function resetSimulation() {

    shortestPath = [];

    shortestDistance = 0;

    drawNetwork();

}

// =====================================================
// PART 3 OF 3
// Paste this DIRECTLY BELOW Part 2.
// After this, your script.js is COMPLETE.
// =====================================================

// ======================================
// Resize Canvas Responsively
// ======================================

window.addEventListener("resize", () => {

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = 600;

    if (numberOfRouters > 0) {
        generateRouterPositions();
        drawNetwork();
    }

});

// ======================================
// Initialize Canvas
// ======================================

(function initializeCanvas() {

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = 600;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#666";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "Create a Network to Begin",
        canvas.width / 2,
        canvas.height / 2
    );

})();

// ======================================
// Optional Hover Effect
// ======================================

canvas.addEventListener("mousemove", (event) => {

    if (routerPositions.length === 0)
        return;

    const rect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let hovering = false;

    routerPositions.forEach((router) => {

        const dx = mouseX - router.x;
        const dy = mouseY - router.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 30)
            hovering = true;

    });

    canvas.style.cursor = hovering ? "pointer" : "default";

});

// ======================================
// Utility Functions
// ======================================

function clearInputs() {

    router1Input.value = "";
    router2Input.value = "";
    costInput.value = "";

    sourceInput.value = "";
    destinationInput.value = "";

}

function clearResults() {

    shortestPath = [];
    shortestDistance = 0;

    resultDisplay.innerHTML =
        "Waiting for input...";

}

function resetEverything() {

    numberOfRouters = 0;

    links = [];

    routerPositions = [];

    shortestPath = [];

    shortestDistance = 0;

    clearInputs();

    clearResults();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#666";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "Create a Network to Begin",
        canvas.width / 2,
        canvas.height / 2
    );

}

// ======================================
// Keyboard Shortcuts
// ======================================

document.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        if (
            document.activeElement === router1Input ||
            document.activeElement === router2Input ||
            document.activeElement === costInput
        ) {

            addLinkBtn.click();

        }

        if (
            document.activeElement === sourceInput ||
            document.activeElement === destinationInput
        ) {

            findPathBtn.click();

        }

    }

});

// ======================================
// Console Banner
// ======================================

console.log(
    "%cOSPF Network Simulator Ready",
    "color:#22c55e;font-size:18px;font-weight:bold;"
);

console.log("Frontend Loaded Successfully");
console.log("Waiting for user input...");

