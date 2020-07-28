import { gql } from "apollo-boost"
import _ from "lodash"
import React, { Fragment } from "react"
import { Query } from "react-apollo"
import { Link, NavLink } from "react-router-dom"
import {
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Row,
} from "reactstrap"

import Helpers from "../helpers/Helpers"
import BigSkeleton from "./BigSkeleton"

// add some queries for retrieving all Lifts and all Trails
const GET_POKEMON_QUERY = gql`
  query GetPokemonFromHub($id: Int, $form: String) {
    getPokemonById(id: $id, form: $form) {
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
      forms {
        name
        value
      }
      typeChart {
        effectiveness
        status
        type
        statusModifier
      }
      family {
        id
        index
        name
        form
        type1
        type2
        generation
        atk
        sta
        def
        maxcp
      }
    }

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
`

const GET_MINI_POKEMON_QUERY = gql`
  query GetMiniPokemonFromHub($id: Int) {
    minimalIdentifier: getPokemonById(id: $id) {
      id
      name
      form
      forms {
        name
        value
      }
      type1
      type2
      atk
      sta
      def
      generation
      maxcp
    }
  }
`

// const history = createBrowserHistory();

const NavItem = props => {
  const { id, isPrev } = props
  const htmlClass = isPrev
    ? "go-link go-prev-pokemon"
    : "go-link go-next-pokemon"
  return (
    <Query
      query={GET_MINI_POKEMON_QUERY}
      variables={{ id }}
      fetchPolicy="cache-first"
    >
      {({ loading, error, data }) => {
        if (loading) {
          return <span className="{htmlClass}" title="Go to pokemon" />
        }
        if (error) {
          return <div>`${error}`</div>
        }

        const pokemon = data.minimalIdentifier
        if (!pokemon) {
          return (
            <Link
              style={{ visibility: "hidden" }}
              to="/pokemon/0"
              className={htmlClass}
              title=""
            ></Link>
          )
        }
        const imgUrl = Helpers.getPokemonImgUrl(pokemon)
        return (
          <Link
            to={`/pokemon/${pokemon.id}`}
            className={htmlClass}
            title={`Go to ${pokemon.name}`}
          >
            <img className="pokemon-img" src={imgUrl} alt={pokemon.name} />
            <span className="pokemon-name">{pokemon.name}</span>
            <span className="pokemon-id">#{pokemon.id}</span>
          </Link>
        )
      }}
    </Query>
  )
}

const Navigation = props => {
  const { pokemon } = props

  const prevId = pokemon.id > 1 ? pokemon.id - 1 : 0
  const nextId = pokemon.id < Helpers.getMaxPokemonId() ? pokemon.id + 1 : 0

  return (
    <nav className="navigation">
      <NavItem id={prevId} isPrev />
      <NavItem id={nextId} isPrev={false} />
    </nav>
  )
}

const CardType = props => {
  const { type } = props
  return (
    <Link to={`/type/${type}`} className="icon-type-wrapper">
      <img
        className={`icon-type ${type}-border`}
        src={Helpers.getTypeImgUrl(Helpers.toCapitalize(type))}
        alt={`${type} type`}
      />
      <span className={`long-type-background ${type}-background`}>{type}</span>
    </Link>
  )
}

const CardTypeImg = props => {
  const { pokemon } = props
  let cardTypeImage1 = ""
  let cardTypeImage2 = ""
  if (pokemon.type1) {
    const typeName =
      pokemon.type1.charAt(0).toUpperCase() + pokemon.type1.substr(1)
    const typeImgSrc = Helpers.getTypeImgUrl(typeName)

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
    )
  }

  if (pokemon.type2) {
    const typeName =
      pokemon.type2.charAt(0).toUpperCase() + pokemon.type2.substr(1)
    const typeImgSrc = Helpers.getTypeImgUrl(typeName)

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
    )
  }

  return (
    <Fragment>
      {cardTypeImage1}
      {cardTypeImage2}
    </Fragment>
  )
}

const MoveSets = ({ pokemon, movesets }) => {
  if (movesets === null || movesets === undefined || movesets.length === 0) {
    return null
  }
  const bestMoveSet = Helpers.getBestMoveSet(movesets)
  return (
    <Fragment>
      <strong>
        {pokemon.name} {pokemon.form || ""}
      </strong>{" "}
      best moveset is <strong>{bestMoveSet.quickMove.name}</strong> and{" "}
      <strong>{bestMoveSet.chargeMove.name}</strong>, with a cycle (weave) DPS
      of {bestMoveSet.weaveDPS.toFixed(2)} damage per second.
    </Fragment>
  )
}

