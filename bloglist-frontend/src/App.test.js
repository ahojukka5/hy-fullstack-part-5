import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, waitForElement } from '@testing-library/react'
import App from './App'
jest.mock('./services/blogs')

afterEach(cleanup)

describe('<App />', () => {
  test('does not show any blogs without logging in', async () => {
    const component = render(<App />)
    await waitForElement(() => component.getByText('login'))
    expect(component.container).not.toHaveTextContent('Blogs')
  })
  test('shows a list of blogs for logged users', async () => {
    const user = {
      username: 'tester',
      token: '1231231214',
      name: 'Donald Tester'
    }

    let savedItems = {}
    const localStorageMock = {
      setItem: (key, item) => {
        savedItems[key] = item
      },
      getItem: key => {
        return savedItems[key]
      },
      clear: () => {
        savedItems = {}
      }
    }
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    localStorage.setItem('loggedBloglistUser', JSON.stringify(user))

    const component = render(<App />)
    await waitForElement(() => component.getByText('Blogs'))
    expect(component.container).toHaveTextContent('Blogs')
  })
})
