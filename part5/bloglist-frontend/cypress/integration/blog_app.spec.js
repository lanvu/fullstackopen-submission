describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen',
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function () {
      cy.createBlog({
        title: 'a blog created by cypress',
        author: 'lan vu',
        url: 'lanvu.com',
      })

      cy.contains('a blog created by cypress')
    })

    it('Blogs are ordered according to likes', function () {
      cy.createBlog({
        title: 'a blog created by 1',
        author: 'lan vu',
        url: 'lanvu.com',
        likes: 1,
      })

      cy.createBlog({
        title: 'a blog created by 2',
        author: 'lan vu',
        url: 'lanvu.com',
        likes: 2,
      })

      cy.contains('view').click()
      cy.contains('likes 2')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'a blog created by cypress',
          author: 'lan vu',
          url: 'lanvu.com',
        })
      })

      it('it can be liked', function () {
        cy.contains('a blog created by cypress').contains('view').click()
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('it can be deleted', function () {
        cy.contains('a blog created by cypress').contains('view').click()
        cy.contains('remove').click()
        cy.contains('a blog created by cypress lan vu').should('not.exist')
      })

      it('it cannot be deleted by other user', function () {
        cy.contains('logout').click()
        const user = {
          name: 'Lan Vu',
          username: 'lanvu',
          password: 'secret',
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.visit('http://localhost:3000')
        cy.login({ username: 'lanvu', password: 'secret' })

        cy.contains('a blog created by cypress').contains('view').click()
        cy.contains('remove').should('not.exist')
      })
    })
  })
})
