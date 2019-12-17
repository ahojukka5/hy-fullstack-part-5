import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, fireEvent } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'

afterEach(cleanup)

describe('<SimpleBlog />', () => {
  const blog = {
    author: 'John Doe',
    title: 'Who is J-o-h-n D-o-e anyway?',
    likes: 5
  }

  test('renders content', () => {
    const component = render(<SimpleBlog blog={blog} />)
    expect(component.container).toHaveTextContent(blog.author)
    expect(component.container).toHaveTextContent(blog.title)
    expect(component.container).toHaveTextContent(blog.likes)
  })

  test('increases likes by 2, when "like" button is pressed two times', () => {
    const mockHandler = jest.fn()
    const component = render(<SimpleBlog blog={blog} onClick={mockHandler} />)
    const button = component.container.querySelector('button')
    fireEvent.click(button)
    fireEvent.click(button)
    expect(mockHandler.mock.calls.length).toBe(2)
  })
})
