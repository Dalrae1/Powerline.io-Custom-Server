require('dotenv').config();
const { SnakeFunctions } = require("./modules/EntityFunctions.js");
const Server = require("./modules/Server.js");
const fs = require("fs");
const DatabaseFunctions = require("./modules/DatabaseFunctions.js");
const Bot = require("./modules/Bot.js");

DBFunctions = new DatabaseFunctions();

global.getString = function (data, bitOffset) {
    var nick = "";
    while (true) {
        var charCode = data.getUint16(bitOffset, true);
        bitOffset += 2;
        if (0 == charCode) break;
        nick += String.fromCharCode(charCode);
    }
    return { string: nick, offset: bitOffset };
}


customPlayerColors = {
    "Dracula": {
        customHead: ``,
        customBody: `
            context.shadowColor = 'rgba(255,0,0, 1)';
            context.lineWidth = (w)*this.snakeScale;
			context.strokeStyle = 'rgba(0,0,0, 1)';
			this.drawTail(this.renderedPoints, context);
            shadowBlur = 0;
        `,
        customTail: ``
    },
    "Sun": {
        customHead: ``,
        customBody: `
        context.strokeStyle = 'rgba(255, 235, 161, 1)';
        context.shadowColor = 'rgba(227, 182, 18, 1)';
        let point = this.renderedPoints[0];
        let gradient = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, w*this.snakeScale*5);
        gradient.addColorStop(0, 'rgba(227, 182, 18,1)');
        gradient.addColorStop(1, 'rgba(227, 182, 18,0)');
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(point.x, point.y, w*this.snakeScale*5, 0, Math.PI * 2);
        context.fill();
        `,
        customTail: ``
    }
}

defaultConfig = {
    "ConfigType": 160,
    "ArenaSize": 300,
    "DefaultZoom": 2,
    "MinimumZoom": 1.5,
    "MinimumZoomScore": 100,
    "ZoomLevel2": 10,
    "GlobalWebLag": 90,
    "GlobalMobileLag": 60,
    "OtherSnakeDelay": 40,
    "IsTalkEnabled": 1,

    "FoodValue": 1.5, 
    "UpdateInterval": 100,
    "MaxBoostSpeed": 255,
    "MaxRubSpeed": 200,
    "DefaultLength": 10,
}

UPDATE_EVERY_N_TICKS = 3;
SCORE_MULTIPLIER = 10/defaultConfig.FoodValue


var obj;

Servers = []

fs.readFile('./servers.json', 'utf8', function (err, data) {
    if (err) return console.error("Error reading servers.json: ", err);
    let servers = JSON.parse(data);
    servers.forEach(server => {
        Servers[server.id] = new Server(server);
    })
    console.log("servers.json loaded");
});