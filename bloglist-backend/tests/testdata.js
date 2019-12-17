module.exports = {
  users: [
    {
      _id: '5db6f7ac3826a24ba8a35926',
      name: 'Test User',
      username: 'test',
      passwordHash:
        '$2b$10$X5XMaU.gD.UcH16pXAUQmu72ccuU7vdV3kK3G.ucHJ8i396GFXcYq',
      __v: 0,
      blogs: ['5a422a851b54a676234d17f7']
    },
    {
      _id: '5db80f789cd7f77c48a67aa5',
      name: 'Another Test User',
      username: 'test2',
      passwordHash:
        '$2b$10$kmUr3P6/L7LpupHc2hSQo.vZGNA3HqDgm8jV1zx2OjZVRQeRdYuVK',
      __v: 0,
      blogs: ['5a422aa71b54a676234d17f8']
    }
  ],
  blogs: [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0,
      user: '5db6f7ac3826a24ba8a35926'
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url:
        'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
      user: '5db80f789cd7f77c48a67aa5'
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url:
        'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url:
        'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      __v: 0
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0
    }
  ]
}
