require('dotenv').config({ path: '.env' }); // load env variables

const express = require('express')
const path = require('path')
const app = express()
const port = 3000


const projectRoute = require('./projects/project-route');
const fileRoute = require('./files/file-route');
const jobRoute = require('./jobs/job-route')

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/upload.html'))
});

app.use('/api/projects', projectRoute);
app.use('/api/projects/:id/files', fileRoute);
// app.use('/api/projects/:id/jobs', jobRoute);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});