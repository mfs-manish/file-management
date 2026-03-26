require('dotenv').config({ path: '../.env' }); // load env variables

const express = require('express')
const path = require('path')
const app = express()
const port = 3000


const projectRoute = require('./projects/project-route');
const fileRoute = require('./files/file-route');

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'files/upload.html'))
});

app.use('/api/projects', projectRoute);
app.use('/api/projects/:id/files', fileRoute)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});