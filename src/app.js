import express from 'express'
import bodyParser from 'body-parser'
import bearerToken from 'express-bearer-token'
import * as middleware from '@middleware'
import * as routes from '@routes'

const app = express()

app.use(middleware.cors)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bearerToken())
app.use(middleware.logging)
app.use(middleware.authentication)

Object.values(routes).forEach(fn => fn(app))

export default app
