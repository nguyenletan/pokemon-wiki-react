import { gql } from 'apollo-boost';
import React from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { random } from 'lodash';

import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row,
  Spinner
} from 'reactstrap';
import Helpers from '../helpers/Helpers';
import SmallSkeleton from './SmallSkeleton';

// add some queries for retrieving all Lifts and all Trails
// language=GraphQL
const ALL_POKEMONS_QUERY = gql`
  query getPokemons($limit: Int, $offset: Int) {
    getPokemons(limit: $limit, offset: $offset) {
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
  <Query
    query={GET_POKEMON_QUERY}
    variables={{ id }}
    fetchPolicy="cache-first"
    partialRefetch
    notifyOnNetworkStatusChange
  >
    {({ loading, error, data }) => {
      if (loading) {
        return <SmallSkeleton />;
      }
      if (error) {
        return `${error}`;
      }
      const pokemon = data.getPokemon;
      const imgUrl = Helpers.getPokemonImgUrl(pokemon);

      return (
        <Card className="pokemon">
          <CardImg top width="100%" src={imgUrl} alt={pokemon.name} />
          <CardBody>
            <CardTitle className="text-capitalize text-danger font-weight-bold">
              {pokemon.id}. {pokemon.name} (Gen:{' '}
              {Helpers.getGenerationById(pokemon.id)})
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

const PokemonsList = ({ limit, offset }) => (
  <Query
    key="QueryPokemons"
    query={ALL_POKEMONS_QUERY}
    variables={{ limit, offset }}
  >
    {({ loading, error, data, fetchMore }) => {
      const hasMore = true;
      const infiniteLoader = (
        <div className="infinite-loader" key="infinite-loader">
          <Spinner type="grow" color="success" key="infinite-loader-1" />
          <Spinner type="grow" color="danger" key="infinite-loader-2" />
          <Spinner type="grow" color="secondary" key="infinite-loader-3" />
          <Spinner type="grow" color="primary" key="infinite-loader-4" />
          <Spinner type="grow" color="warning" key="infinite-loader-5" />
        </div>
      );
      const getOffset = index => {
        // TODO: we should rewrite
        offset = index + Helpers.getPageSize();
        return offset;
      };
      const onLoadMore = () =>
        fetchMore({
          variables: {
            offset: getOffset(offset)
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (
              !fetchMoreResult ||
              prev.getPokemons[prev.getPokemons.length - 1].id >=
                Helpers.getMaxPokemonId()
            ) {
              /* hasMore = false;
              infiniteLoader = <div>end</div>; */
              return prev;
            }
            return Object.assign({}, prev, {
              getPokemons: [...prev.getPokemons, ...fetchMoreResult.getPokemons]
            });
          }
        });
      if (loading) {
        const loadingPrototype = [];
        for (let i = 0; i < 8; i += 1) {
          loadingPrototype.push(
            <Col key={i} xs="12" sm="8" md="6" lg="4" xl="3">
              <SmallSkeleton />
            </Col>
          );
        }
        return (
          <Row className="justify-content-md-start justify-content-sm-around">
            {loadingPrototype}
          </Row>
        );
      }
      if (error) {
        return `${error}!`;
      }

      if (!loading) {
        const cols = data.getPokemons.map((poke, i) => (
          <Col xs="12" sm="8" md="6" lg="4" xl="3" key={poke.id}>
            <PokemonDetail id={poke.id} key={poke.id} index={i} />
          </Col>
        ));
        return (
          <InfiniteScroll
            pageStart={0}
            loadMore={onLoadMore}
            hasMore={hasMore}
            loader={infiniteLoader}
            useWindow
          >
            <Row className="justify-content-md-start justify-content-sm-around">
              {cols}
            </Row>
          </InfiniteScroll>
        );
      }
      return null;
    }}
  </Query>
);

// get random Id
const offset = random(0, Helpers.getMaxPokemonId() - Helpers.getPageSize());

const Pokemons = () => (
  <div id="pokemons">
    <h1>Pokémons</h1>
    <div className="container-fluid">
      <PokemonsList limit={Helpers.getPageSize()} offset={offset} />
    </div>
  </div>
);

export default Pokemons;
