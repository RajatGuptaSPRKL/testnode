
const bookTypeDefs = `
    type Book {
        title: String!
        author: String!
        year: Int!
        pages: Int!
        createdAt: String!
    }

    input NewBookInput {
        title: String
        author: String
        year: Int
        pages: Int
        createdAt: String
    }

    type AddNewBookResponse {
        status: Int!
        message: String!
    }

    type Query {
        getAllBooks: [Book],
        findBook(title: String!): Book!
    }

    type Mutation {
        addNewBook(title: String!, author: String!, year: Int!, pages: Int!, createdAt: String!): AddNewBookResponse!
    }
`;

module.exports = bookTypeDefs;