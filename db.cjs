const { ManyLevelHost } = require('many-level')
const { Level } = require('level')
const { pipeline } = require('readable-stream')
const { createServer } = require('net')

const db = new Level('./db')
const host = new ManyLevelHost(db)

const server = createServer(function (socket) {
  // Pipe socket into host stream and vice versa
  pipeline(socket, host.createRpcStream(), socket, () => {
    // Disconnected
  })
})

server.listen(9000)
