"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var Url = require("url");
var server = http.createServer();
var port = process.env.PORT;
if (port == undefined)
    port = 5001;
console.log("server starting on port:" + port);
server.listen(port);
server.addListener("request", handleRequest);
function handleRequest(_request, _response) {
    console.log("What's up?");
    _response.setHeader("content-type", "text/html; charset=utf-8");
    _response.setHeader("Access-Control-Allow-Origin", "*");
    if (_request.url) {
        console.log(_request);
        var url = Url.parse(_request.url, true);
        var jsonObj = {};
        for (var key in url.query) {
            if (isJson(url.query[key])) {
                // @ts-ignore
                jsonObj[key] = JSON.parse(url.query[key]);
            }
            else {
                jsonObj[key] = url.query[key];
            }
        }
        var jsonString = JSON.stringify(jsonObj);
        _response.write(jsonString);
    }
    _response.end();
}
function isJson(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}
//Hier Sophie's Code:
/*
async function submitButtonHandler(_event:Event): Promise <void> {
    console.log("submitButton");
    let query: URLSearchParams = new URLSearchParams();
    query.append("effects", JSON.stringify(addedEffects));
    query.append("recipeSteps", JSON.stringify(recipeSteps));
    const response: Response = await fetch("https://eia-hfu.herokuapp.com/?" + query.toString());
    const data = await response.json()
    alert(JSON.stringify(data));
    console.log(query.toString());
}*/
//# sourceMappingURL=server.js.map