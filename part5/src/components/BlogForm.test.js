import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(<BlogForm createBlog={createBlog} />)

  const titleInput = component.container.querySelector('#title')
  const authorInput = component.container.querySelector('#author')
  const urlInput = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(titleInput, {
    target: { value: 'testing of forms could be easier' },
  })
  fireEvent.change(authorInput, {
    target: { value: 'Lan Vu' },
  })
  fireEvent.change(urlInput, {
    target: { value: 'https://github.com' },
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls[0][0]).toStrictEqual({
    title: 'testing of forms could be easier',
    author: 'Lan Vu',
    url: 'https://github.com',
  })
})
