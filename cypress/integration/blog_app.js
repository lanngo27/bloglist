const user = {
  name: 'Lan Ngo',
  username: 'lanngo',
  password: 'lanngo123'
}

const blog = {
  title: 'Another blog',
  author: 'Cypress',
  likes: 5
}

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3003')
  })

  it('Login form is shown', function () {
    cy.contains('Log in')
  })

  describe('login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('Log in').click()
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#login-button').click()

      cy.contains('Signed in as: Lan Ngo')
    })

    it('fails with wrong credentials', function () {
      cy.contains('Log in').click()
      cy.get('#username').type(user.username)
      cy.get('#password').type('lanngo1234')
      cy.get('#login-button').click()

      cy.contains('Invalid username or password')
        .and('have.css', 'color', 'rgb(132, 32, 41)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Signed in as: Lan Ngo')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: user.username, password: user.password })
    })

    it('A blog can be created', function () {
      cy.contains('Create a new blog').click()
      cy.get('#title').type('A new blog')
      cy.get('#author').type('Cypress')
      cy.get('#url').type('http://anewblog.com')

      cy.get('#blog-button').click()

      cy.contains('A new blog')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog(blog)
      })

      it('it can be likes', function () {
        cy.contains(`${blog.title}`).click()

        cy.contains('5')
        cy.contains('Like').click()
        cy.contains('6')
      })

      it('people can comment about it', function () {
        cy.contains(`${blog.title}`).click()

        cy.get('#newcomment').type('Test comment')
        cy.get('#newcomment-button').click()

        cy.contains(`Added a comment for blog ${blog.title}`)
        cy.contains('Test comment')
      })
    })

    describe('Several blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({
          ...blog,
          title: 'Cypress blog with 10 likes',
          likes: 10
        })
        cy.createBlog({
          ...blog,
          title: 'Cypress blog with 0 likes',
          likes: 0
        })
        cy.createBlog({
          ...blog,
          title: 'Cypress blog with 20 likes',
          likes: 20
        })
      })

      it('they are ordered by number of likes', function () {
        cy.get('.bloglist').should('have.length', 3)

        cy.get('.bloglist').then(function (bloglist) {
          expect(bloglist[0]).to.contain('Cypress blog with 20 likes')
          expect(bloglist[1]).to.contain('Cypress blog with 10 likes')
          expect(bloglist[2]).to.contain('Cypress blog with 0 likes')
        })
      })
    })
  })
})
