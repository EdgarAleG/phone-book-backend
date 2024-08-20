const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log("give password as argument")
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://notesAdmin:${password}@firstcluster.617pa.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=FirstCluster`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model("Person", personSchema)

if(process.argv.length === 3) {
    console.log("phonebook: \n");

    Person.find({}).then(result => {
        result.forEach(item => {
            console.log(item.name, item.number)
        })
        mongoose.connection.close()
    })

} else {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log("note saved: ", result)
        mongoose.connection.close()
    })
}