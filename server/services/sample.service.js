require('rootpath')()
const fs = require('fs')
const path = require('path')
const oracledb = require('oracledb');
const env = process.env.NODE_ENV || 'local'
const config = require('config.json')[env]
const dbConfig = require('dbconfig.js');

var service = {};
 
service.selectLocation = selectLocation;
service.selectLocationObject = selectLocationObject;
 
module.exports = service;

// 날자를 yyyymmddhhmmss 형식으로 지정할수 있게 Date 클래스를 확장함
Object.defineProperty(Date.prototype, 'YYYYMMDDHHMMSS', {
    value: function() {
        function pad2(n) {  // always returns a string
            return (n < 10 ? '0' : '') + n;
        }

        return this.getFullYear() +
               pad2(this.getMonth() + 1) + 
               pad2(this.getDate()) +
               pad2(this.getHours()) +
               pad2(this.getMinutes()) +
               pad2(this.getSeconds());
    }
});

// 단순 로거 - 보다 정형화된 로거 사용을 위해 morgan, winston, bunyan 로 추후 교체
var simpleLogger = {
    init: function(scriptName) {
        this.scriptName = scriptName
    },
    log: function(func, contents) {
        const timestamp = new Date().YYYYMMDDHHMMSS();
        console.log(this);
        // 파일명 생성
        const fileName = this.scriptName + '-' + func + '_result_' + timestamp + '.log'
        fs.writeFile('logs/'+fileName, contents, function(err) {
            if(err) {
                console.err(err)
            }
        })
    },
    error: function(func, contents) {
        const timestamp = new Date().YYYYMMDDHHMMSS();
        console.log(this);
        // 파일명 생성
        const fileName = this.scriptName + '-' + func + '_error_' + timestamp + '.log'
        fs.writeFile('logs/'+fileName, contents, function(err) {
            if(err) {
                console.err(err)
            }
        })
    }
}
const scriptName = path.basename(__filename, '.js')
simpleLogger.init(scriptName)

// DB connect
var doconnect = function() {
    return oracledb.getConnection(
        {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString
        }, cb);
};
// DB release
var dorelease = function(conn) {
  conn.close(function (err) {
    if (err)
      console.error(err.message);
  });
};

// select array
function getLocation(param) {  
    var connection;  
    var fn_select = function() {
        var query = "SELECT location_id, city FROM locations WHERE city LIKE 'S%' ORDER BY city";
        return connection.execute(query)
            .then(function(result) {
                console.log(result.metaData);
                console.log("----- Cities beginning with 'S' (default ARRAY output format) --------");
                console.log(result.rows);                
                simpleLogger.log('getLocation', JSON.stringify(result,null,2))
                dorelease(connection);
                return result.rows;
            })
            .catch(function(err) {
                simpleLogger.error('getLocation', JSON.stringify(err,null,2))
                dorelease(connection);
                throw new Error(err);
            });
    } 
    return doconnect()
        .then((conn) => {
            connection = conn;
            fn_select()
        })
        .catch((err)=> {
            dorelease(connection);
            throw new Error(err);
        })
}

// select object
function getLocationObject (param) { 
    var connection;       
    var fn_select = function() {
        var query = "SELECT location_id, city FROM locations WHERE city LIKE 'S%' ORDER BY city";
        return connection.execute(
                query,
                {}, // A bind variable parameter is needed to disambiguate the following options parameter
                    // otherwise you will get Error: ORA-01036: illegal variable name/number
                { outFormat: oracledb.OBJECT } // outFormat can be OBJECT or ARRAY.  The default is ARRAY)
            )
            .then(function(result) {
                console.log(result.metaData);
                console.log("----- Cities beginning with 'S' (default ARRAY output format) --------");
                console.log(result.rows);
                simpleLogger.log('getLocation', JSON.stringify(result,null,2))
                dorelease(connection);
                return result.rows;
            })
            .catch(function(err) {
                simpleLogger.error('getLocation', JSON.stringify(err,null,2))
                dorelease(connection);
                throw new Error(err);
            });
    } 

    return doconnect()
        .then((conn) => {
            connection = conn;
            fn_select()
        })
        .catch((err)=> {
            dorelease(connection);
            throw new Error(err);
        });
}

// set location with given params
function setLocation(param) {
    var connection;       
    var fn_updateLocation = function () {
        var query = "UPDATE locations SET city = :city WHERE location_id = :lid";
        conn.execute(
            query,
            [param.city, param.lid]
        )
        .then(function(result) {
            console.log(result);
            simpleLogger.log('getLocation', JSON.stringify(result,null,2))
            dorelease(connection);
            return result;
        })
        .catch(function(err) {
            simpleLogger.error('getLocation', JSON.stringify(err,null,2))
            dorelease(connection);
            throw new Error(err);
        });
    };
    

    return doconnect()
        .then((conn) => {
            connection = conn;
            fn_updateLocation()
        })
        .catch((err)=> {
            dorelease(connection);
            throw new Error(err);
        });
}