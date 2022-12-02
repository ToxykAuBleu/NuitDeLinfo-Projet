
function instantiateSpeechBubble(id, text, x, y, reverse) {
    const bubble = document.createElement("div");
    bubble.className = `speech-bubble-${id}`;
    const speech = document.createElement("p");
    speech.id = `speech-bubble`;
    speech.innerHTML = text;
    speech.style.position = "absolute";
    speech.style.top = `${y}px`;
    speech.style.left = `${x}px`;
    if (reverse) {
        // speech.style.transform = "scaleX(-1)";
        speech.style.backgroundImage = `url("sprite/bulle_reverse.png")`;
    }
    bubble.appendChild(speech);

    const currentDiv = document.getElementById("game");
    // document.body.insertBefore(bubble, currentDiv);
    currentDiv.appendChild(bubble)
}

function deleteSpeechBubble(id) {
    document.getElementsByClassName(`speech-bubble-${id}`)[0].remove();
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

function fleeAction() {
    ennemy.flee();
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

    async useAttack(attackId, ennemyId) {
        console.log("Heros utilise l'attaque :", this.attack[attackId].nom);
        ennemy.health -= this.attack[attackId].dmg;
        if (ennemy.health <= 0) {
            document.getElementById(`${ennemyId}-sprite`).remove();
            await sleep(1000);
            phase++;
            game()
            
        } else {
            ennemy.attackPlayer();
        }
        return ennemy;
    }

    heal() {
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
        if (Gaetan.health <= 0) {
            location.reload();
        }
    }

    async flee() {
        Gaetan.health -= this.attack;
        instantiateSpeechBubble("fleemess", "Tu ne peux pas me fuir !", 1000, 10, true);
        await sleep(2000);
        document.getElementsByClassName("speech-bubble-fleemess")[0].remove();
    }
}

class Game {
    constructor(ennemy) {
        this.ennemyToBeat = ennemy
    }

    startRound(xE, yE, hxE, hyE) {
        var game = document.getElementById("game");
        // game.style.backgroundImage = `url("${this.bgSource}")`;
        this.ennemyToBeat.instantiateSprite(xE, yE);
        this.ennemyToBeat.instantiateHealthBar(this.ennemyToBeat.objId["ClassDiv"]+"-sprite", hxE, hyE);
    }
}

var Gaetan = new Heros(10, 
    {
        Att1: {nom: "Anticorps", dmg: 2},
        Att2: {nom: "Tacos", dmg: 0},
        Att3: {nom: "Ruban adhésif", dmg: 0},
        Att4: {nom: "Sucette", dmg: 0}
    }, 2, 
    {
        GameDiv: "game",
        ClassDiv: "hb-heros",
        Sprite: "sprite/Perso_H_1.png",

    });

var ennemyId = "ennemy1";
var phase = 1;
var ennemy = new Ennemy(10, 1, 0, 
    {
        GameDiv: "game",
        ClassDiv: "ennemy1",
        Sprite: "sprite/Papillomnavirus.png"
    });

async function game() {
    var game = document.getElementById("game");
    var pablo = new Heros(1, 1, 1, {
        GameDiv: "game",
        ClassDiv: "pablo",
        Sprite: "sprite/Pablo34.png"
    });
    var dr = new Heros(1, 1, 1, {
        GameDiv: "game",
        ClassDiv: "docteur",
        Sprite: "sprite/Doc_Shen.png"
    })
    if (phase == 1) {
        game.style.backgroundImage = `url("sprite/Cimetiere.png")`;

        Gaetan.instantiateSprite(150, 550);
        Gaetan.instantiateHealthBar("hb-heros-sprite", 30, -50);

        pablo.instantiateSprite(1050, 550);
        pablo.instantiateHealthBar("pablo-sprite", 20, -20);

        instantiateSpeechBubble("heros1", "Pablo34, je jure de trouver la maladie qui a emporté ma femme ! Je jure de me venger !", 200, 450, false);
        await sleep(3000);
        // document.getElementsByClassName("speech-bubble-heros1")[0].remove();
        deleteSpeechBubble("heros1");

        instantiateSpeechBubble("pablo1", "Tu devrais tourner la page, allons plutôt te changer les idées en ville.", 650, 500, true);
        await sleep(3000);
        deleteSpeechBubble("pablo1");

        instantiateSpeechBubble("heros2", "Tu n’as pas tort …, j’essaierai de faire des efforts.", 200, 450, false);
        await sleep(3000);
        document.getElementById("game").removeChild(document.getElementsByClassName("pablo-sprite")[0]) // Supprimer pablo
        deleteSpeechBubble("heros2");

        game.style.backgroundImage = `url("sprite/Ruelle.png")`;
        while (game.firstChild) {
            game.removeChild(game.firstChild);
        }

        pablo.instantiateSprite(1050, 550);
        pablo.instantiateHealthBar("pablo-sprite", 20, -20);
        instantiateSpeechBubble("pablo1", "Oh mon dieu ! Qu’est-ce donc cela ?!? *fuit*", 850, 500, true);
        await sleep(3000);
        deleteSpeechBubble("pablo1");
        document.getElementById("game").removeChild(document.getElementsByClassName("pablo-sprite")[0])

        Gaetan.instantiateSprite(150, 550);
        Gaetan.instantiateHealthBar("hb-heros-sprite", 30, -50);
        instantiateSpeechBubble("heros1", "Je ne peux pas fuir ! Je vais devoir combattre … mais comment ?", 250, 450, false);
        await sleep(3000);
        deleteSpeechBubble("heros1");
    
        dr.instantiateSprite(300, 550);
        dr.instantiateHealthBar("docteur-sprite", 30, -50);
        instantiateSpeechBubble("dr1", "Bonjour, désolé de m’introduire si brusquement.", 300, 470, false);
        await sleep(3000);
        deleteSpeechBubble("dr1");
        instantiateSpeechBubble("dr2", "Je me présente je suis le doc Shen, et je suis un chercheur en IST.", 300, 470, false);
        await sleep(3000);
        deleteSpeechBubble("dr2");
        instantiateSpeechBubble("dr3", "Je souhaite que tu m’aides à récolter des infos sur les autres IST. Mais d’abord, tue moi celle-ci avec tes propres moyens. ", 300, 470, false);
        await sleep(5000);
        deleteSpeechBubble("dr3");

        game = new Game(ennemy);
        game.startRound(1000, 50, 85, 225);

    } else if (phase == 2) {

        Gaetan.health = 10;

        instantiateSpeechBubble("dr1", "Je te félicite, même si cela était très simple … Ce que tu viens de battre est un Papillomavirus.", 300, 470, false);
        await sleep(5000);
        deleteSpeechBubble("dr1");

        instantiateSpeechBubble("dr2", "C’est un virus qui était très répandu auparavant mais qui n’est plus dangereux de nos jours.", 300, 470, false);
        await sleep(5000);
        deleteSpeechBubble("dr2");

        instantiateSpeechBubble("dr3", "En effet, nous avons développé des anticorps contre celui-ci. Mais d’ailleurs jeune homme, quel est ton but ?", 300, 470, false);
        await sleep(5000);
        deleteSpeechBubble("dr3");

        instantiateSpeechBubble("heros1", "Je veux retrouver la maladie qui a emporté ma femme et lui régler son compte !", 250, 450, false);
        await sleep(4000);
        deleteSpeechBubble("heros1");

        instantiateSpeechBubble("dr4", "Je vois, allons à l’hôpital et décrivez moi cette maladie.", 300, 470, false);
        await sleep(4000);
        deleteSpeechBubble("dr4");

        game.style.backgroundImage = `url("sprite/Hopital.png")`;

        instantiateSpeechBubble("heros2", "*décrit la maladie*", 250, 450, false);
        await sleep(2000);
        deleteSpeechBubble("heros2");

        instantiateSpeechBubble("dr5", "Hmm, je vois, c’était sûrement un VIH, l’un des virus les plus dangereux au monde.", 300, 470, false);
        await sleep(4000);
        deleteSpeechBubble("dr5");

        instantiateSpeechBubble("dr6", "Il va falloir faire attention lors de ton combat. Suis-moi, je t'emmènerai à lui.", 300, 470, false);
        await sleep(4000);
        deleteSpeechBubble("dr6");

        game.style.backgroundImage = `url("sprite/Prairie.png")`;

        Gaetan.attack["Att1"] = {nom: "Anticorps", dmg: 0};
        Gaetan.attack["Att2"] = {nom: "Dioxyde de carbone", dmg: 0};
        Gaetan.attack["Att3"] = {nom: "Valaciclovir", dmg: 2};
        Gaetan.attack["Att4"] = {nom: "Paracétamol en poudre", dmg: 0};

        ennemyId = "ennemy2";

        ennemy = new Ennemy(10, 1, 0, 
            {
                GameDiv: "game",
                ClassDiv: "ennemy2",
                Sprite: "sprite/Herpes.png"
            });
        
        game = new Game(ennemy);
        game.startRound(1000, 50, 20, 130);

    } else if (phase == 3) {

        Gaetan.health = 10;

        instantiateSpeechBubble("dr1", "Beau combat ! L’IST que vous venez de rencontrer est l'herpès, cette maladie est moins dangereuse que les autres.", 300, 470, false);
        await sleep(4000);
        deleteSpeechBubble("dr1");

        instantiateSpeechBubble("dr2", "Elle fait seulement apparaître des cloques et des boutons  près de la bouche ou des organes génitaux, qui peuvent entraîner la mort mais bon …", 300, 470, false);
        await sleep(4000);
        deleteSpeechBubble("dr2");

        game.style.backgroundImage = `url("sprite/Riviere.png")`;

        Gaetan.attack["Att1"] = {nom: "Lopéramide chlorhydrate", dmg: 0};
        Gaetan.attack["Att2"] = {nom: "Benzylpenicilline", dmg: 2};
        Gaetan.attack["Att3"] = {nom: "Monoxyde de dihydrogène", dmg: 0};
        Gaetan.attack["Att4"] = {nom: "Chlorhexidine digluconate", dmg: 0};

        ennemyId = "ennemy3";

        ennemy = new Ennemy(10, 1, 0, 
            {
                GameDiv: "game",
                ClassDiv: "ennemy3",
                Sprite: "sprite/Syphilis.png"
            });
        
        game = new Game(ennemy);
        game.startRound(1000, 150, 20, 100);

    } else if (phase == 4) {

        Gaetan.health = 10;

        instantiateSpeechBubble("dr1", "Ce qu'on vient d'affronter, la syphilis, provoque des symptômes plutôt violents comme des ulcères, des éruptions cutanées ou de la fièvre.", 300, 470, false);
        await sleep(4000);
        deleteSpeechBubble("dr1");

        instantiateSpeechBubble("dr2", "La dernière étape est devant nous, j'espère que tu es prêt ...", 300, 470, false);
        await sleep(2000);
        deleteSpeechBubble("dr2");

        game.style.backgroundImage = `url("sprite/Volcan.png")`;

        instantiateSpeechBubble("heros1", "Pablo34 c’est toi ?? Où étais tu passé  ?? ", 250, 450, false);
        await sleep(2000);
        deleteSpeechBubble("heros1");

        pablo = new Heros(1, 1, 1, {
            GameDiv: "game",
            ClassDiv: "pablo",
            Sprite: "sprite/Pablo34.png"
        });

        pablo.instantiateSprite(1050, 550);
        pablo.instantiateHealthBar("pablo-sprite", 20, -20);

        instantiateSpeechBubble("pab1", "Il y a 60 ans, le VIH était invincible et ne faisait que se renforcer au cours du temps menant à la mort de milliers de personnes.", 650, 500, true);
        await sleep(4000);
        deleteSpeechBubble("pab1");

        instantiateSpeechBubble("heros2", "Mais de quoi tu parles ?? Je ne te reconnais plus ...", 250, 450, false);
        await sleep(2000);
        deleteSpeechBubble("heros2");

        instantiateSpeechBubble("dr3", "Mais, cette voix ... je la reconnais ... C’est celle du VIH !", 300, 470, false);
        await sleep(3000);
        deleteSpeechBubble("dr3");

        document.getElementById("game").removeChild(document.getElementsByClassName("pablo-sprite")[0])

        ennemyId = "ennemy4";

        Gaetan.attack["Att1"] = {nom: "Miracle", dmg: 10};
        Gaetan.attack["Att2"] = {nom: "Miracle", dmg: 10};
        Gaetan.attack["Att3"] = {nom: "Miracle", dmg: 10};
        Gaetan.attack["Att4"] = {nom: "Miracle", dmg: 10};

        ennemy = new Ennemy(10, 1, 0, 
            {
                GameDiv: "game",
                ClassDiv: "ennemy4",
                Sprite: "sprite/Sida.png"
            });

        instantiateSpeechBubble("dr4", "Oh purée de pomme de terre ! Bonne chance, je m’échappe ! *fuit*", 300, 470, false);
        await sleep(3000);
        deleteSpeechBubble("dr4");

        document.getElementById("game").removeChild(document.getElementsByClassName("docteur-sprite")[0]);

        game = new Game(ennemy);
        game.startRound(1000, 50, 20, 130);
    } else {

        instantiateSpeechBubble("heros1", "J’ai enfin vengé ma femme, merci de m’avoir aidé Doc !", 250, 450, false);
        await sleep(3000);
        deleteSpeechBubble("heros1");

        instantiateSpeechBubble("dr1", "*de loin* Haha, ce n'est rien !", 250, 450, true);
        await sleep(3000);
        deleteSpeechBubble("dr1");
        game = document.getElementById("game");
        while (game.firstChild) {
            game.removeChild(game.firstChild);
        }

        var final = document.createElement("h1");
        final.innerText = "Mettez des préservatifs, ça sauve des vies. 👍";
        game.appendChild(final);
    }
}

window.onload = async (event) => {
    await game();
}

