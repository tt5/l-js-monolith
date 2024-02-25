export default async function Some (some, opts, next) {
  some.get('/', async (req, reply) => {
    return {some: "hello"}
  })
}