const Stats = props => {
  const xs = 12
  const sm = 6
  const md = 6
  const lg = 6
  const xl = 4
  let category = "Non-Legendary"
  const { pokemon } = props
  if (pokemon.isLegendary) {
    category = "Legendary"
  } else if (pokemon.isMythical) {
    category = "Mythical"
  } else {
    category = "Non-Legendary"
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
          {pokemon.weight ? pokemon.weight.toFixed(2) : null}
        </Col>
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
          <strong>Height: </strong>
          {pokemon.height ? pokemon.height.toFixed(2) : null}
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
          {pokemon.baseCaptureRate.toFixed(2)}
        </Col>
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
          <strong>Base Flee rate: </strong>
          {pokemon.baseCaptureRate.toFixed(2)}
        </Col>
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
          <strong>Buddy walking distance: </strong>
          {pokemon.baseCaptureRate.toFixed(2)}
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
  )
}

const Weaknesses = props => {
  const { typeChart } = props

  const weaknessItems = typeChart.filter(item => item.status === "dis")

  return (
    <Fragment>
      <p>
        <strong>Weaknesses:</strong>
      </p>
      <ul className="weakness-list">
        {_.orderBy(weaknessItems, ["effectiveness"], ["desc"]).map(item => (
          <li key={item.type} className="">
            <CardType type={item.type} />
            <span className={`effectiveness ${item.statusModifier}`}>
              <span className="arrow-to-damage">{"==> "}</span>
              <strong>{item.effectiveness.toFixed(3) * 100}%</strong>{" "}
              <span className="damage-text">damage</span>
            </span>
          </li>
        ))}
      </ul>
    </Fragment>
  )
}

const Resistances = props => {
  const { typeChart } = props
  const resistanceItems = typeChart.filter(item => item.status === "adv")

  return (
    <Fragment>
      <p>
        <strong>Resistances:</strong>
      </p>
      <ul className="resistance-list">
        {_.orderBy(resistanceItems, ["effectiveness"], ["asc"]).map(item => (
          <li key={item.type} className="">
            <CardType type={item.type} />
            <span className={`effectiveness ${item.statusModifier}`}>
              <span className="arrow-to-damage">{"==> "}</span>
              <strong>{item.effectiveness.toFixed(3) * 100}%</strong>{" "}
              <span className="damage-text">damage</span>
            </span>
          </li>
        ))}
      </ul>
    </Fragment>
  )
}

const Family = props => {
  const { family } = props
  if (
    family === undefined ||
    family === null ||
    family.length == null ||
    family.length === 0
  ) {
    return null
  }

  const members = family.map((member, index) => {
    const imgUrl = Helpers.getPokemonImgUrl(member)
    const name = Helpers.getPokeName(member)
    const aceIcons = ["♥", "♠", "♦", "♣"]
    const aceClassNameColors = ["text-danger", "text-dark"]
    const { form } = member
    const linkUrl =
      form === null
        ? `/pokemon/${member.id}`
        : `/pokemon/${member.id}/form/${form}`
    return (
      <li key={`${member.id}-${index}`}>
        <Link to={linkUrl}>
          <span className={`member-name top ${aceClassNameColors[index % 2]}`}>
            {member.name[0]}
          </span>
          <span className={`card-icon top ${aceClassNameColors[index % 2]}`}>
            {aceIcons[index % 4]}
          </span>
          <img src={imgUrl} alt={name} />
          <span
            className={`font-weight-bold text-center ${
              aceClassNameColors[index % 2]
            }`}
          >
            {name}
          </span>
          <span className={`card-icon bottom ${aceClassNameColors[index % 2]}`}>
            {aceIcons[index % 4]}
          </span>
          <span
            className={`member-name bottom ${aceClassNameColors[index % 2]}`}
          >
            {member.name[0]}
          </span>
        </Link>
      </li>
    )
  })
  return (
    <section className="family">
      <p className="title">
        <strong>Pokemon Family:</strong>
      </p>
      <ul className="family-list">{members}</ul>
    </section>
  )
}

