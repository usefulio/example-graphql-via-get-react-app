import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import queryString from 'query-string';
import fetch from 'unfetch';
import omitBy from 'lodash/omitBy';
import isEmpty from 'lodash/isEmpty';

import gql from 'graphql-tag';

const customFetch = (uri, options) => {
  const { body, ...newOptions } = options;
  const parsedBody = JSON.parse(body);
  const command = omitBy(parsedBody, isEmpty);
  const requestedString = uri + "?" + queryString.stringify(command);
  return fetch(requestedString, newOptions);
};

const link = createHttpLink({
  uri: "https://staging-graphql.goseek.com/graphql",
  fetchOptions: { method: "GET" },
  fetch: customFetch
});

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)

registerServiceWorker();

const GROUP_QUERY = gql`
  query itwillwork{
    hotel(goSeekID:"105893d"){
      name
      id
    }
  }
`;

client.query({ query: GROUP_QUERY }).then(console.log);