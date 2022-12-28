const typeDefs = `#graphql
    interface ResponseObj {
        status: Int
        message: String
    }
    type Book implements ResponseObj{
        id: String
        title: String
        authorInfo: Author
        year: Int
        pages: Int
        category: BookCategory
        createdAt: String
        status: Int
        message: String
    }

    type AllBooks implements ResponseObj {
        status: Int
        message: String
        books: [Book]!
    }
 
    type Author{
        id: String
        name: String
        email: String
    }

    type BookCategory{
        category: String
        tags: [String!]
    }

    input NewBook{
        title: String!
        author: AuthorInput!,
        year: Int!
        pages: Int!
    }

    input AuthorInput{
        name: String!
        email: String!
    }

    type NewBookResponse implements ResponseObj {
        id: String
        status: Int!
        message: String!
    }
    

    type Query {
        fetchAllBooks(query: String): AllBooks
        findBook(title: String, author: String, year: Int, id: String): Book
    }

    type Mutation {
        addNewBook(book: NewBook!): NewBookResponse!
    }
`;

module.exports = typeDefs;