import * as http from "http";
import * as Url from "url";

let server = http.createServer();

let port: number | string | undefined = process.env.PORT;
if (port == undefined)
    port = 5001;

console.log("server starting on port:" + port);

server.listen(port);
server.addListener("request", handleRequest);

function handleRequest(_request: http.IncomingMessage, _response: http.ServerResponse): void {
    console.log("What's up?");

    _response.setHeader("content-type", "text/html; charset=utf-8");
    _response.setHeader("Access-Control-Allow-Origin", "*");

    if (_request.url) {
        console.log(_request);
        let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);

        let jsonObj: any = {};
        for (let key in url.query) {

            if (isJson(url.query[key])) {
                // @ts-ignore
                jsonObj[key] = JSON.parse(url.query[key])
            } else {
                jsonObj[key] = url.query[key]
            }
        }

        let jsonString: string = JSON.stringify(jsonObj);
        _response.write(jsonString);
    }

    _response.end();
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
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
