import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

afterEach(cleanup)

describe('<Blog />', () => {
  const data = {
    author: 'John Doe',
    title: 'Who is J-o-h-n D-o-e anyway?',
    likes: 5
  }
  test('shows suppressed information about a blog by default', () => {
    const component = render(<Blog blog={data} />)
    expect(component.container).toHaveTextContent(data.author)
    expect(component.container).toHaveTextContent(data.title)
    expect(component.container).not.toHaveTextContent(data.likes)
  })
  test(
    'shows extra information about a blog when expanded by clicking ' +
      'the name of the blog',
    () => {
      const component = render(<Blog blog={data} />)
      const div = component.container.querySelector('div > div > div')
      fireEvent.click(div)
      expect(component.container).toHaveTextContent(data.likes)
    }
  )
})
