// initial state or default state (setting up the game's state)
let stats;
let storedStats = localStorage.getItem("stats");

// exclamation sign turns the value into a truthy/falsy meaning (missing, empty, null, undefined, false)
// check if there is any score store
if (!storedStats) {
    // first time playing
    stats = {
        coinsCount: 0,
        cps: 0,
    };

// store the score for the first time
    let gameStats = JSON.stringify(stats)
    localStorage.setItem("stats", gameStats);  

    } else  {
    // loads the existing stats
    stats = JSON.parse(storedStats)
    }

// save the update stats
function saveStats ()   {
    let gameStats = JSON.stringify(stats);
    localStorage.setItem("stats", gameStats);
}


const thePiggy = document.getElementById("the-piggy");   
thePiggy.addEventListener("click", addCoin);


setInterval( () => {
    stats.coinsCount += stats.cps; 
    saveStats();
    updateCounters();
}, 1000);


 
function updateCounters()   {
    let coinsCounter = document.getElementById("coins-counter");
    coinsCounter.textContent = `${stats.coinsCount} Coins`;
    let cps = document.getElementById("cps");
    cps.textContent = `per second ${stats.cps}`;
    }


function addCoin ()   {
    stats.coinsCount++;
    updateCounters();
    saveStats();
}

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

    if (stats.coinsCount < upgrades[i].cost) {
       return; 
    }
       stats.coinsCount -=upgrades[i].cost;
       stats.cps +=upgrades[i].increase;

       let investUpgrade = document.getElementById("invest");
       investUpgrade.textContent = `Invest ${upgrades[i].cost}`;
       let incrCps = document.getElementById("incr-cps");
       incrCps.textContent = `To get ${upgrades[i].increase}`;
       
       i++
       updateCounters();
    }


wallStreet.addEventListener ("click", initUpgrades);