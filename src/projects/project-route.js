/**
 * Author: Manish
 */

const express = require('express');
const router = express.Router();
const projectModel = require('./project-model');

router.get('/', (req, res) => {
    projectModel.getAllProjects((err, results) => {
        if (err) {
            return res.json({ 'error': err, 'status': 'Error' });
        }

        res.json(results);
    })
});

router.post('/', (req, res) => {
    const param = req.body;
    projectModel.createProject(param, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ 'message': 'Error', 'data': err['sqlMessage'] });
        }

        res.json(results[0]);
    });
});

router.get('/:id', (req, res) => {
    projectModel.getProjectDetail(req.params.id, (err, results) => {

        if (err) return res.status(500).json({ 'message': 'Error', 'data': err['sqlMessage'] });

        res.json({ 'message': 'success', 'data': results });
    });
});

router.put('/:id', (req, res) => {
    let projectId = req.params.id;
    let data = req.body;

    const allowedFields = ["description", "fileCount", "jobCount"];
    const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => allowedFields.includes(key))
    )
    const allUndefined = Object.values(data).every(value => value === undefined);

    const dataLength = Object.keys(data).length;
    const filteredDataLength = Object.keys(filteredData).length

    if (dataLength == 0 || filteredDataLength == 0 || allUndefined || dataLength != filteredDataLength) {
        res.status(400).json({ 'message': 'Error', data: 'Invalid input data' })
    }

    projectModel.updateProject(projectId, data, (err, results) => {
        if (err) res.status(500).json({ 'message': 'Error', 'data': err['sqlMessage'] });

        projectModel.getProjectDetail(projectId, (err, results) => {
            if (err) res.status(500).json({ 'message': 'Error', 'data': err['sqlMessage'] });
            res.json({ 'message': 'success', 'data': results });
        });
    })
});

router.delete('/:id', (req, res) => {
    const projectId = req.params.id;
    projectModel.deleteProject(projectId, (err, results) => {
        if (err) res.status(500).json({ 'message': 'Error', 'data': err['sqlMessage'] });

        if (!results.affectedRows) {
            res.json({ 'message': 'Error', 'data': 'Project not found' });
        }
        res.json({ 'message': 'success', 'data': 'Project and all associated files and jobs deleted' });
    });
});

module.exports = router;