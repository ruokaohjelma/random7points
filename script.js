// script.js
const cards = [
    "4Uancestralrecall", "3Ubraingeyser", "3Rdisintegrate", "3Rfireball",
    "3Bdemonictutor", "3Bmindtwist", "3Aloa", "3Asolring", "2Ucontrolmagic",
    "2Umanadrain", "1Ustealartifact", "2Warmageddon", "2Wbalance", "2Wlandtax",
    "2Wmoat", "2Babyss", "2Ablackvise", "2Alotus", "2Gmoxe", "2Bmoxj",
    "2Wmoxp", "2Rmoxr", "2Umoxs", "1Uamnesia", "1Urecall", "1Utimewalk",
    "1Utimetwister", "1Bdarkritual", "1Bhymntotourach", "1Wkarakas", "1Amaze",
    "1Aworkshop", "1Rearthquake", "1Rfallingstar", "1Rpyrotech", "1Rwheel",
    "1Aicy", "1Amanavault", "1Atrike", "1Awinterorb", "1Gregrowth", "1Gsylvan"
];

let selected = [];
let totalPoints = 0;
let colors = new Set();
let moxCards = [];
let karakasSelected = false;

// Get the points of a card
function getPoints(card) {
    return parseInt(card.split('')[0]);
}

// Get the color of a card
function getColor(card) {
    return card.charAt(1);
}

// Draw a card
function drawCard() {
    if (totalPoints >= 7) return;

    let availableCards = cards.filter(card => {
        let color = getColor(card);
        return colors.size < 3 || colors.has(color) || color === 'A';
    });

    if (availableCards.length === 0) return; // Prevent empty selection

    let randomIndex = Math.floor(Math.random() * availableCards.length);
    let card = availableCards[randomIndex];
    let points = getPoints(card);
    let color = getColor(card);

    // Handle Karakas rule
    if (card.includes("karakas")) {
        if (!checkKarakasRule()) {
            drawCard(); // Recurse to draw a new card if Karakas doesn't pass
            return;
        }
        karakasSelected = true;
    }

    // Handle Mox cards
    if (card.includes("mox")) {
        moxCards.push(card);
        if (colors.size === 0 || colors.has(color)) {
            colors.add(color);
        } else {
            return; // Prevent adding Mox card if color exceeds 3
        }
    }

    // Add card if points don't exceed limit
    if (totalPoints + points <= 7) {
        selected.push(card);
        totalPoints += points;
        colors.add(color);
    }

    displayCards();
}

// Check Karakas rule
function checkKarakasRule() {
    let whiteCards = selected.filter(c => getColor(c) === 'W').length;
    let nonWhiteCards = selected.length - whiteCards;

    // If Karakas is the third card and previous two are not both white, reject Karakas
    if (selected.length >= 3 && selected.slice(0, 2).filter(c => getColor(c) !== 'W').length >= 2) {
        return false;
    }

    // If there are fewer than 2 white cards after Karakas, reject Karakas
    if (whiteCards < 2) {
        return false;
    }

    return true;
}

// Reset game
function resetGame() {
    selected = [];
    totalPoints = 0;
    colors.clear();
    moxCards = [];
    karakasSelected = false;
    displayCards();
}

// Display selected cards
function displayCards() {
    const container = document.getElementById("cardContainer");
    container.innerHTML = "";

    selected.forEach(card => {
        let cardElement = document.createElement("div");
        cardElement.classList.add("card");

        let img = document.createElement("img");
        let fileName = card + ".png";
        img.src = "./" + fileName;
        img.alt = card;
        img.style.width = "250px";
        img.style.height = "auto";

        let pointsText = document.createElement("p");
        pointsText.innerText = getPoints(card) + " points";
        pointsText.style.textAlign = "center";
        pointsText.style.marginTop = "5px";

        cardElement.appendChild(img);
        cardElement.appendChild(pointsText);
        container.appendChild(cardElement);
    });

    // Display total points
    let pointsDisplay = document.getElementById("pointsDisplay");
    pointsDisplay.innerText = "Total Points: " + totalPoints;
}

// Initial setup
document.getElementById("drawCardButton").addEventListener("click", drawCard);
document.getElementById("resetButton").addEventListener("click", resetGame);
