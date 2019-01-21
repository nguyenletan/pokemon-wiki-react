import { gql } from 'apollo-boost';
import { createBrowserHistory } from 'history';
import _ from 'lodash';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import {
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
import BigSkeleton from './BigSkeleton';

// add some queries for retrieving all Lifts and all Trails
// language=GraphQL
const GET_POKEMON_QUERY = gql`
  query GetPokemonFromHub($id: Int) {
    getPokemonById(id: $id) {
      id
      name
      form
      height
      weight
      type1
      type2
      description
      atk
      sta
      def
      isMythical
      isLegendary
      generation
      candyToEvolve
      kmBuddyDistance
      baseCaptureRate
      buddySize
      baseFleeRate
      kmDistanceToHatch
      thirdMoveStardust
      thirdMoveCandy
      male
      female
      genderless
      maxcp
      weatherInfluences
      typeChart {
        effectiveness
        status
        type
        statusModifier
      }
    }
  }
`;
// language=GraphQL
const GET_MOVESETS_QUERY = gql`
  query GetMovesets($id: Int) {
    getMoveSets(id: $id) {
      isQuickMoveBoostedByWeather
      isChargeMoveBoostedByWeather
      weaveDPS
      tdo
      timeToFirstActivation
      quickMove {
        name
        id
        type
        power
        duration
        energy
        damageWindow
        energyBars
        critPercentage
        isQuickMove
        damageWindowStart
        damageWindowEnd
        pvpPower
        pvpEnergy
        pvpDuration
        pokemonId
        moveId
      }

      chargeMove {
        name
        id
        type
        power
        duration
        energy
        damageWindow
        energyBars
        critPercentage
        isQuickMove
        damageWindowStart
        damageWindowEnd
        pvpPower
        pvpEnergy
        pvpDuration
        pokemonId
        moveId
      }
    }
  }
`;

const history = createBrowserHistory();

const CardType = props => {
  const { type } = props;
  return (
    <Link to={`/type/${type}`} className="icon-type-wrapper">
      <img
        className={`icon-type ${type}-border`}
        src={Helpers.getTypeImgUrl(Helpers.toCapitalize(type))}
        alt={`${type} type`}
      />
      <span className={`long-type-background ${type}-background`}>{type}</span>
    </Link>
  );
};

const CardTypeImg = props => {
  const { pokemon } = props;
  let cardTypeImage1 = '';
  let cardTypeImage2 = '';
  if (pokemon.type1) {
    const typeName =
      pokemon.type1.charAt(0).toUpperCase() + pokemon.type1.substr(1);
    const typeImgSrc = Helpers.getTypeImgUrl(typeName);

    cardTypeImage1 = (
      <Link to={`/type/${pokemon.type1}`} className="icon-type-wrapper">
        <img
          className={`icon-type ${pokemon.type1}-border`}
          src={typeImgSrc}
          alt={`${pokemon.type1} type`}
        />
        <span className={`long-type-background ${pokemon.type1}-background`}>
          {pokemon.type1}
        </span>
      </Link>
    );
  }

  if (pokemon.type2) {
    const typeName =
      pokemon.type2.charAt(0).toUpperCase() + pokemon.type2.substr(1);
    const typeImgSrc = Helpers.getTypeImgUrl(typeName);

    cardTypeImage2 = (
      <Link to={`/type/${pokemon.type2}`} className="icon-type-wrapper">
        <img
          className={`icon-type ${pokemon.type2}-border`}
          src={typeImgSrc}
          alt={`${pokemon.type2} type`}
        />
        <span className={`long-type-background ${pokemon.type2}-background`}>
          {pokemon.type2}
        </span>
      </Link>
    );
  }

  return (
    <Fragment>
      {cardTypeImage1}
      {cardTypeImage2}
    </Fragment>
  );
};

const MoveSets = ({ id, pokemon }) => (
  <Query query={GET_MOVESETS_QUERY} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading) {
        return 'Loading...';
      }
      if (error) {
        return <div>`Error: ${error}!`</div>;
      }
      if (!loading) {
        const movesets = data.getMoveSets;
        if (
          movesets === null ||
          movesets === undefined ||
          movesets.length === 0
        ) {
          return null;
        }
        const bestMoveSet = Helpers.getBestMoveSet(movesets);
        return (
          <Fragment>
            <strong>{pokemon.name}</strong> best moveset is{' '}
            {bestMoveSet.quickMove.name} and {bestMoveSet.chargeMove.name}, with
            a cycle (weave) DPS of {bestMoveSet.weaveDPS.toFixed(2)} damage per
            second.
          </Fragment>
        );
      }
      return null;
    }}
  </Query>
);

