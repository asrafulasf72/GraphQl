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

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    addUser(name: String!, age: Int!, skill:String!): User
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
    const newUser = {
      id: Date.now().toString(),
      name: args.name,
      age: args.age,
      skill: args.skill
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