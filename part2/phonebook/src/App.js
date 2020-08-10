import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import './App.css'

const Input = ({ label, value, onChange }) => {
  return (
    <div>
      {label} <input value={value} onChange={onChange} />
    </div>
  )
}

const PersonForm = ({
  onSubmit,
  valueName,
  onNameChange,
  valueNumber,
  onNumberChange
}) => {
  return (
    <form onSubmit={onSubmit}>
      <Input label={'name:'} value={valueName} onChange={onNameChange} />
      <Input label={'number:'} value={valueNumber} onChange={onNumberChange} />
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({ id, name, number, handleClick }) => {
  return (
    <p>
      {name} {number}
      <button onClick={() => handleClick(id, name)}>delete</button>
    </p>
  )
}

const Persons = ({ persons, handleClick }) => {
  return (
    <>
      {persons.map(person => (
        <Person key={person.id} {...person} handleClick={handleClick} />
      ))}
    </>
  )
}

const Notification = ({ status, message }) => {
  if (status === null) {
    return null
  } else if (status === 'error') {
    return <div className="error">{message}</div>
  } else {
    return <div className="success">{message}</div>
  }
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [notification, setNotification] = useState({
    status: null,
    message: ''
  })

  const resetNotification = () => {
    setTimeout(() => {
      setNotification({
        status: null,
        message: ''
      })
    }, 5000)
  }

  const getAllPersons = () => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }

  const addPerson = async event => {
    event.preventDefault()
    const savedPersons = await personService.getAll()
    const person = savedPersons.find(person => person.name === newName)

    if (person) {
      const changedPerson = { ...person, number: newNumber }
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(person.id, changedPerson)
          .then(() => {
            getAllPersons()
            setNotification({
              status: 'success',
              message: `Updated ${person.name}`
            })
            resetNotification()
          })
          .catch(error => {
            setNotification({
              status: 'error',
              message: error.response.data.error
            })
            resetNotification()
            getAllPersons()
          })
      }
    } else {
      personService
        .create({ name: newName, number: newNumber })
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNotification({
            status: 'success',
            message: `Added ${returnedPerson.name}`
          })
          resetNotification()
        })
        .catch(error => {
          setNotification({
            status: 'error',
            message: error.response.data.error
          })
          resetNotification()
        })
    }

    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService.deleteOne(id).then(() => {
        getAllPersons()
        setNotification({
          status: 'success',
          message: `Deleted ${name}`
        })
        resetNotification()
      })
    }
  }

  const handleNameChange = event => {
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = event => {
    setNewSearch(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(newSearch.toLowerCase())
  )

  useEffect(() => {
    getAllPersons()
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification {...notification} />

      <Input
        label={'filter shown with:'}
        value={newSearch}
        onChange={handleSearchChange}
      />

      <h3>add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        valueName={newName}
        onNameChange={handleNameChange}
        valueNumber={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleClick={deletePerson} />
    </div>
  )
}

export default App
