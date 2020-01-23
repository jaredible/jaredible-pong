const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.static(__dirname, {
    dotfiles: 'allow'
}))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Pong app listening on port ${PORT}!`)
})