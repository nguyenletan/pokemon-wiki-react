import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Pokemons from "./components/Pokemons"
import Pokemon from "./components/Pokemon"
import PokemonWithGen from "./components/PokemonWithGen"
import Type from "./components/Type"

const AppRouter = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={PokemonWithGen} />
      <Route path="/pokemons" component={Pokemons} />
      <Route path="/type/:name" component={Type} />
      <Route path="/pokemon-with-gen/:gen" component={PokemonWithGen} />
      <Route path="/pokemon/:id" exact component={Pokemon} />
      <Route path="/pokemon/:id/form/:form" component={Pokemon} />
    </Switch>
  </Router>
)

export default AppRouter
