function guid () {
  const id = 'xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })

  return id
}

const store = (function () {
  const games = [].map(s => createGame(guid()))

  return {
    get (id) {
      return games.find(g => g.id() === id)
    },

    create () {
      const id = guid()
      const game = createGame({ id })
      games.push(game)
      return game
    }
  }
}())

function createPlayer ({ id }) {
  const state = { hand: undefined }
  return {
    id () {
      return id
    },

    move (hand) {
      state.hand = hand
      return this
    },

    compare (otherHand) {
      if (!['P', 'R', 'S'].includes(otherHand)) {
        throw new Error('Invalid hand cannot compare ' + otherHand)
      }

      if (otherHand === undefined) {
        return 0
      }
      if (otherHand === state.hand) {
        return 0
      }

      switch (state.hand) {
        case 'S':
          return otherHand === 'P' ? +1 : -1
        case 'P':
          return otherHand === 'R' ? +1 : -1
        case 'R':
          return otherHand === 'S' ? +1 : -1
        default:
          return 0
      }
    },

    hand () {
      return state.hand
    }
  }
}

function createGame ({ id }) {
  const players = []

  return {
    id () { return id },

    register () {
      if (players.length > 1) {
        throw new Error('There is already two players registered with this game')
      }

      const player = createPlayer({ id: guid() })
      players.push(player)
      return player
    },

    player (id) {
      return players.find(p => p.id() === id)
    },

    result () {
      if (players.length !== 2) {
        return { result: 'WAITING_FOR_PLAYER' }
      }

      if (players.some(player => player.hand() === undefined)) {
        return { result: 'WAITNING_FOR_HAND' }
      }

      const p1 = players[0]
      const p2 = players[1]
      if (p1.compare(p2.hand()) === 0) {
        return { status: 'DRAW', players: [...players] }
      }

      if (p1.compare(p2.hand()) > 0) {
        return { status: 'FINISHED', winner: p1, loser: p2 }
      }
      return { status: 'FINISHED', winner: p2, loser: p2 }
    }
  }
}

export default store
