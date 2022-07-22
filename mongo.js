const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const nameNewPerson = process.argv[3]

const numberNewPerson = process.argv[4]

const url =
  `mongodb+srv://leandro:${password}@cluster0.csz4w.mongodb.net/agenda-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String, 
  number: String
})

const Person = mongoose.model('Person', personSchema)

!nameNewPerson && !numberNewPerson ? getPersons() : createPerson(nameNewPerson, numberNewPerson)


function createPerson (name, number) {
  const person = new Person({
    name: name, 
    number: number,
  })
  
  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

function getPersons () {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}