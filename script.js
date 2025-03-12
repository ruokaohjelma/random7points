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
let lastMoxColor = null; // Keep track of the last Mox card color
let nextCardMustMatchColor = false; // Flag for ensuring the next card matches the Mox color
let whiteCardSelected = false; // Flag to track if a white card has been selected

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
        return !selected.includes(card); // Ensure no duplicate cards
    });

    if (availableCards.length === 0) return; // Prevent empty selection

    let card = null;
    
    if (nextCardMustMatchColor) {
        // If next card must match color, pick cards of the same color
        availableCards = availableCards.filter(c => getColor(c) === lastMoxColor || getColor(c) === 'G');
        if (availableCards.length === 0) {
            drawCard(); // No valid options, recurse
            return;
        }
    }

    // If Mox is Green, 50/50 chance for the next color match
    if (lastMoxColor === 'G' && Math.random() < 0.5) {
        availableCards = availableCards.filter(c => getColor(c) === 'G' || !selected.includes(c));
    }

    // Check if the card is Karakas and if the white card condition is met
    availableCards = availableCards.filter(card => {
        if (card.includes("karakas") && !whiteCardSelected) {
            return false; // Prevent Karakas if no white card has been selected
        }
        return true;
    });

    let randomIndex = Math.floor(Math.random() * availableCards.length);
    card = availableCards[randomIndex];
    
    let points = getPoints(card);
    let color = getColor(card);

    // If Mox card is selected, update tracking variables
    if (card.includes("mox")) {
        moxCards.push(card);
        lastMoxColor = color; // Set the color of the last selected Mox
        nextCardMustMatchColor = true; // Ensure the next card matches this color
        if (color === 'W') {
            whiteCardSelected = true; // Mark white card as selected if it's a white Mox
        }
    } else if (color === 'W') {
        whiteCardSelected = true; // Mark white card as selected if it's any white card
    } else {
        nextCardMustMatchColor = false; // Reset flag if non-Mox card is drawn
    }

    // Add card if points don't exceed limit
    if (totalPoints + points <= 7) {
        selected.push(card);
        totalPoints += points;
    }

    // If the last card is a Mox and any previous cards don't match, redraw the last Mox
    if (selected.length >= 2 && card.includes("mox") && selected.length === 7) {
        let isValid = selected.every(c => getColor(c) === lastMoxColor || getColor(c) === 'G');
        if (!isValid) {
            selected.pop(); // Remove the last Mox
            totalPoints -= points; // Subtract its points
            drawCard(); // Redraw the Mox card
            return;
        }
    }

    displayCards();
}

// Reset game
function resetGame() {
    selected = [];
    totalPoints = 0;
    colors.clear();
    moxCards = [];
    lastMoxColor = null; // Reset last Mox color
    nextCardMustMatchColor = false; // Reset flag
    whiteCardSelected = false; // Reset white card selection flag
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
