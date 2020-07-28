import { gql } from "apollo-boost"
import React from "react"
import { Query } from "react-apollo"

// add some queries for retrieving all Lifts and all Trails
// language=GraphQL
const GET_TYPE_QUERY = gql`
  query GetType($name: String) {
    getType(name: $name) {
      id
      name
      pokemon {
        slot
        pokemon {
          name
          url
        }
      }
    }
  }
`

const Type = props => {
  const TypeCompomnent = ({ name }) => (
    <Query query={GET_TYPE_QUERY} variables={{ name }}>
      {({ loading, error, data }) => {
        if (loading) {
          return "Loading..."
        }
        if (error) return <div>`Error!: ${error}`</div>
        const type = data.getType

        return <div>{type.name}</div>
      }}
    </Query>
  )
  const { match } = props
  return (
    <div id="type">
      <h1>{match.params.name} TYPE</h1>
      <div className="container-fluid">
        <TypeCompomnent name={match.params.name} />
      </div>
    </div>
  )
}

export default Type
