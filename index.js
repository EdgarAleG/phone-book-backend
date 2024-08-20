require('dotenv').config()
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require('./models/note');
const note = require('./models/note');

app.use(express.static("dist"));

const requestLogger = (request, response, next) => {
    const date = new Date()
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('Date: ', date.getHours(), ":",date.getMinutes(), ":", date.getSeconds())
    console.log('----------_')
    next()
}

app.use(cors());
app.use(express.json());
app.use(requestLogger);

morgan.token('body', (req) => { 
    if(req.method === 'PUT' && req.body) {
        return JSON.stringify(req.body);
    }
    return "";
})
app.use(morgan(":method :url :status - :response-time ms - :body"));

app.get("/", (request, response) => {
    response.send('<h1>Hola mundo</h1>');
})

app.get("/api/persons", (request, response) => {
    Person.find({}).then(personsList => {
        response.json(personsList);
    })
})

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                response.send(person);
            }
            else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})

app.get("/info", (request, response, next) => {
    Person.find({})
        .then(persons => {
            const personsLength = persons.length
            const date = new Date();
        const bodyResponse = `
            <p>There is ${personsLength} persons on phone book</p>
            <p>${date}</p>
        `
        response.send(bodyResponse)
        })
})

app.delete("/api/persons/:id", (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(person => {
            response.status(204).end();
        })
        .catch(error => next(error) )
})

app.post("/api/persons/", (request, response, next) => {
    const body = request.body;

    if(!body.name || !body.number) {
        console.log("error, missing name or number");
        return response.status(400).json({
            error: "content missing"
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(personSaved =>{
        response.json(personSaved);
    })
    .catch(error => {
        console.log(error.name)
        next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body

    Person.findByIdAndUpdate(
        request.params.id, 
        {name, number}, 
        {new: true, runValidators: true, context: 'query'}
    )
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))   
})

const unknownEndpint = (request, response) =>{
    response.status(404).send({error: "unknown endpoint"});
}
app.use(unknownEndpint);

const handleError = (error, request, response, next) => {
    console.log(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message})
    }
    
    next()
}
app.use(handleError)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})