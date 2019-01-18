import { gql } from 'apollo-boost';
import React from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Row
} from 'reactstrap';
import Helpers from '../helpers/Helpers';
import SmallSkeleton from './SmallSkeleton';

// add some queries for retrieving all Lifts and all Trails
// language=GraphQL
const ALL_POKEMONS_QUERY = gql`
  query {
    getPokemons {
      name
      url
      id
    }
  }
`;

// language=GraphQL
const GET_POKEMON_QUERY = gql`
  query getPokemon($id: Int) {
    getPokemon(id: $id) {
      id
      name
      types {
        slot
        type {
          url
          name
        }
      }
    }
  }
`;

const PokemonDetail = ({ id }) => (
  <Query query={GET_POKEMON_QUERY} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading) {
        return <SmallSkeleton/>;
      }
      if (error) return `${error}`;
      const pokemon = data.getPokemon;
      const imgId = () => {
        if (pokemon.id < 10) {
          return `00${pokemon.id}`;
        }
        if (pokemon.id < 100) {
          return `0${pokemon.id}`;
        }
        return `${pokemon.id}`;
      };
      // const imgSrc = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${imgId()}.png`;
      const imgSrc = `https://db.pokemongohub.net/images/official/full/${imgId()}.png`;
      
      return (
        <Card className="pokemon">
          <CardImg top width="100%" src={imgSrc} alt={pokemon.name}/>
          <CardBody>
            <CardTitle
              className="text-capitalize text-danger font-weight-bold">
              {pokemon.id}. {pokemon.name}
            </CardTitle>
            <CardText>
              This is a
              <Link
                className={`type-background  ${
                  pokemon.types[0].type.name
                  }-background`}
                to={`/type/${pokemon.types[0].type.name}`}
              >
                {Helpers.toCapitalize(pokemon.types[0].type.name)}
              </Link>
              {pokemon.types[1] ? (
                <Link
                  className={`type-background  ${
                    pokemon.types[1].type.name
                    }-background`}
                  to={`/type/${pokemon.types[1].type.name}`}
                >
                  {Helpers.toCapitalize(pokemon.types[1].type.name)}
                </Link>
              ) : null}{' '}
              type pokemon.
            </CardText>
            <Link to={`/pokemon/${pokemon.id}`}>
              <Button className="" outline size="sm" color="success">
                <strong>View</strong>
              </Button>
            </Link>
          </CardBody>
        </Card>
      );
    }}
  </Query>
);

const PokemonList = () => (
  <Query key="Pokemons" query={ALL_POKEMONS_QUERY}>
    {({ loading, error, data }) => {
      if (loading) {
        const loadingPrototype = [];
        for (let i = 0; i < 8; i += 1) {
          loadingPrototype.push(
            <Col key={i} xs="12" sm="8" md="6" lg="4" xl="3">
              <Card className="prototype">
                <div className="card-img card-loading-animation"/>
                <CardBody>
                  <CardTitle className="card-loading-animation"/>
                  <CardSubtitle className="card-loading-animation"/>
                  <CardText className="card-loading-animation"/>
                  <div className="card-button"/>
                </CardBody>
              </Card>
            </Col>
          );
        }
        return loadingPrototype;
      }
      if (error) {
        return `${error}!`;
      }
      
      return (
        !loading &&
        data.getPokemons.map((poke, i) => (
          <Col xs="12" sm="8" md="6" lg="4" xl="3" key={poke.id}>
            <PokemonDetail id={poke.id} key={poke.id} index={i}/>
          </Col>
        ))
      );
    }}
  </Query>
);

const Pokemons = () => (
    <div id="pokemons">
      <h1>Pokemons</h1>
      <div className="container-fluid">
        <Row className="justify-content-md-start justify-content-sm-around">
          <PokemonList/>
        </Row>
      </div>
    </div>
  );

export default Pokemons;
