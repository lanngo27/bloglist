import logger from './utils/logger'
import config from './utils/config'
import app from './app'
import http from 'http'

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
