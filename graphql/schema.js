const { buildSchema } = require("graphql");

exports.signupSchema = buildSchema(`

    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        email: String!
        name: String!
        password: String!
        status: String!
        posts: [Post!]!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input PostInputData {
        title : String!
        content : String!
        imageUrl : String!
    }
    
    type postData {
        posts: [Post!]!
        totalPosts: Int!
    }

    type rootQuery {
        login(email: String!, password: String!): AuthData 
        posts: postData!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(postInput : PostInputData): Post!
    }

    schema {
        query : rootQuery
        mutation : RootMutation
    }

`);


