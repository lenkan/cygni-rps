import rps from './rps'

describe('rock paper scissors', () => {
  it('creates new game with random id', () => {
    const game1 = rps.create()
    const game2 = rps.create()

    expect(game1.id()).toBeDefined()
    expect(game1.id()).not.toEqual(game2.id())
  })

  it('gives back the stored game', () => {
    const game1 = rps.create()
    const game2 = rps.get(game1.id())

    expect(game1.id()).toEqual(game2.id())
  })

  it('can only register two players per game', () => {
    const game1 = rps.create()

    game1.register()
    game1.register()
    expect(() => game1.register()).toThrow()
  })

  describe('result', () => {
    Array.from([
      { moves: ['R', 'S'], status: 'FINISHED', winner: 0 },
      { moves: ['R', 'P'], status: 'FINISHED', winner: 1 },
      { moves: ['S', 'R'], status: 'FINISHED', winner: 1 },
      { moves: ['S', 'P'], status: 'FINISHED', winner: 0 },
      { moves: ['P', 'R'], status: 'FINISHED', winner: 0 },
      { moves: ['P', 'S'], status: 'FINISHED', winner: 1 }
    ]).forEach(args => {
      const game = rps.create()
      const players = [game.register(), game.register()]

      players[0].move(args.moves[0])
      players[1].move(args.moves[1])

      const result = game.result()

      it(`returns status ${args.moves} => ${args.status}`, () => {
        expect(result.status).toBe(args.status)
      })

      it(`returns winner ${args.moves} => ${args.moves[args.winner]}`, () => {
        expect(result.winner).toBeDefined()
        expect(result.winner.hand()).toBe(args.moves[args.winner])
        expect(result.winner.id()).toBe(players[args.winner].id())
      })
    })

    Array.from([
      { moves: ['R', 'R'], status: 'DRAW' },
      { moves: ['P', 'P'], status: 'DRAW' },
      { moves: ['S', 'S'], status: 'DRAW' }
    ]).forEach(args => {
      const game = rps.create()

      game.register().move(args.moves[0])
      game.register().move(args.moves[0])

      const result = game.result()

      it(`returns status ${args.moves} => ${args.status}`, () => {
        expect(result.status).toBe(args.status)
      })

      it(`does not return winner ${args.moves}`, () => {
        expect(result.winner).toBeUndefined()
      })
    })
  })
})
