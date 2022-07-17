const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(express.static('build'))

morgan.token('person', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url - :response-time ms :person'))

app.use(cors())

let persons = [
  { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
  },
  { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
  },
  { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
  },
  { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
  }
]

function generateRandomId() {
  min = Math.ceil(100);
  max = Math.floor(999999);
  return Math.floor(Math.random() * (max - min) + min);
}

function checkNewPerson (newPerson) {
  let errorMessage = ''

  if (newPerson.name === '' || newPerson.number === ''){
    errorMessage = 'Wrong name or number'
  }

  if (persons.some((element) => element.name === newPerson.name)){
    errorMessage = 'name must be unique'
  }

  return errorMessage
}

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date}</p>
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {

  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  
  person ? response.json(person) : response.status(404).end()

})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {

  const person = request.body
  const errorMessage = checkNewPerson(person)

  if (errorMessage === ''){
    person.id = generateRandomId()
    persons = persons.concat(person)
    response.json(person).status(201).end()
  } else {
    response.json({ error: errorMessage }).status(400).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})