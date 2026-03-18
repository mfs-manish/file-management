/**
 * Author: Manish
 */

const express = require('express');
const router = express.Router({ mergeParams: true });
const fileModel = require('./file-model');

router.get('/', (req, res) => {
    const projectId = req.params.id;
    fileModel.getProjectFiles(projectId, (err, results) => {
        if (err) return res.status(500).json({ 'message': 'Error', 'data': err['sqlMessage'] })

        console.log(results);

        res.json(results);
    })
});

router.post('/', (req, res) => {
    const projectId = req.params.id;
    const fileInfo = req.body;

    fileModel.createFiles(projectId, fileInfo, (err, results) => {
        if (err) return res.status(500).json({ 'message': 'Error', 'data': err['sqlMessage'] });
        res.json(results);
    });
});

router.delete('/:fileId', (req, res) => {
    const projectId = req.params.id;
    const fileId = req.params.fileId;
    fileModel.deleteFile(projectId, fileId, (err, result) => {
        if (err) return res.status(500).json({ 'message': 'Error', 'data': err });

        res.json(result);
    });
});

module.exports = router;