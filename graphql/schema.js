const { buildSchema } = require("graphql");

exports.signupSchema = buildSchema(`

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


exports.opertaionSchema = buildSchema(`

    input inputOperationSchema {
        num1 : Int!
        num2 : Int!
    }

    type operation {
        resolveOperation(userInput : inputOperationSchema): Int!
    }

    type rootQuery {
        hello : String!
    }

    schema {
        query : rootQuery
        mutation : operation
    }

`);