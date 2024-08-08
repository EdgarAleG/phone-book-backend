const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(express.json());

morgan.token('body', (req) => { 
    if(req.method === 'POST' && req.body) {
        return JSON.stringify(req.body);
    }
    return "";
})
app.use(morgan(":method :url :status - :response-time ms - :body"));

   
const bodyPage = `
 <h1>TItulo</h1>
 <p>Este es un parrafo</p>
 <h2>este un subtitulo</h2>
`;

let personsList = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/", (request, response) => {
    response.send(bodyPage);
})

app.get("/api/persons", (request, response) => {
    response.json(personsList);
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = personsList.find(item => item.id === id);
    if(!person) {
        return response.status(404).json({
            error: "person doesn't exist"
        })
    }

    response.send(person);
})

app.get("/info", (request, response) => {
    const personsLength = personsList.length;
    const date = new Date();
    const bodyResponse = `
        <p>There is ${personsLength} persons on phone book</p>
        <p>${date}</p>
    `
    response.send(bodyResponse)
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    personsList = personsList.filter(item => item.id !== id);

    response.status(204).end();
})

app.post("/api/persons/", (request, response) => {
    const body = request.body;

    if(!body.name || !body.number) {
        console.log("error, missing name or number");
        return response.status(400).json({
            error: "content missing"
        });
    }
    const existName = personsList.find(item => item.name === body.name);
    const existNumber = personsList.find(item => item.number === body.number);
    if(existName || existNumber) {
        console.log("error, this name o number already exist");
        return response.status(400).json({
            error: "this name or number already exist"
        });
    }

    const person = {
        id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number,
    }

    personsList = personsList.concat(person);

    //app.use(morgan(":method :url :status - :response-time ms :body"));
    
    response.json(person);
    
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})