import { useState, useEffect } from 'react'
import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios
      .get(baseUrl)   
      .then(response => {   
        setPersons(response.data)      
      })
  }, [])

  const personsToShow = persons.filter(person => person.name.search(new RegExp(search, "i")) != -1)

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.find((person) => person.name === newName) != undefined) {
      alert(`${newName} is already added to phonebook`)
    }
    else {
      const newPerson = {
        name: newName,
        number: newNumber
      }

      axios
        .post(baseUrl, newPerson)
        .then(response => {
          setPersons(persons.concat(response.data))
        })
      setNewName('')
      setNewNumber('')
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
        <Filter value={search} onChange={handleSearchChange} />
      <h2>add new</h2>
      <PersonForm
        onSubmit={addPerson}
        name={newName}
        number={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  )
}

const Persons = ({persons}) => {
  return (
    <div>
      {persons.map(person => 
        <Person key={person.id} person={person} />
      )}
    </div>
  )
}

const Person = ({person}) => {
  return (
    <div>{person.name} {person.number}</div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
    <div>
      name: <input value={props.name} onChange={props.onNameChange} />
    </div>
    <div>
      number: <input value = {props.number} onChange={props.onNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
    </form>
  )
}

const Filter = (props) => {
  return (
    <div>
      filter shown with <input value={props.value} onChange={props.onChange}/>
    </div>
  )
}

export default App