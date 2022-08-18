const express = require('express')
const app = express()
const port = 4000
const customer = require('./rutes/customer')
const item = require('./rutes/Item')
const order = require('./rutes/order')

app.use(express.json())
app.use('/customer', customer)
app.use('/item', item)
app.use('/order', order)

app.listen(port, () => {
    console.log(`app starting on ${port}`);
})
