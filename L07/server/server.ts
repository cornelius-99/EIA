import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";


const uri = process.env.MONGODB_URL;
const client = new Mongo.MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
let recipes: Mongo.Collection;

startHTTPServer();
startDBConnection();

function startHTTPServer() {
    let server: Http.Server = Http.createServer();

    let port: number | string | undefined = process.env.PORT;
    if (port == undefined)
        port = 5001;

    console.log("Server starting on port:" + port);

    server.listen(port);
    server.addListener("request", handleRequest);
}

function startDBConnection() {
    client.connect(() => {
        console.log("connected to database");
        recipes = client.db("eia2").collection("hexenkessel");
    });
}

async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
    console.log("What's up?");

    _response.setHeader("content-type", "application/json; charset=utf-8");
    _response.setHeader("Access-Control-Allow-Origin", "*");

    if (_request.url) {

        let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);

        if (url.query["type"] === "post") {
            let recipe: any = JSON.parse(<string>url.query["recipe"]);
            await recipes.insertOne(recipe);

            let jsonString: string = JSON.stringify(recipe);
            _response.write(jsonString);
        } else if (url.query["type"] === "get") {
            const allRecipes = await recipes.find().toArray();
            _response.write(JSON.stringify(allRecipes));
        }
    }

    _response.end();
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

