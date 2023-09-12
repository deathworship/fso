import { useState, useEffect } from 'react'

import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

import phonebook from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    phonebook
      .getAll() 
      .then(phonebookEntries => {
        setPersons(phonebookEntries)
      })
  }, [])

  const personsToShow = persons.filter(person => person.name.search(new RegExp(search, "i")) != -1)

  const addPerson = (event) => {
    event.preventDefault()
    const found = persons.find((person) => person.name === newName)

    if (found != undefined) {
      if (found.number === newNumber) {
        alert(`${newName} is already added to phonebook`)
      }
      else if (confirm(`${found.name} is already added to phonebook, replace the old number with a new one?`)){
        const newPerson = {
          name: found.name,
          number: newNumber
        }
        phonebook
          .updateNumber(found.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== found.id ? p : returnedPerson))
            setNotification({ type: 'info', message: `Changed number of ${found.name}` })
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setNotification({ type: 'error', message: `Information of ${found.name} has already been removed from server` })
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            setPersons(persons.filter(p => p.id !== found.id))
          })
      }
    }
    else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      phonebook
        .createEntry(newPerson)
        .then(response => {
          setPersons(persons.concat(response))
          setNotification({ type: 'info', message: `Added ${newName}` })
          setTimeout(() => {
            setNotification(null)
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setNotification({ type: 'error', message: error.response.data.error })
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
    }
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (confirm(`Delete ${person.name}?`)) {
      phonebook
        .deleteEntry(id)
        .then(status => {
          if (status === 200) {
            setPersons(persons.filter(p => p.id !== id))
            setNotification({ type: 'info', message: `Removed ${person.name}` })
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          }
        })
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
      <Notification notification={notification} />
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
      <Persons persons={personsToShow} onDeleteEntry={deletePerson} />
    </div>
  )
}

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  return (
    <div className={notification.type}>
      {notification.message}
    </div>
  )
}

export default App