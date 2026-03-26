/**
 * Author: Manish
 */

const express = require('express');
const fs = require('fs')
const router = express.Router({ mergeParams: true });
const fileModel = require('./file-model');
const upload = require('../middleware/multer')

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
    fileModel.getFileInfo(fileId, (err, result) => {

        if (err) return res.status(500).json({ 'message': 'Error', 'data': err });

        if (result.length == 0) return res.json({ 'message': 'Error', 'data': 'File not found !!!' })

        const filePath = result[0].filePath;

        fileModel.deleteFile(projectId, fileId, (err, result) => {
            if (err) return res.status(500).json({ 'message': 'Error', 'data': 'File deletion failed' });

            console.log('file deleted');


            /** delete file from disk. */
            fs.unlink(filePath, (err) => {
                if (err) res.json({ 'message': 'Error', 'data': 'file removed from database but could not removed form disk' });
                res.json({ 'message': 'success', 'data': 'File deleted successfully.' });
            })

        });
    })
});

router.post('/upload', upload.array("files", 5), (req, res) => {
    const filesReceived = req.files;
    const projectId = req.params.id;

    let completed = 0;
    const filesuploaded = [];

    filesReceived.forEach((f, i) => {
        const fileInfo = {
                'name': f.originalname,
                'filePath': f.path,
                'type': f.mimetype,
                'fileSize': f.size,
            }
            //send info to save into database
        fileModel.createFiles(projectId, fileInfo, (err, result) => {
            if (err) {
                /** delete uploaded file. */
                fs.unlink(f.path, (e, s) => {
                    if (e) console.log(e);
                    if (s) console.log(s);
                })
            }

            if (result) {
                filesuploaded.push(i) // return index of uploaded file.
            }
            completed++
            if (completed == filesReceived.length) {
                res.json({
                    success: filesuploaded.length,
                    failed: filesReceived.length - filesuploaded.length,
                    data: filesuploaded
                })
            }
        });

    });

});

module.exports = router;