const Stats = props => {
  const xs = 12;
  const sm = 6;
  const md = 6;
  const lg = 6;
  const xl = 4;
  let category = 'Non-Legendary';
  const { pokemon } = props;
  if (pokemon.isLegendary) {
    category = 'Legendary';
  } else if (pokemon.isMythical) {
    category = 'Mythical';
  } else {
    category = 'Non-Legendary';
  }

  return (
    <Fragment>
      <Row className="stats-row">
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
          <strong>Generation: </strong>
          {pokemon.generation}
        </Col>
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
          <strong>Category: </strong>
          {category}
        </Col>
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
          <strong>Weight: </strong>
          {pokemon.weight}
        </Col>
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
          <strong>Height: </strong>
          {pokemon.height}
        </Col>
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
          <strong>Evolution Cost: </strong>
          {pokemon.candyToEvolve}
        </Col>

        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
          <strong>Max-CP: </strong>
          {pokemon.maxcp}
        </Col>
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
          <strong>Attack: </strong>
          {pokemon.atk}
        </Col>
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
          <strong>Defense: </strong>
          {pokemon.def}
        </Col>
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
          <strong>Stamina: </strong>
          {pokemon.sta}
        </Col>

        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
          <strong>Base Catch rate: </strong>
          {pokemon.baseCaptureRate}
        </Col>
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
          <strong>Base Flee rate: </strong>
          {pokemon.baseCaptureRate}
        </Col>
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
          <strong>Buddy walking distance: </strong>
          {pokemon.baseCaptureRate}
        </Col>
        <Col xs={xs} sm={sm} md={6} lg={6} xl={4}>
          <strong>Second charge move Candy: </strong>
          {pokemon.thirdMoveCandy}
        </Col>
        <Col xs={xs} sm={sm} md={6} lg={6} xl={8}>
          <strong>Second charge move Stardust: </strong>
          {pokemon.thirdMoveStardust}
        </Col>
      </Row>
    </Fragment>
  );
};

const Weaknesses = props => {
  const { typeChart } = props;

  const weaknessItems = typeChart.filter(item => item.status === 'dis');

  return (
    <Fragment>
      <p>
        <strong>Weaknesses:</strong>
      </p>
      <ul className="weakness-list">
        {_.orderBy(weaknessItems, ['effectiveness'], ['desc']).map(item => (
          <li key={item.type} className="">
            <CardType type={item.type} />
            <span className={`effectiveness ${item.statusModifier}`}>
              <strong>
                {'=> '}
                {item.effectiveness.toFixed(3) * 100}%
              </strong>{' '}
              damage
            </span>
          </li>
        ))}
      </ul>
    </Fragment>
  );
};

const Resistances = props => {
  const { typeChart } = props;

  const resistanceItems = typeChart.filter(item => item.status === 'adv');

  return (
    <Fragment>
      <p>
        <strong>Resistances:</strong>
      </p>
      <ul className="resistance-list">
        {_.orderBy(resistanceItems, ['effectiveness'], ['asc']).map(item => (
          <li key={item.type} className="">
            <CardType type={item.type} />
            <span className={`effectiveness ${item.statusModifier}`}>
              <strong>
                {'=> '}
                {item.effectiveness.toFixed(3) * 100}%
              </strong>{' '}
              damage
            </span>
          </li>
        ))}
      </ul>
    </Fragment>
  );
};

