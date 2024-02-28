export default async function Some (some, opts, next) {
  some.addHook("onRequest", (req, rep, done) => {
    req.log.info("some")
    done()
  })

  some.get('/', async (req, reply) => {
    return {hello: "world"}
  })
}
