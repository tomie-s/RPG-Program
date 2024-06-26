let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let monsterHealth;
let fighting;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
	{
		name: "stick",
		power: 5,
	},
	{
		name: "dagger",
		power: 30,
	},
	{
		name: "claw hammer",
		power: 50,
	},
	{
		name: "sword",
		power: 100,
	},
];

const monsters = [
	{
		name: "slime",
		level: 2,
		health: 15,
	},
	{
		name: "fanged beast",
		level: 8,
		health: 60,
	},
	{
		name: "dragon",
		level: 20,
		health: 300,
	},
];

const locations = [
	{
		name: "town square",
		"button text": ["Go to store", "Go to cave", "Fight dragon"],
		"button functions": [goStore, goCave, fightDragon],
		text: 'You are in the town square. You see a sign that says "Store."',
	},
	{
		name: "store",
		"button text": [
		"Buy 10 health (10 gold)",
		"Buy weapon (30 gold)",
		"Go to town                 square",
		],
		"button functions": [buyHealth, buyWeapon, goTown],
		text: "You entered the store.",
	},
	{
		name: "cave",
		"button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
		"button functions": [fightSlime, fightBeast, goTown],
		text: "You entered the cave. You see some monsters.",
	},
	{
		name: "fight",
		"button text": ["Attack", "Dodge", "Run"],
		"button functions": [attack, dodge, goTown],
		text: "You are fighting a monster.",
	},
	{
		name: "kill monster",
		"button text": [
		"Go to town square",
		"Go to town square",
		"Go to town square",
		],
		"button functions": [goTown, goTown, easterEgg],
		text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
	},
	{
		name: "lose",
		"button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
		"button functions": [restart, restart, restart],
		text: "You died.",
	},
	{
		name: "win",
		"button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
		"button functions": [restart, restart, restart],
		text: "You defeated the dragon! YOU WIN THE GAME!",
	},
    {
        name: "easter egg",
        "button text": ["2", "8", "Go to town square?"],
        "button functions": [pickTwo, pickEight, goTown],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
    }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

/**
 * Updates the UI elements with the provided location data.
 * @param {Object} location - The location object containing the data to update the UI.
 * @param {string[]} location["button text"] - An array of strings representing the text for each button.
 * @param {Function[]} location["button functions"] - An array of functions representing the click event handlers for each button.
 * @param {string} location.text - The text to be displayed in the text element.
 */
function update(location) {
	monsterStats.style.display = "None";
	button1.innerHTML = location["button text"][0];
	button2.innerHTML = location["button text"][1];
	button3.innerHTML = location["button text"][2];
	button1.onclick = location["button functions"][0];
	button2.onclick = location["button functions"][1];
	button3.onclick = location["button functions"][2];
	text.innerHTML = location.text;
}

/**
 * Executes the goTown function.
 *
 * This function updates the current location to the first location in the locations array.
 */
function goTown() {
  	update(locations[0]);
}
function goStore() {
  	update(locations[1]);
}

function goCave() {
  	update(locations[2]);
}

function buyHealth() {
	if (gold >= 10) {
		gold -= 10;
		health += 10;
		goldText.innerHTML = gold;
		healthText.innerHTML = health;
	} else {
		text.innerHTML = "You do not have enough gold to buy health.";
	}
}

/**
 * Buys a weapon if the player has enough gold and does not already have the most powerful weapon.
 */
function buyWeapon() {
	if (currentWeapon < weapons.length - 1) {
		if (gold >= 30) {
		gold -= 30;
		goldText.innerHTML = gold;
		currentWeapon++; // currentWeapon = currentWeapon + 1;
		goldText.innerHTML = gold;
		let newWeapon = weapons[currentWeapon].name;
		text.innerHTML = "You now have a " + newWeapon + ".";
		inventory.push(newWeapon);
		text.innerHTML += " In your inventory you have: " + inventory;
		} else {
		text.innerHTML = "You do not have enough gold to buy a weapon.";
		}
	} else {
		text.innerHTML = "You already have the most powerful weapon!";
		button2.innerHTML = "Sell weapon for 15 gold";
		button2.onclick = sellWeapon;
	}
}

function sellWeapon() {
	if (inventory.length > 1) {
		gold += 15;
		goldText.innerHTML = gold;
		let currentWeapon = inventory.shift(); // removes first element from array
		text.innerHTML = "You sold a " + currentWeapon + ".";
		text.innerHTML += " In your inventory you have: " + inventory;
	} else {
		text.innerHTML = "Don't sell your only weapon!";
	}
}

function fightSlime() {
	fighting = 0;
	goFight();
}

function fightBeast() {
	fighting = 1;
	goFight();
}

function fightDragon() {
	fighting = 2;
	goFight();
}

function goFight() {
	update(locations[3]);
	monsterHealth = monsters[fighting].health;
	monsterStats.style.display = "block";
	monsterNameText.innerHTML = monsters[fighting].name;
	monsterHealthText.innerHTML = monsterHealth;
}

function attack() {
	text.innerHTML = "The " + monsters[fighting].name + " attacks.";
	text.innerHTML += " You attack it with your " + weapons[currentWeapon].name + ".";

	if (isMonsterHit()) {
		health -= getMonsterAttackValue(monsters[fighting].level);
	} else {
		text.innerHTML += " You miss.";
	}

	monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
	healthText.innerHTML = health;
	monsterHealthText.innerHTML = monsterHealth;

	if (health <= 0) {
		lose();
	} else if (monsterHealth <= 0) {
		fighting === 2 ? winGame() : defeatMonster();
	}

	if (Math.random() <= 0.1 && inventory.length !== 1) {
		text.innerHTML += " Your " + inventory.pop() + " breaks.";
		currentWeapon--;
	}
}

function getMonsterAttackValue(level) {
	let hit = level * 5 - Math.floor(Math.random() * xp);
	console.log(hit);
	return hit;
}

function isMonsterHit() {
    return Math.random() > .2 || health < 20;
}

function dodge() {
  	text.innerHTML = "You dodge the attack from the " + monsters[fighting].name + ".";
}

function defeatMonster() {
	gold += Math.floor(monsters[fighting].level * 6.7);
	xp += monsters[fighting].level;
	goldText.innerHTML = gold;
	xpText.innerHTML = xp;
	update(locations[4]);
}

function lose() {
  	update(locations[5]);
}

function winGame() {
  	update(locations[6]);
}

function restart() {
	xp = 0;
	health = 100;
	gold = 50;
	currentWeapon = 0;
	inventory = ["stick"];
	goldText.innerHTML = gold;
	healthText.innerHTML = health;
	xpText.innerHTML = xp;
	goTown();
}

function easterEgg() {
  	update(locations[7]);
}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

function pick(guess) {
    let numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }

    text.innerHTML = "You picked " + guess + ". Here are the random numbers:\n";

    for (let i = 0; i < 10; i++) {
        text.innerHTML += numbers[i] + "\n";
    }

    if (numbers.indexOf(guess) !== -1) {
        text.innerHTML += "Right! You win 20 gold!";
        gold += 20;
        goldText.innerHTML = gold;
    } else {
        text.innerHTML += "Wrong! You lose 10 health!";
        health -= 10;
        healthText.innerHTML = health;
        if (health <= 0) {
            lose();
        }
    }
}
