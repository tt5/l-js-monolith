import { ManyLevelGuest } from 'many-level'
import { pipeline } from 'readable-stream'
import { connect } from 'net'


export default async function Home (home, opts, next) {

const db = new ManyLevelGuest()
const socket = connect(9000)

// Pipe socket into guest stream and vice versa
pipeline(socket, db.createRpcStream(), socket, () => {
  // Disconnected
})

  home.get('/', async (req, reply) => {
    const res = await fetch('http://some.a')
    return (await res.json())
  })

  home.get('/put', async (req, reply) => {
    await db.put("one", "1")

    return {some: "put"}
  })

  home.get('/get', async (req, reply) => {
    const res = await db.get("one")

    return {some: res}
  })
}
