let coinsCounter = document.getElementById("coins-counter")
let cpsTimer =document.getElementById("cps")

let stats = {
    coins: 0, 
    cps: 0 
}

document.addEventListener("DOMContentLoaded",  () =>    { 
    let storeStats = localStorage.getItem("stats")
    if (storeStats) {
        stats = JSON.parse(storeStats) 
    }
    updateUI()
})

function updateUI() {
    coinsCounter.textContent = `${stats.coins} coins`;
    cpsTimer.textContent = `per second: ${stats.cps}`
}

function saveStats() {
   let gameStats = JSON.stringify(stats);
   localStorage.setItem("stats", gameStats); 
}

const thePiggy = document.getElementById("the-piggy");   
thePiggy.addEventListener("click", addCoin);

function addCoin ()   {
    stats.coins++;
    updateUI();
    saveStats();
}

setInterval( () => {
    if (stats.cps === 0) return;
    stats.coins += stats.cps
    saveStats();
    updateUI();
}, 1000);
     
    
// fetch data from the API
async function getUpgrades()    {
    const shopUpgrades = await fetch ("https://cookie-upgrade-api.vercel.app/api/upgrades");
    const jsonUpgrades = await shopUpgrades.json();
    return (jsonUpgrades);
}

const wallStreet = document.getElementById("wall-street");

let upgrades = [];
let i = 1;
async function initUpgrades () {
    if (upgrades.length === 0)     {
   upgrades = await getUpgrades();
    }  if (i >= upgrades.length)   {
       wallStreet.disabled = true;
       let investUpgrade = document.getElementById("invest");
       investUpgrade.textContent =  "No more upgrades!";
       let incrCps = document.getElementById("incr-cps");
       incrCps.textContent = "Fully upgraded!";
       return;
    //   return (by itself) => stops the function to running anymore is called "early return"
    }
    if (stats.coins < upgrades[i].cost) {
       return; 
    }
       stats.coins -=upgrades[i].cost;
       stats.cps +=upgrades[i].increase;

       let investUpgrade = document.getElementById("invest");
       investUpgrade.textContent = `Invest ${upgrades[i].cost}`;
       let incrCps = document.getElementById("incr-cps");
       incrCps.textContent = `To get ${upgrades[i].increase}`;
       
       i++
       updateUI();
    }


wallStreet.addEventListener ("click", initUpgrades);
