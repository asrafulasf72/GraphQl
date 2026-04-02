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

  input UpdateUserInput{
    id: ID!
    name: String
    age: Int
    skill: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    addUser( input: UserInput!): User
    deleteUser(id: ID!): Boolean
    updateUser(input: UpdateUserInput!): User
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
  },

  updateUser:(_,{input})=>{
      //  const {id,name,age,skill} = args.input  Jsut pass Argument args(This is one type of Update User resolver Function)

      //  const user = users.find(u=> u.id === id)
      //  if(!user) return null

      //  if(name !== undefined) user.name= name
      //  if(age !== undefined) user.age=age
      //  if(skill !== undefined) user.skill=skill

      const user = users.find(u=>u.id === input.id)
      if(!user) return null

      Object.keys(input).forEach(key=>{
         if(key !== "id" && input[key] !== undefined){
            user[key]=input[key]
         }
      })
      return user
    
  }
}
};

// Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});