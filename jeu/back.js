
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

function attackMenu() {
    var attack = document.getElementsByClassName("attack")[0]
    while (attack.firstChild) {
        attack.removeChild(attack.firstChild);
    }
    for (const [key, value] of Object.entries(Gaetan.attack)) {
        // console.log(key, value, value["nom"]);
        var button = document.createElement("button");
        button.name = value["nom"];
        button.innerText = value["nom"];
        button.onclick = function() {
            console.log(value["nom"]);
            Gaetan.useAttack(key, ennemyId)
            switchMenu();
        }
        var attack = document.getElementsByClassName("attack")[0];
        attack.appendChild(button);
    };
}

function healAction() {
    Gaetan.heal(ennemyId);
}

function switchMenu() {
    var select = document.getElementsByClassName("select")[0];
    var attack = document.getElementsByClassName("attack")[0];
    if (select.style.visibility == "visible") {
        attackMenu();
        select.style.visibility = "hidden";
        attack.style.visibility = "visible";
        select.className = "menu-off select";
        attack.className = "menu-on attack";
    } else {
        attack.style.visibility = "hidden";
        select.style.visibility = "visible";
        attack.className = "menu-off attack"
        select.className = "menu-on select"
    }
}

/**
 * Met en attente pendant ms miliseconde.
 * @param {Integer} ms Nombre de temps à attendre en miliseconde
 * @returns Promise
 */
async function sleep(ms) {
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
            if (document.getElementsByClassName(`${this.objId["ClassDiv"]}-sprite`).length != 0) {
                var element = document.getElementById(`${this.objId["ClassDiv"]}-controler`);
                var healthValueEl = element.getElementsByClassName("healthbar-value")[0];
                var value = this.health/this.maxHealth;
                healthValueEl.style.width = (value*element.clientWidth).toString()+"px";
            }
        }, 100);
    }
    

    speak(textToSay) {
        console.log(textToSay);
    }

    instantiateSprite(x, y) {
        var game = document.getElementById(this.objId["GameDiv"]);
        var sprite = document.createElement("div");
        sprite.className = `${this.objId["ClassDiv"]}-sprite`;
        sprite.id = `${this.objId["ClassDiv"]}-sprite`;
        sprite.style.backgroundImage = `url("${this.objId["Sprite"]}")`;
        sprite.style.position = "absolute";
        sprite.style.top = `${y}px`;
        sprite.style.left = `${x}px`;
        sprite.style.backgroundSize = "cover";

        game.appendChild(sprite);
    }

    /**
     * Instantie une barre de vie sur le site.
     * @param {String} id Id à donner au controleur de la barre de vie
     * @param {String} where Id de l'endroit à mettre la barre de vie
     */
    instantiateHealthBar(where, x, y) {
        const healthController = document.createElement("div");
        healthController.className = "healthbar-controler";
        console.log(this.objId["ClassDiv"]);
        healthController.id = `${this.objId["ClassDiv"]}-controler`;
        const healthValue = document.createElement("div");
        healthValue.className = "healthbar-value";
        healthValue.id = `${this.objId["ClassDiv"]}-value`;
        healthController.appendChild(healthValue);

        healthController.style.position = "absolute";
        healthController.style.top = `${y}px`;
        healthController.style.left = `${x}px`;

        const currentDiv = document.getElementById(where);
        currentDiv.appendChild(healthController);
    }

}

class Heros extends Entity { 
    constructor(health, atk, def, objId) {
        super(health, atk, def, objId)
    }

    useAttack(attackId, ennemyId) {
        console.log("Heros utilise l'attaque :", this.attack[attackId].nom);
        ennemy.health -= this.attack[attackId].dmg;
        if (ennemy.health <= 0) {
            document.getElementById(`${ennemyId}-sprite`).remove();
        } else {
            ennemy.attackPlayer();
        }
        return ennemy;
    }

    heal(ennemyId) {
        console.log("Heros se soigne.");
        Gaetan.health = this.maxHealth;
        document.getElementsByClassName("select")[0].children[2].disabled = true;
        // ennemy.attackPlayer();
        return ennemy;
    }
}

class Ennemy extends Entity { 
    constructor(health, atk, def, objId) {
        super(health, atk, def, objId)
    }

    attackPlayer() {
        Gaetan.health -= this.attack;
    }
}

class Game {
    constructor(bgSource, ennemy) {
        this.bgSource = bgSource;
        this.ennemyToBeat = ennemy
    }

    startRound(xE, yE, hxE, hyE) {
        var game = document.getElementById("game");
        game.style.backgroundImage = `url("${this.bgSource}")`;
        this.ennemyToBeat.instantiateSprite(xE, yE);
        this.ennemyToBeat.instantiateHealthBar(this.ennemyToBeat.objId["ClassDiv"]+"-sprite", hxE, hyE);
    }
}

var Gaetan = new Heros(10, 
    {
        Att1: {nom: "Naturel", dmg: 2, worksOn: ["id"]},
        Att2: {nom: "Benzatine pénicilline G", dmg: 0, worksOn: ["id"]},
        Att3: {nom: "Zovirax", dmg: 0, worksOn: ["id"]},
        Att4: {nom: "Vaccin Bexsero", dmg: 0, worksOn: ["id"]}
    }, 2, 
    {
        GameDiv: "game",
        ClassDiv: "hb-heros",
        Sprite: "sprite/Perso_H_1.png",

    });

var ennemyId = "ennemy1";

var ennemy = new Ennemy(10, 1, 0, 
    {
        GameDiv: "game",
        ClassDiv: "ennemy1",
        Sprite: "sprite/Papillomnavirus.png"
    });

async function game() {
    // instantiateSpeechBubble("mess1", "Salut moi c'est martin", 420, 200);
    Gaetan.instantiateSprite(150, 550);
    Gaetan.instantiateHealthBar("hb-heros-sprite", 30, -50);

    // await sleep(4000);

    game = new Game("sprite/Cimetiere.png", ennemy);
    game.startRound(1000, 50, 85, 225);
    
}


window.onload = async (event) => {
    await game();
}

