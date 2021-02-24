import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import _ from 'lodash'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const allbooksResult = useQuery(ALL_BOOKS)
  const [getBooks, result] = useLazyQuery(ALL_BOOKS)

  const [books, setBooks] = useState([])
  const [genre, setGenre] = useState(null)
  const [genres, setGenres] = useState([])

  useEffect(() => {
    if (allbooksResult.data && allbooksResult.data.allBooks && !genre) {
      const allBooks = allbooksResult.data.allBooks
      setBooks(allBooks)
      const genres = _.uniq(allBooks.flatMap((b) => b.genres))
      setGenres(genres)
    }
  }, [allbooksResult.data, genre])

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
    }
  }, [result])

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const onGenreClick = (newGenre) => {
    setGenre(newGenre)
    getBooks({
      variables: {
        genre: newGenre,
      },
    })
  }

  return (
    <div>
      <h2>books</h2>
      <p>
        in genre <b>{genre || 'all genres'}</b>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => onGenreClick(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => onGenreClick(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
