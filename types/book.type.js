const typeDefs = `#graphql
    
    scalar EmailAddress

    type BookSuccessResponse {
        books: [Book]!
        status: Int!
        message: String!
    }

    type BookErrorResponse {
        status: Int!
        message: String!
    }
    
    type Book{
        id: String
        title: String
        authorInfo: Author
        year: Int
        pages: Int
        category: BookCategory
        createdAt: String
    }

    union AllBooks = BookSuccessResponse | BookErrorResponse
 
    type Author{
        id: String
        name: String
        email: EmailAddress
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
        email: EmailAddress!
    }

    type NewBookResponse {
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