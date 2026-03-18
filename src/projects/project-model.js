const db = require('../config/db');

function getAllProjects(callback) {
    db.query('select * from projects', callback);
}

/**
 * 
 * @param {*} projectInfo JSON
 * @param {*} callback 
 * @returns {*} array of created project info
 */
function createProject(projectInfo, callback) {
    const { name, description, createdBy } = projectInfo;
    const sql = 'insert into projects(name, description, createdBy) values(?, ?,?)';
    db.query(sql, [name, description, createdBy], (err, result) => {
        if (err) return callback(err)
        const id = result.insertId;
        const selectQuery = 'SELECT id, name, description, createdTimestamp FROM projects WHERE id = ?';
        db.query(selectQuery, id, callback);
    });
}

function getProjectDetail(projectId, callback) {
    let selectQuery = 'select id, name, description, fileCount, jobCount, createdTimestamp from projects where id=?';
    db.query(selectQuery, projectId, callback);
}

function updateProject(projectId, updateJSON, callback) {
    const clauseSet = [];
    const valueSet = [];
    const { description, jobCount, fileCount } = updateJSON;
    if (description !== undefined) {
        clauseSet.push('description=?');
        valueSet.push(description);
    }
    if (jobCount !== undefined) {
        clauseSet.push('jobCount=?');
        valueSet.push(jobCount);
    }
    if (fileCount !== undefined) {
        clauseSet.push('fileCount=?');
        valueSet.push(fileCount);
    }

    let updateQuery = `UPDATE projects SET ${clauseSet.join(',')} where id=?`;
    valueSet.push(projectId);

    db.query(updateQuery, valueSet, callback);
}

function deleteProject(projectId, callback) {
    db.query('delete from projects where id=?', [projectId], callback);
}

module.exports = {
    getAllProjects,
    createProject,
    getProjectDetail,
    updateProject,
    deleteProject
}