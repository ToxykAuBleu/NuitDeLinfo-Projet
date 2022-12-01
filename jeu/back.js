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

var Gaetan = new Heros(10, 5, 2, "hb-heros");

instantiateHealthBar("hb-heros", "Perso");