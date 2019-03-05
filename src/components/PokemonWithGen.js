import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Button, ButtonGroup } from 'reactstrap';
import Helpers from '../helpers/Helpers';
import CardSkeleton from './CardSkeleton';

// add some queries for retrieving all Lifts and all Trails
// language=GraphQL
const GET_POKEMON_QUERY = gql`
  query getPokemonsByGenQuery($gen: Int) {
    getPokemonsByGen(gen: $gen) {
      id
      name
      form
      type1
      type2
      generation
      sta
      def
      maxcp
      index
    }
  }
`;

const PokemonDetail = props => {
  const { pokemon, index, gen } = props;
  let normalizePoke = pokemon;
  if (pokemon !== null) {
    normalizePoke = Helpers.normalizePokemon2(normalizePoke);
  }
  const imgUrl = Helpers.getPokemonImgUrlWithoutCheckForm(normalizePoke);

  const name = Helpers.getPokeName(normalizePoke);

  const aceIcons = ['♥', '♠', '♦', '♣'];
  const aceClassNameColors = ['text-danger', 'text-dark'];

  const linkUrl = `/pokemon/${normalizePoke.id}`;
  return (
    <li key={`pokemon${index}`}>
      <Link to={linkUrl} className={`gen-${gen}`}>
        <p>
          <span className={`pokemon-name top ${aceClassNameColors[index % 2]}`}>
            {normalizePoke.name[0]}
          </span>
          <span className={`card-icon top ${aceClassNameColors[index % 2]}`}>
            {aceIcons[index % 4]}
          </span>
        </p>

        <img src={imgUrl} alt={name} />

        <span
          className={`font-weight-bold text-center ${
            aceClassNameColors[index % 2]
          }`}
        >
          {name}
        </span>
        <p>
          <span className={`card-icon bottom ${aceClassNameColors[index % 2]}`}>
            {aceIcons[index % 4]}
          </span>
          <span
            className={`pokemon-name bottom ${aceClassNameColors[index % 2]}`}
          >
            {normalizePoke.name[0]}
          </span>
        </p>
      </Link>
    </li>
  );
};

const PokemonsList = ({ gen }) => (
  <Query
    key="QueryPokemons"
    query={GET_POKEMON_QUERY}
    variables={{ gen }}
    fetchPolicy="cache-first"
  >
    {({ loading, error, data }) => {
      // waiting query executing
      if (loading) {
        const loadingPrototype = [];
        for (let i = 0; i < 12; i += 1) {
          loadingPrototype.push(
            <li key={i}>
              <CardSkeleton />
            </li>
          );
        }
        return <ul className="pokemon-list">{loadingPrototype}</ul>;
      }

      // show error message
      if (error) {
        return `${error}!`;
      }

      // when finish query executing
      if (!loading) {
        const cols = data.getPokemonsByGen.map((poke, i) => (
          <PokemonDetail index={i} pokemon={poke} key={i} gen={gen} />
        ));
        return (
          <ul className="pokemon-list" id={`pokemons-gen-${gen}`}>
            {cols}
          </ul>
        );
      }
      return null;
    }}
  </Query>
);

const isActive = (genId, buttonGenId) => genId === buttonGenId;

const Pokemons = props => {
  const { match } = props;
  const genId = match.params.gen === undefined ? 1 : Number(match.params.gen);
  return (
    <div id="pokemons-gen">
      <h1>Pokémons Gen {Helpers.romanize(genId)}</h1>
      <div className="container-fluid">
        <ButtonGroup className="generation-group">
          <NavLink to="/pokemon-with-gen/1">
            <Button
              outline
              color="success"
              className={isActive(1, genId) ? 'active' : ''}
            >
              Gen I
            </Button>
          </NavLink>
          <NavLink to="/pokemon-with-gen/2">
            <Button
              outline
              color="danger"
              className={isActive(2, genId) ? 'active' : ''}
            >
              Gen II
            </Button>
          </NavLink>
          <NavLink to="/pokemon-with-gen/3">
            <Button
              outline
              color="primary"
              className={isActive(3, genId) ? 'active' : ''}
            >
              Gen III
            </Button>
          </NavLink>
          <NavLink to="/pokemon-with-gen/4">
            <Button
              outline
              color="secondary"
              className={isActive(4, genId) ? 'active' : ''}
            >
              Gen IV
            </Button>
          </NavLink>
          <NavLink to="/pokemon-with-gen/5">
            <Button
              outline
              color="warning"
              className={isActive(5, genId) ? 'active' : ''}
            >
              Gen V
            </Button>
          </NavLink>
          <NavLink to="/pokemon-with-gen/6">
            <Button
              outline
              color="info"
              className={isActive(6, genId) ? 'active' : ''}
            >
              Gen VI
            </Button>
          </NavLink>
          <NavLink to="/pokemon-with-gen/7">
            <Button
              outline
              color="dark"
              className={isActive(7, genId) ? 'active' : ''}
            >
              Gen VII
            </Button>
          </NavLink>
        </ButtonGroup>
        <PokemonsList gen={genId} />
      </div>
    </div>
  );
};

export default Pokemons;
