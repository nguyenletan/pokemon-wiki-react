import React from "react"
import { render } from "react-dom"
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "react-apollo"
import "./index.scss"
import App from "./App"
import * as serviceWorker from "./serviceWorker"

const { registerObserver } = require("react-perf-devtool")

const options = {
  shouldLog: false,
  port: 3000,
}

const callback = () => {
  // do something with the measure
}

registerObserver(options, callback)

// uri: "http://localhost:4000/graphql",
// uri: 'http://10.128.240.30:4000/graphql/',
// react-apollo gives us access to the client which should point to // our api endpoint which we built earlier.
const client = new ApolloClient({
  uri: "https://pokemon-wiki-apollo.herokuapp.com/graphql",
  // uri: "http://localhost:4000/graphql",
  request: operation => {
    operation.setContext({
      headers: {
        authorization: `Bearer your-personal-access-token`,
      },
    })
  },
})

const rootElement = document.getElementById("root")

window.onload = () => {
  render(
    <ApolloProvider client={client} connectToDevTools>
      <App />
    </ApolloProvider>,
    rootElement
  )
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()
