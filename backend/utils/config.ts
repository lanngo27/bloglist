import 'dotenv/config'

const PORT: string = process.env.PORT!
let MONGODB_URI: string = process.env.MONGODB_URI!
if (process.env.NODE_ENV === 'test') MONGODB_URI = process.env.TEST_MONGODB_URI!
if (process.env.NODE_ENV === 'development')
  MONGODB_URI = process.env.DEV_MONGODB_URI!
const NODE_ENV: string = process.env.NODE_ENV || ''

export default {
  MONGODB_URI,
  PORT,
  NODE_ENV
}
