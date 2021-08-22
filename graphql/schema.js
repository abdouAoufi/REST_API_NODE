const { buildSchema } = require("graphql");

module.exports = buildSchema(`

    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createAt: String!
        updateAt: String!
    }

    type User {
        _id: ID!
        email: String!
        name: String!
        password: String!
        status: String!
        posts: [Post!]!
    }

    type rootQuery {
        hello : String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }


    schema {
        query : rootQuery
        mutation : RootMutation
    }
`);