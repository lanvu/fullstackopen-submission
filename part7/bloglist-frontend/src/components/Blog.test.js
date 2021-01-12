import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author, but not url and likes', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Lan Vu',
    url: 'https://github.com',
    likes: 10001,
  }

  const component = render(<Blog blog={blog} />)

  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  expect(component.container).toHaveTextContent('Lan Vu')
  expect(component.container).not.toHaveTextContent('https://github.com')
  expect(component.container).not.toHaveTextContent('10001')
})

test('clicking view button renders url and likes', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Lan Vu',
    url: 'https://github.com',
    likes: 10001,
  }

  const component = render(<Blog blog={blog} />)

  const button = component.getByText('view')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent('https://github.com')
  expect(component.container).toHaveTextContent('10001')
})

test('clicking like button twice calls event handler twice', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Lan Vu',
    url: 'https://github.com',
    likes: 10001,
  }

  const mockHandler = jest.fn()

  const component = render(<Blog blog={blog} updateBlog={mockHandler} />)

  const viewButton = component.getByText('view')
  fireEvent.click(viewButton)

  const likeButton = component.container.querySelector('#like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
