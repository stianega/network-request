/// <reference types="cypress" />

describe('Network Request', () => {
    beforeEach(() => {
        cy.visit('https://example.cypress.io/commands/network-requests')
        cy.server()
    })

    it('Get Request', () => {
        cy.route('GET', 'comments/*').as('getComment')

        cy.get('.network-btn').click()

        cy.wait('@getComment').its('status').should('eq', 200)
    })

    //mocking get request 
    it('Mocking get request', () => {
        cy.route({
            method: 'GET',
            url: 'comments/*',
            response: {
                "postId": 2,
                "id": 2,
                "name": "id labore ex et quam laborum",
                "email": "Eliseo@gardner.biz",
                "body": "Hello text ini di mocking"
            }
        }).as('getComment')

        cy.get('.network-btn').click()

        cy.wait('@getComment').its('status').should('eq', 200)
    })

    //POST REQUEST
    it('Post Request',()=>{
        cy.route('POST','comments').as('postComment')

        cy.get('.network-post').click()

        cy.wait('@postComment').then((xhr)=>{
            expect(xhr.requestBody).to.include('name')
            expect(xhr.requestHeaders).to.have.property('Content-Type')
            expect(xhr.responseBody).to.have.property('email','hello@cypress.io')
            expect(xhr.responseBody).to.have.property('id',501)
        })
    })

    //Mocking put error negative test
    it.only('Mocking put request',()=>{
        cy.route({
            method: 'PUT',
            url: 'comments/*',
            status: 404,
            delay: 500,
            response: {
                error: 'error'
            }
        }).as('putComment')

        cy.get('.network-put').click()

        cy.wait('@putComment')

        cy.get('.network-put-comment').should('contain','error')
    })
})