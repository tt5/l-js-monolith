import { ManyLevelGuest } from 'many-level'
import { pipeline } from 'readable-stream'
import { connect } from 'net'


export default async function Home (home, opts) {

const db = new ManyLevelGuest()
const socket = connect(9000)

// Pipe socket into guest stream and vice versa
pipeline(socket, db.createRpcStream(), socket, () => {
  // Disconnected
})

  home.get('/', async (req, reply) => {
    const res = await fetch('http://some.tt5.workers.dev')
    return (await res.json())
  })

  home.get('/put/:key/:value', async (req, reply) => {
    const {key, value} = req.params
    const res = await db.put(key, value)

    return {res: res}
  })

  home.get('/get/:key', async (req, reply) => {
    const {key} = req.params
    const res = await db.get(key)

    return {res: res}
  })

  home.get('/del/:key', async (req, reply) => {
    const {key} = req.params
    const res = await db.del(key)

    return {res: res}
  })
}
