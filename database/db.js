const mysql = require('mysql');

const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'database-1.cbt08pr7bn4y.us-east-1.rds.amazonaws.com',
  user            : 'admin',
  password        : 'abc123$$',
  database        : 'cms'
});

exports.pool = pool;

exports.read = (query, req, res, callback, noresult) => {
  pool.getConnection((err, connection) => {

    if (err) {
      // not connected!
      console.log(err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: "Could not connect to database"});
    } 
    else {
      // Use the connection
      connection.query(query, (error, results, fields) => {

        //query execution error
        if (error) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: error});
        }
        //if any result is retrieved
        else if(results.length > 0){
          callback(results);
        }
        //no results found
        else if (noresult){
          noresult();
        } 
        //default function for no result
        else{
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: "no results found"});
        }

        // When done with the connection, release it.
        try {
          connection.release();
        } catch(err) {
          console.log(err);
          throw err;
        }
      });
    }
  })
};



exports.create = (query, req, res, callback) => {
  pool.getConnection((err, connection) => {

    if (err) {
      // not connected!
      console.log(err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: "database error"});
    } 
    else {
      // Use the connection
      connection.query(query, (error, results, fields) => {

        //query execution error
        if (error) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: error});
        }

        callback(results);

        // When done with the connection, release it.
        try {
          connection.release();
        } catch(err) {
          console.log(err);
          throw err;
        }
      });
    }
  })
};

exports.update = (query, req, res, callback, handleError) => {
  pool.getConnection((err, connection) => {

    if (err) {
      // not connected!
      console.log(err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: "database error"});
    } 
    else {
      // Use the connection
      connection.query(query, (error, results, fields) => {

        //query execution error
        if (error) {
          if(handleError){
            handleError(error);
          } else {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: error});
          }
        }

        callback(results);

        // When done with the connection, release it.
        try {
          connection.release();
        } catch(err) {
          console.log(err);
          throw err;
        }
      });
    }
  })
};


exports.delete = (query, req, res, callback) => {
  pool.getConnection((err, connection) => {

    if (err) {
      // not connected!
      console.log(err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: "database error"});
    } 
    else {
      // Use the connection
      connection.query(query, (error, results, fields) => {

        //query execution error
        if (error) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: error});
        }

        callback(results);

        // When done with the connection, release it.
        try {
          connection.release();
        } catch(err) {
          console.log(err);
          throw err;
        }
      });
    }
  })
};