const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Course {
    id: Int
    name: String
  }

  type Query {
    course(id: Int!): Course
  }

  type Mutation {
    addCourse(name: String!): Course
  }
`);

const courses = [{ id: 1, name: 'GraphQL Course' }];
let nextId = 2;

const root = {
  course: ({ id }) => courses.find(c => c.id === id),
  addCourse: ({ name }) => {
    const course = { id: nextId++, name };
    courses.push(course);
    return course;
  }
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));
app.listen(3003, () => console.log('GraphQL API running on port 3003'));
