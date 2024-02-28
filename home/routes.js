import { ManyLevelGuest } from 'many-level'
import { pipeline } from 'readable-stream'
import { connect } from 'net'
import oauthPlugin from '@fastify/oauth2'

export default async function Home (home, opts) {

  home.register(oauthPlugin, {
  name: 'githubOAuth2',
  credentials: {
    client: {
      id: process.env.GITHUB_ID,
      secret: process.env.GITHUB_SECRET
    },
    auth: oauthPlugin.GITHUB_CONFIGURATION
  },
  startRedirectPath: '/login/github',
  callbackUri: 'http://localhost:3000/login/github/callback'
})

  home.setErrorHandler(function (error, req, reply) {
    if (error.code == "LEVEL_NOT_FOUND") {
      reply.status(200).send({ key: req.params.key, value: "" })
    } else {
      reply.status(500).send(error)
    }
  })

  home.addHook("onRequest", (req, rep, done) => {
    req.log.info("home")
    done()
  })

  const db = new ManyLevelGuest()
  const socket = connect(9000)
  pipeline(socket, db.createRpcStream(), socket, () => {
    // Disconnected
  })

  home.get('/', async (req, reply) => {
    const res = await fetch('http://some.tt5.workers.dev')
    return (await res.json())
  })

  home.get('/login/github/callback', async (req, rep) => {

    const token = await home.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(req)

    return {hello: token}
  })

  home.get('/put/:key/:value', async (req, reply) => {
    const {key, value} = req.params
    const res = await db.put(key, value)

    return {res: res}
  })

  home.get('/get/:key', async (req, reply) => {
    const {key} = req.params
    const res = await db.get(key)

    return {key: key, value: res}
  })

  home.get('/del/:key', async (req, reply) => {
    const {key} = req.params
    const res = await db.del(key)

    return {res: res}
  })
}
