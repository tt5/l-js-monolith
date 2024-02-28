import {test} from 'node:test'
import {strictEqual} from 'node:assert'

test('routes', async (t) => {
  t.before(
    await fetch('http://127.0.0.1:3000/put')
  )
  t.beforeEach((t) => t.diagnostic(`about to run ${t.name}`))
  t.beforeEach((t) => t.diagnostic(`finished running ${t.name}`))
  t.after(console.log('end'))


  await t.test(
    'root',
    async (t) => {
      const res = await fetch('http://127.0.0.1:3000')
      const json = await res.json()
      strictEqual(JSON.stringify(json), JSON.stringify({hello: "world"}))
  })
})
