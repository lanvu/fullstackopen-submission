import React, { useState } from 'react'
import { useSubscription, useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState('books')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    },
  })

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => set.map((o) => o.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) },
      })
    }
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('login')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && (
          <button onClick={() => setPage('recommended')}>recommended</button>
        )}
        {token && <button onClick={() => logout()}>logout</button>}
      </div>

      <Notify errorMessage={errorMessage} />
      <Authors show={page === 'authors'} showEdit={Boolean(token)} />
      <Books show={page === 'books'} />

      {token && <NewBook show={page === 'add'} />}

      {token && <Recommended show={page === 'recommended'} />}

      {!token && (
        <LoginForm
          show={page === 'login'}
          setToken={setToken}
          setError={notify}
          setPage={setPage}
        />
      )}
    </div>
  )
}

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return <div style={{ color: 'red' }}>{errorMessage}</div>
}

export default App
