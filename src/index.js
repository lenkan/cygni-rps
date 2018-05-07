import { port } from './config'
import log from './log'
import server from './api'

server.listen(port, () => {
  log.info(`Server listening on ${port}`)
})
