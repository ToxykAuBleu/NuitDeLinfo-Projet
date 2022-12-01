/**
 * Instantie une barre de vie sur le site.
 * @param {String} id Id à donner au controleur de la barre de vie
 * @param {String} where Id de l'endroit à mettre la barre de vie
 */
function instantiateHealthBar(id, where) {
    const healthController = document.createElement("div");
    healthController.className = "healthbar-controler";
    healthController.id = `${id}-controler`;
    const healthValue = document.createElement("div");
    healthValue.className = "healthbar-value";
    healthValue.id = `${id}-value`;
    healthController.appendChild(healthValue);

    const currentDiv = document.getElementById(where);
    document.body.insertBefore(healthController, currentDiv);

}


function instantiateSpeechBubble(id, text, x, y) {
    const bubble = document.createElement("div");
    bubble.className = `speech-bubble-${id}`;
    const speech = document.createElement("p");
    speech.id = `speech-bubble`;
    speech.innerHTML = text;
    speech.style.position = "absolute";
    speech.style.top = `${y}px`;
    speech.style.left = `${x}px`;
    bubble.appendChild(speech);

    const currentDiv = document.getElementById("game");
    // document.body.insertBefore(bubble, currentDiv);
    currentDiv.appendChild(bubble)
}

/*
function draw() {
    var canvas = document.getElementById("game-canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        // ctx.fillStyle = 'rgb(200, 0, 0)';
        // ctx.fillRect(10, 10, 50, 50);

        // ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
        // ctx.fillRect(30, 30, 50, 50);

        let img = new Image();
        img.onload = function(){
            ctx.drawImage(img, 200, 200);
            ctx.font = '48px serif';
            ctx.fillText("Salut à tous les amis c'est bleu40", 0, 0)
        };
        img.src = "sprite/bulle.png";
    }
}
*/

/**
 * Met en attente pendant ms miliseconde.
 * @param {Integer} ms Nombre de temps à attendre en miliseconde
 * @returns Promise
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Entity {
    constructor(health, atk, def, objId) {
        this.health = health;
        this.maxHealth = health;
        this.attack = atk;
        this.defence = def;
        this.objId = objId;

        // Actualise la barre de vie en fonction de la vie actuelle
        window.setInterval(() => {
            var element = document.getElementById(`${this.objId}-controler`);
            var healthValueEl = element.getElementsByClassName("healthbar-value")[0];
            var value = this.health/this.maxHealth;
            healthValueEl.style.width = (value*element.clientWidth).toString()+"px";
        }, 100)
    }

    speak(textToSay) {
        console.log(textToSay);
    }


}

class Heros extends Entity { 
    constructor(health, atk, def, objId) {
        super(health, atk, def, objId)
    }
}

class Ennemy extends Entity { 
    constructor(health, atk, def, objId) {
        super(health, atk, def, objId)
    }
}

var Gaetan = new Heros(10, 
    {
        Att1: {nom: "Medicament 1", dmg: 2, worksOn: "id"},
        Att2: {nom: "Medicament 2", dmg: 4, worksOn: "id"}
    }, 2, "hb-heros");
window.onload = (event) => {
    instantiateHealthBar("hb-heros", "Perso");
}