import express from 'express'
import rps from './rps'

const api = express()

api.post('/', (req, res) => {
  const game = rps.create()
  const player = game.register()

  const response = {
    game: `/${game.id()}`,
    move: `/${game.id()}/${player.id()}`
  }

  return res
    .location(response.move)
    .status(201)
    .send(response)
})

api.get('/:game', (req, res) => {
  const game = rps.get(req.params.game)
  const result = game.result()
  const response = {
    status: result.status,
    winner: result.winner ? {
      id: result.winner.id(),
      hand: result.winner.hand()
    } : undefined
  }

  return res.send(response).status(200)
})

api.post('/:game', (req, res) => {
  const game = rps.get(req.params.game)
  const player = game.register()
  const response = {
    move: `/${game.id()}/${player.id()}`
  }
  return res
    .location(response.move)
    .status(201)
    .send(response)
})

function parseHand (str) {
  if (typeof str !== 'string') {
    return undefined
  }

  if (['ROCK', 'R'].includes(str.toUpperCase())) {
    return 'R'
  }

  if (['SCISSORS', 'S'].includes(str.toUpperCase())) {
    return 'S'
  }
  if (['PAPER', 'P'].includes(str.toUpperCase())) {
    return 'P'
  }

  return undefined
}

api.post('/:game/:player', (req, res) => {
  const game = rps.get(req.params.game)
  if (!game) {
    return res.sendStatus(404)
  }

  const player = game.player(req.params.player)
  if (!player) {
    return res.sendStatus(404)
  }

  const hand = parseHand(req.query.hand)
  if (!hand) {
    return res.status(400).send({ error: `Invalid hand ${req.query.hand}` })
  }

  player.move(hand)
  return res.status(200).send({ move: hand })
})

export default api
