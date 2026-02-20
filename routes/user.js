const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hi i am from user route.');
});

router.get('/:id', (req, res) => {
    res.send(`user id: ${req.params.id}`, );
})

module.exports = router;