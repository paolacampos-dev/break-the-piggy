
let coinsCounter = document.getElementById("coins-counter")
let cpsTimer =document.getElementById("cps")

let stats = {
    coins: 0, 
    cps: 0 
}

const wallStreet = document.getElementById("wall-street")
const investName = document.getElementById("invest-name")
const investUpgrade = document.getElementById("invest")
const incrCps = document.getElementById("incr-cps")

async function getUpgrades()    {
    const res = await fetch ("https://cookie-upgrade-api.vercel.app/api/upgrades")
    const jsonUpgrades = await res.json()
    return jsonUpgrades.map(upgrade => ({  // implicit return (returns becomes ()) (Map is a method to create a new array)
    ...upgrade,
    displayName: upgradeNameInvest[upgrade.name] ?? upgrade.name
  }));
}

let upgrades = [] // that variable hold the new array of objects returned by getUpgrades()
let i = 0

const upgradeNameInvest = {
  "Auto-Clicker": "Wall Street Intern",
  "Enhanced Oven": "Junior Investor",
  "Cookie Farm": "Trading Floor",
  "Robot Baker": "Hedge Fund",
  "Cookie Factory": "Investment Bank",
  "Magic Flour": "Central Bank",
  "Time Machine": "High-Frequency Trading",
  "Quantum Oven": "Quantum Fund",
  "Alien Technology": "Offshore Assets",
  "Interdimensional Baker": "Global Market Control"
};

// because needs the fetch needs to be async/await too
async function initUpgrades () {
    if (upgrades.length === 0) {  // length === 0 means empty (no elemtents in the array) this way just fetch once
    upgrades = await getUpgrades() // now the the new array is inside the upgrades
    }
    if (i >= upgrades.length)   {  // disable the button when are not more upgrades
            wallStreet.disabled = true
            investName.textContent = "Wall Street CONQUERED!"
            investUpgrade.textContent =  "No more upgrades"      
            incrCps.textContent = "Fully upgraded"
            return;
        }
        updateUpgradeUI()
      }

function updateUpgradeUI() {
    const upgrade = upgrades[i] // because array needs an index (objects use .properties)
    investName.textContent = upgrades[i].displayName
    investUpgrade.textContent = `Invest ${upgrades[i].cost} coins`
    incrCps.textContent = `To get ${upgrades[i].increase} more cps`
    //console.log("Fetched upgrades", upgrades)
}

document.addEventListener("DOMContentLoaded", async () =>    { 
    let storeStats = localStorage.getItem("stats")
    if (storeStats) {
        stats = JSON.parse(storeStats) 
    }
    i = Number(localStorage.getItem("upgradeIndex")) || 0;

    await initUpgrades()
    updateUI()    
})


function updateUI() {
    coinsCounter.textContent = `${stats.coins} coins`
    cpsTimer.textContent = `per second: ${stats.cps}`
}

function saveStats() {
   let gameStats = JSON.stringify(stats);
   localStorage.setItem("stats", gameStats) 
}

const thePiggy = document.getElementById("the-piggy")  
thePiggy.addEventListener("click", addCoin)

function addCoin ()   {
    stats.coins++
    updateUI()
    saveStats()
}

setInterval( () => {
    if (stats.cps === 0) return;
    stats.coins += stats.cps
    saveStats()
    updateUI()
}, 1000)
    
// everything after an arrow funcion as is an expression that is returned automatically and if return becomes implicit that expression is wrap in ()

wallStreet.addEventListener ("click", buyUpgrade)

 function buyUpgrade()   {
    const upgrade = upgrades[i]
        if(!upgrade) return;
        if (stats.coins < upgrade.cost) return; 
       
        stats.coins -=upgrade.cost
        stats.cps +=upgrade.increase

        i++            
        localStorage.setItem("upgradeIndex", i)
        saveStats()
        updateUI() 
        initUpgrades()
           
 }
        
     