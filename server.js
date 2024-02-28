import { request, Agent, setGlobalDispatcher } from 'undici'
import Fastify from 'fastify'
import FastifyUndiciDispatcher from 'fastify-undici-dispatcher'
import autoLoad from '@fastify/autoload'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import * as dotenv from "dotenv"
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const home = Fastify({
  logger: true,
  disableRequestLogging: true
})

home.register(autoLoad, {
  dir: join(__dirname, 'home')
})

const some = Fastify({
  logger: true,
  disableRequestLogging: true
})

some.register(autoLoad, {
  dir: join(__dirname, 'some')
})

const dispatcher = new FastifyUndiciDispatcher({
  domain: '.tt5.workers.dev'
})
dispatcher.route('home', home)
dispatcher.route('some', some)

setGlobalDispatcher(dispatcher)

try {
  await home.listen({ port: 3000 })
} catch (err) {
  home.log.error(err)
  process.exit(1)
}
