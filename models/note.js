const mongoose = require('mongoose')

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URI
//----------connection
mongoose.connect(url)
    .then(note => {
        console.log("connedted to mongodb")
    })
    .catch(err => {
        console.log("failed to connect!!")
    })

//----schema creation
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: [true, 'User phone name is required']
    },
    number: { 
        type: String,
        minLength: 8,
        required: [true, 'User phone number is required'],
        validate: { 
            validator: function(v) { 
                return /^\d{2,3}-\d+$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number`
        }
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)