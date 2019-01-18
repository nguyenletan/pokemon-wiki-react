import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.scss';

// react-apollo gives us access to the client which should point to // our api endpoint which we built earlier.
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql/',
  request: operation => {
    operation.setContext({
      headers: {
        authorization: `Bearer your-personal-access-token`
      }
    });
  }
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,

  document.getElementById('root')
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
