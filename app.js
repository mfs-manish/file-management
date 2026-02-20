const express = require('express')
const app = express()
const port = 3000

const userRoute = require('./routes/user');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api/users', userRoute);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})