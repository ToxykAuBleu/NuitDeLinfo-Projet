
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
            var element = document.getElementById(`${this.objId["ClassDiv"]}-controler`);
            var healthValueEl = element.getElementsByClassName("healthbar-value")[0];
            var value = this.health/this.maxHealth;
            healthValueEl.style.width = (value*element.clientWidth).toString()+"px";
        }, 100)
    }

    speak(textToSay) {
        console.log(textToSay);
    }

    instantiateSprite(x, y) {
        var game = document.getElementById(this.objId["GameDiv"]);
        var sprite = document.createElement("div");
        sprite.className = "heros-sprite";
        sprite.id = "heros-sprite";
        sprite.style.backgroundImage = `url("${this.objId["HeroSprite"]}")`;
        sprite.style.position = "absolute";
        sprite.style.top = `${y}px`;
        sprite.style.left = `${x}px`;

        game.appendChild(sprite);
    }

    /**
     * Instantie une barre de vie sur le site.
     * @param {String} id Id à donner au controleur de la barre de vie
     * @param {String} where Id de l'endroit à mettre la barre de vie
     */
    instantiateHealthBar(where) {
        const healthController = document.createElement("div");
        healthController.className = "healthbar-controler";
        healthController.id = `${this.objId["ClassDiv"]}-controler`;
        const healthValue = document.createElement("div");
        healthValue.className = "healthbar-value";
        healthValue.id = `${this.objId["ClassDiv"]}-value`;
        healthController.appendChild(healthValue);

        // healthController.style.position = "absolute";
        // healthController.style.top = `${y}px`;
        // healthController.style.left = `${x}px`;

        const currentDiv = document.getElementById(where);
        currentDiv.appendChild(healthController);
    }

}

class Heros extends Entity { 
    constructor(health, atk, def, objId) {
        super(health, atk, def, objId)
    }

    useAttack(attackId) {
        console.log("Heros utilise l'attaque :", this.attack[attackId].nom);
    }
}

class Ennemy extends Entity { 
    constructor(health, atk, def, objId) {
        super(health, atk, def, objId)
    }
}

var Gaetan = new Heros(10, 
    {
        Att1: {nom: "Medicament 1", dmg: 2, worksOn: ["id"]},
        Att2: {nom: "Medicament 2", dmg: 4, worksOn: ["id"]},
        Att3: {nom: "Medicament 3", dmg: 6, worksOn: ["id"]}
    }, 2, 
    {
        GameDiv: "game",
        ClassDiv: "hb-heros",
        HeroSprite: "sprite/perso.png",

    });


window.onload = (event) => {
    Gaetan.instantiateSprite(420, 200);
    Gaetan.instantiateHealthBar("heros-sprite");
}