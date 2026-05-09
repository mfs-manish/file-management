/**
 * Author: Manish Kumar
 */

const express = require('express')
const router = express.Router({ mergeParams: true });

router.get('/zip', (req, res) => {
    const projectId = req.params.id;
    const jsonBody = req.body;

    console.log('Create Zip file')
});

module.exports = router;