const Information = props => {
  const { pokemon } = props
  return (
    <Fragment>
      <CardText className="infomation">
        <strong>
          {pokemon.name} {pokemon.form || ""}
        </strong>{" "}
        is a
        <span className={`type-background  ${pokemon.type1}-background`}>
          {Helpers.toCapitalize(pokemon.type1)}
        </span>
        {pokemon.type2 ? (
          <span className={`type-background ${pokemon.type2}-background`}>
            {Helpers.toCapitalize(pokemon.type2)}
          </span>
        ) : null}{" "}
        type Pokemon with a max CP of {pokemon.maxcp}, {pokemon.atk} attack,{" "}
        {pokemon.def} defense and {pokemon.sta} stamina in Pokemon GO. It was
        originally found in the {Helpers.getGenerationName(pokemon.generation)}{" "}
        region (Gen {pokemon.generation}). {pokemon.name} is vulnerable to{" "}
        {Helpers.arrayToString(Helpers.getVulnerableTypes(pokemon.typeChart))}{" "}
        type moves. {pokemon.name} is boosted by{" "}
        {Helpers.arrayToString(pokemon.weatherInfluences)} weather.
      </CardText>
      {pokemon.description !== null ? (
        <CardText className="entry">
          <strong>PokeEntry: </strong>
          <span className="quotes">{`"${pokemon.description}"`}</span>
        </CardText>
      ) : null}
    </Fragment>
  )
}

const Forms = props => {
  const { pokemon } = props

  if (pokemon.forms === null || pokemon.forms.length <= 1) {
    return null
  }

  const formList = pokemon.forms.map(form => {
    const linkUrl =
      form.value === ""
        ? `/pokemon/${pokemon.id}`
        : `/pokemon/${pokemon.id}/form/${form.value}`
    return (
      <li className="form-item">
        <NavLink exact to={linkUrl} title={`${pokemon.name} ${form.name}`}>
          <img
            src={Helpers.getFormImgUrl(pokemon.id, form.value)}
            alt={`${pokemon.name} ${form.name}`}
          />
          <span className="name">{`${form.name} form`}</span>
        </NavLink>
      </li>
    )
  })

  return (
    <p className="forms">
      <span className="title">
        <strong>Form: </strong>
      </span>
      <ul className="form-list">{formList}</ul>
    </p>
  )
}

const PokemonDetail = ({ id, form }) => (
  <Query
    query={GET_POKEMON_QUERY}
    variables={{ id, form }}
    fetchPolicy="cache-and-network"
  >
    {({ loading, error, data }) => {
      if (loading) {
        return <BigSkeleton />
      }
      if (error) {
        return <div>`${error}`</div>
      }
      const pokemon = data.getPokemonById
      const movesets = data.getMoveSets

      if (pokemon !== null) {
        Helpers.normalizePokemon(pokemon)
      }
      const imgSrc = Helpers.getPokemonImgUrl(pokemon)
      const videoSrc = Helpers.getVideoURL(pokemon)

      return (
        <Card className="pokemon-detail">
          <Link to="/" title="Go back Home Page">
            <i
              role="link"
              title="Go Back Home Page"
              className="material-icons arrow-back"
              tabIndex={-1}
              /* onClick={history.goBack}
              onKeyUp={history.goBack} */
            >
              keyboard_backspace
            </i>
          </Link>
          {pokemon.generation > 4 || (form !== null && form !== undefined) ? (
            <CardImg top src={imgSrc} alt={pokemon.name} />
          ) : (
            <figure className="card-video-top" style={{ margin: "0 auto" }}>
              <video
                autoPlay
                loop
                className="pokemon-video-player"
                title={`${pokemon.name} animated sprite`}
              >
                <track kind="captions" />
                <track kind="description" />
                <source src={videoSrc} type="video/mp4" />
              </video>
            </figure>
          )}
          <CardBody>
            <CardTitle>
              <h1>
                {pokemon.id}.{pokemon.name} {form || ""}
              </h1>
            </CardTitle>
            <Navigation pokemon={pokemon} />
            <CardSubtitle>
              <CardTypeImg pokemon={pokemon} />
            </CardSubtitle>

            <Forms pokemon={pokemon} />

            <Stats pokemon={pokemon} />

            <Information pokemon={pokemon} />

            <CardText className="moveset">
              <MoveSets movesets={movesets} pokemon={pokemon} />
            </CardText>

            <Row>
              <Col sm={12} lg={6}>
                <Resistances typeChart={pokemon.typeChart} />
              </Col>
              <Col sm={12} lg={6}>
                <Weaknesses typeChart={pokemon.typeChart} />
              </Col>
            </Row>

            <Family family={pokemon.family} />
          </CardBody>
        </Card>
      )
    }}
  </Query>
)

const Pokemon = props => {
  const { match } = props

  return (
    <div id="pokemon">
      <div className="container-fluid">
        <Row className="justify-content-center">
          <Col xs="12" sm="12" md="10" lg="10" xl="9">
            <PokemonDetail
              id={Number(match.params.id)}
              form={match.params.form}
            />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Pokemon
