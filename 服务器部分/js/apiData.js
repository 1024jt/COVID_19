const express = require('express')
const mysql = require('mysql')
const router1 = express.Router()
const router2 = express.Router()
const router3 = express.Router()


// 在这里挂载对应的路由
router1.get('/database', (req, res) => {
    // 定义数据库查询函数
    function queryDatabase(query, callback) {
        // 建立数据库连接
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'test'
        });

        connection.connect(function (err) {
            if (err) {
                console.error('Error connecting to database: ' + err.stack);
                return;
            }
            console.log('Connected to database as ID ' + connection.threadId);
        });

        // 执行数据库查询
        connection.query(query, function (error, results, fields) {
            if (error) {
                console.error('Error executing query: ' + error.stack);
                return;
            }


            // 将查询结果通过回调函数传递到外部
            callback(results);

            // 关闭数据库连接
            connection.end(function (err) {
                if (err) {
                    console.error('Error closing database connection: ' + err.stack);
                    return;
                }
                console.log('Disconnected from database');
            });
        });
    }

    // 调用数据库查询函数
    let sql = 'SELECT * FROM data';
    let globalResults;
    function Result(callback) {
        queryDatabase(sql, function (results) {
            globalResults = results;
            callback(results);
        });
    }

    Result(() => {
        fn();
    });
    function fn() {
        const jsonpCallback = req.query.callback; // 获取回调函数的名称
        const jsonData = JSON.stringify(globalResults); // 将数组转换成 JSON 字符串

        if (jsonpCallback) {
            // 如果存在回调函数，将 JSON 字符串作为参数传入回调函数中
            const jsonpData = `${jsonpCallback}(${jsonData})`;
            res.send(jsonpData);
        } else {
            // 否则直接发送 JSON 字符串
            res.send(jsonData);
        }
        
    }

})

// 在这里挂载对应的路由
router2.get('/sum', (req, res) => {
    // 定义数据库查询函数
    function queryDatabase(query, callback) {
        // 建立数据库连接
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'test'
        });

        connection.connect(function (err) {
            if (err) {
                console.error('Error connecting to database: ' + err.stack);
                return;
            }
            console.log('Connected to database as ID ' + connection.threadId);
        });

        // 执行数据库查询
        connection.query(query, function (error, results, fields) {
            if (error) {
                console.error('Error executing query: ' + error.stack);
                return;
            }


            // 将查询结果通过回调函数传递到外部
            callback(results);

            // 关闭数据库连接
            connection.end(function (err) {
                if (err) {
                    console.error('Error closing database connection: ' + err.stack);
                    return;
                }
                console.log('Disconnected from database');
            });
        });
    }

    // 调用数据库查询函数
    let sql = 'SELECT * FROM sum';
    let globalResults;
    function Result(callback) {
        queryDatabase(sql, function (results) {
            globalResults = results;
            callback(results);
        });
    }

    Result(() => {
        fn();
    });
    function fn() {
        const jsonpCallback = req.query.callback; // 获取回调函数的名称
        // const jsonData = JSON.stringify(globalResults); // 将数组转换成 JSON 字符串
        const formattedData = globalResults.map(obj => {
            // 获取省份名称和对应的值
            const entries = Object.entries(obj).filter(([key, value]) => key !== '日期');
            // 将键值对转换为需要的格式
            const result = entries.map(([name, value]) => ({ name, value }));
            return result;
        });
        const newJsonData = JSON.stringify(formattedData); // 将数组转换成 JSON 字符串

        if (jsonpCallback) {
            // 如果存在回调函数，将 JSON 字符串作为参数传入回调函数中
            const jsonpData = `${jsonpCallback}(${newJsonData})`;
            res.send(newJsonData);
        } else {
            // 否则直接发送 JSON 字符串
            res.send(newJsonData);
        }
        
    }

})


router3.get('/sumtab', (req, res) => {
    // 定义数据库查询函数
    function queryDatabase(query, callback) {
        // 建立数据库连接
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'test'
        });

        connection.connect(function (err) {
            if (err) {
                console.error('Error connecting to database: ' + err.stack);
                return;
            }
            console.log('Connected to database as ID ' + connection.threadId);
        });

        // 执行数据库查询
        connection.query(query, function (error, results, fields) {
            if (error) {
                console.error('Error executing query: ' + error.stack);
                return;
            }


            // 将查询结果通过回调函数传递到外部
            callback(results);

            // 关闭数据库连接
            connection.end(function (err) {
                if (err) {
                    console.error('Error closing database connection: ' + err.stack);
                    return;
                }
                console.log('Disconnected from database');
            });
        });
    }

    // 调用数据库查询函数
    let sql = 'SELECT * FROM 总数表';
    let globalResults;
    function Result(callback) {
        queryDatabase(sql, function (results) {
            globalResults = results;
            callback(results);
        });
    }

    Result(() => {
        fn();
    });
    function fn() {
        const jsonpCallback = req.query.callback; // 获取回调函数的名称
        const jsonData = JSON.stringify(globalResults); // 将数组转换成 JSON 字符串

        if (jsonpCallback) {
            // 如果存在回调函数，将 JSON 字符串作为参数传入回调函数中
            const jsonpData = `${jsonpCallback}(${jsonData})`;
            res.send(jsonpData);
        } else {
            // 否则直接发送 JSON 字符串
            res.send(jsonData);
        }
        
    }

})

// 创建服务器实例
const app = express()

// 允许跨域请求
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 把路由模块,注册到qpp上
app.use('/api', router1,router2,router3)



// 启动服务器
app.listen(5050, () => {
    console.log('express server running at http://127.0.0.1')
})