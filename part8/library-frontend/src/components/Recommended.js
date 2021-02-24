import React from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommended = (props) => {
  const booksResult = useQuery(ALL_BOOKS)
  const meResult = useQuery(ME)

  if (!props.show || !booksResult.data || !meResult.data) {
    return null
  }

  const genre = meResult.data.me.genre
  const recommendedBooks = booksResult.data.allBooks.filter((b) =>
    b.genres.includes(genre)
  )

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{genre}</b>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended
