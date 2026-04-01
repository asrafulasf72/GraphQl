const { ApolloServer, gql } = require("apollo-server");
const users = require("./data");

// Schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    age: Int!
    skill: String!
  }

  input UserInput {
     name: String!
     age: Int!
     skill: String!
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    addUser( input: UserInput!): User
    deleteUser(id: ID!): Boolean
  }
`;

// Resolver
const resolvers = {
  Query: {
    users: () => users,

    user: (_, args) => {
      return users.find(u => u.id === args.id);
    }
  },

 Mutation: {
  addUser: (_, args) => {
    const {name, age,skill}=args.input
    const newUser = {
      id: Date.now().toString(),
      name,
      age,
      skill
    };

    users.push(newUser);
    return newUser;
  },

  deleteUser: (_, args) => {
    const index = users.findIndex(u => u.id === args.id);

    if (index === -1) return false;

    users.splice(index, 1);
    return true;
  }
}
};

// Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});