/**
 * Author: Manish
 * Purpose: files realted models
 */

const db = require('../config/db');

/**
 * 
 * @param {*} projectId 
 * @param {*} callback 
 */
function getProjectFiles(projectId, callback) {
    db.query('select id, name, fileSize from files where project_id = ?', [projectId], callback);
}

/**
 * 
 * @param {*} projectId 
 * @param {*} fileInfo array of JSON {name:string, fileSize:int, type: string, filePath:string}
 * @param {*} callback 
 */
function createFiles(projectId, fileInfo, callback) {
    let uploaded = [];

    for (let index = 0; index < fileInfo.length; index++) {
        const element = fileInfo[index];
        const { name, fileSize, type, filePath } = element;
        const sql = 'insert into files(name, fileSize, type, filePath, project_id) values(?,?,?,?,?)';
        db.query(sql, [name, fileSize, type, filePath, projectId], (err, result) => {
            if (result) uploaded.push({ 'fileId': result.insertId, 'name': name, 'fileSize': fileSize, 'type': type });

            if (index === fileInfo.length - 1) {
                let response = {
                    'projectId': projectId,
                    'files': uploaded,
                    'message': uploaded.length ? 'Success' : 'Error'
                }
                return callback(null, response)
            }
        })
    }
}

function deleteFile(projectId, fileId, callback) {
    db.getConnection((err, connection) => {
        if (err) return callback(err);

        connection.beginTransaction(err => {
            if (err) {
                connection.release();
                return callback(err);
            }

            connection.query('delete from files where id=?', fileId, (err) => {
                if (err) {
                    return connection.rollback(() => {
                        connection.release();
                        callback(err);
                    });
                }

                connection.query('update projects set fileCount = fileCount-1 where id=?', projectId, (err) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            callback(err);
                        });
                    }

                    connection.commit(err => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                callback(err);
                            });
                        };

                        connection.release();

                        callback(null, { 'message': 'success', 'data': 'File deleted successfully' })
                    })
                });
            });
        });
    });
}

module.exports = {
    getProjectFiles,
    createFiles,
    deleteFile
}