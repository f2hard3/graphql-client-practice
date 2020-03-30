import 'dotenv/config';
import 'cross-fetch/polyfill';
import ApolloClient, { gql } from 'apollo-boost';
import { inspect } from 'util';

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: operation => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
      },
    });
  },
});

// const GET_ORGANIZATION = gql`
//   {
//     organization(login: "the-road-to-learn-react") {
//       name
//       url
//     }
//   }
// `;

const GET_ORGANIZATION = gql`
  query($organization: String!) {
    organization(login: $organization) {
      name
      url
      repositories(first: 5) {
        edges {
          node {
            name
            url
          }
        }
      }
    }
  }
`;

(async () => {
  const result = await client.query({
    query: GET_ORGANIZATION,
    variables: {
      organization: 'the-road-to-learn-react'
    }
  });
  console.log(inspect(result, true, 10));
})();


const ADD_STAR = gql`
  mutation AddStar($repositoryId: ID!) {
    addStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

(async () => {
  const result = await client.mutate({
    mutation: ADD_STAR,
    variables: {
      repositoryId: 'MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw==',
    }
  });
  console.log(inspect(result, true, 10));
})();
