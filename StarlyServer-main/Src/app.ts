import dotenv from 'dotenv'
import express from 'express'
import router from './routes/routes.js'
dotenv.config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)
app.get('/', (_, res) => {
	res.send('Hello World')
})
const port = process.env.PORT || 3500

app.listen(port, () => {
	console.log(`Server is running on the port ${port}`)
})
