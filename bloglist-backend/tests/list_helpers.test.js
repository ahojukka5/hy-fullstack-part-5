const listHelper = require('../utils/list_helpers')
const blogs = require('./testdata').blogs

describe('dummy', () => {
  test('returns always number 1', () => {
    expect(listHelper.dummy(blogs)).toBe(1)
  })
})

describe('totalLikes', () => {
  test('of empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })
  test('when list has only one blog equals the likes of that', () => {
    expect(listHelper.totalLikes([blogs[0]])).toBe(blogs[0].likes)
  })
  test('of a bigger list is calculated right', () => {
    expect(listHelper.totalLikes(blogs)).toBe(36)
  })
})

describe('favoriteBlog', () => {
  test('finds out which blog post has most likes', () => {
    expect(listHelper.favoriteBlog(blogs)).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
  test('throws an error if blog post list is empty list', () => {
    expect(() => listHelper.favoriteBlog([])).toThrow(Error)
  })
})

describe('mostBlogs', () => {
  test('finds who has written most of blogs', () => {
    expect(listHelper.mostBlogs(blogs)).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
  test('throws an error if blog list is empty', () => {
    expect(() => listHelper.mostBlogs([])).toThrow(Error)
  })
})

describe('mostLikes', () => {
  test('finds the author who has most likes total', () => {
    expect(listHelper.mostLikes(blogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
  test('throws an error if blog list is empty', () => {
    expect(() => listHelper.mostLikes([])).toThrow(Error)
  })
})
