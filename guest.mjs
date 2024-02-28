import { ManyLevelGuest } from 'many-level'
import { pipeline } from 'readable-stream'
import { connect } from 'net'

const db = new ManyLevelGuest()
const socket = connect(9000)

pipeline(socket, db.createRpcStream(), socket, () => {
  // Disconnected
})

await db.put('hello', 'world')
console.log(await db.get('hello'))
