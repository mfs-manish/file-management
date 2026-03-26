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
    db.query('select id, name, fileSize, filePath, type from files where project_id = ?', [projectId], callback);
}

/**
 * 
 * @param {*} projectId 
 * @param {JSON} fileInfo array of JSON {name:string, fileSize:int, type: string, filePath:string}
 * @param {*} callback 
 */
function createFiles(projectId, fileInfo, callback) {
    let uploaded = [];
    const { name, fileSize, type, filePath } = fileInfo;
    const sql = 'insert into files(name, fileSize, type, filePath, project_id) values(?,?,?,?,?)';

    db.getConnection((err, connection) => {
        if (err) return callback({ 'message': 'Error', 'error': err });

        connection.query(sql, [name, fileSize, type, filePath, projectId], (err, result) => {
            if (err) {
                return callback({ 'message': 'Error', 'error': err })
            }

            connection.query('update projects set fileCount = fileCount+1 where id=?', projectId, (err, result) => {
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
                })

                connection.release();

                callback(null, { 'message': 'success', 'data': 'File uploaded successfully' })
            })
        })
    });
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