const PokemonDetail = ({ id }) => (
  <Query query={GET_POKEMON_QUERY} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading) {
        return <BigSkeleton />;
      }
      if (error) {
        return <div>`${error}`</div>;
      }
      const pokemon = data.getPokemonById;
      const imgId = () => {
        if (pokemon.id < 10) {
          return `00${pokemon.id}`;
        }
        if (pokemon.id < 100) {
          return `0${pokemon.id}`;
        }
        return `${pokemon.id}`;
      };
      const imgSrc = `https://db.pokemongohub.net/images/official/full/${imgId()}.png`;
      const videoSrc = Helpers.getVideoURL(pokemon);
      return (
        <Card className="pokemon-detail">
          <i
            role="link"
            title="Go Back"
            className="material-icons arrow-back"
            tabIndex={-1}
            onClick={history.goBack}
            onKeyUp={history.goBack}
          >
            {' '}
            keyboard_backspace
          </i>
          {pokemon.generation > 4 ? (
            <CardImg top src={imgSrc} alt={pokemon.name} />
          ) : (
            <figure className="card-video-top" style={{ margin: '0 auto' }}>
              <video
                autoPlay
                loop
                id="pokemonVideoPlayer"
                height="290"
                title="{pokemon.name} animated sprite"
              >
                <track kind="captions" />
                <source src={videoSrc} type="video/mp4" />
              </video>
            </figure>
          )}
          <CardBody>
            <CardTitle>
              <h1>
                {pokemon.id}.{pokemon.name}
              </h1>
            </CardTitle>
            <CardSubtitle>
              <CardTypeImg pokemon={pokemon} />
            </CardSubtitle>
            <Stats pokemon={pokemon} />
            <CardText className="detail">
              <strong>{pokemon.name}</strong> is a
              <span className={`type-background  ${pokemon.type1}-background`}>
                {Helpers.toCapitalize(pokemon.type1)}
              </span>
              {pokemon.type2 ? (
                <span className={`type-background ${pokemon.type2}-background`}>
                  {Helpers.toCapitalize(pokemon.type2)}
                </span>
              ) : null}{' '}
              type Pokemon with a max CP of {pokemon.maxcp}, {pokemon.atk}{' '}
              attack, {pokemon.def} defense and {pokemon.sta} stamina in Pokemon
              GO. It was originally found in the{' '}
              {Helpers.getGenerationName(pokemon.generation)} region (Gen{' '}
              {pokemon.generation}). {pokemon.name} is vulnerable to{' '}
              {Helpers.arrayToString(
                Helpers.getVulnerableTypes(pokemon.typeChart)
              )}{' '}
              type moves. {pokemon.name} is boosted by{' '}
              {Helpers.arrayToString(pokemon.weatherInfluences)} weather.
            </CardText>
            {pokemon.description !== null ? (
              <CardText className="entry">
                <strong>PokeEntry: </strong>
                <span className="quotes">{`"${pokemon.description}"`}</span>
              </CardText>
            ) : null}

            <CardText className="moveset">
              <MoveSets id={pokemon.id} pokemon={pokemon} />
            </CardText>
            <Row>
              <Col sm={12} lg={6}>
                <Resistances typeChart={pokemon.typeChart} />
              </Col>
              <Col sm={12} lg={6}>
                <Weaknesses typeChart={pokemon.typeChart} />
              </Col>
            </Row>
          </CardBody>
        </Card>
      );
    }}
  </Query>
);

const Pokemon = props => {
  const { match } = props;
  return (
    <div id="pokemon">
      <div className="container-fluid">
        <Row className="justify-content-center">
          <Col xs="12" sm="12" md="10" lg="10" xl="9">
            <PokemonDetail id={Number(match.params.id)} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Pokemon;
