const http = require("http");
const fs = require('fs');

const host = 'localhost';
const port = 8000;
const path = ('./files');


const user = {
    id: 123,
    username: 'testuser',
    password: 'qwerty'
};


const requestListener = (req, res) => {
    if (req.url === '/get') {
        if (req.method === 'GET') {
            try {
                const filenames = fs.readdirSync(path, 'utf8');
                res.writeHead(200);
                res.end(filenames.join(', '));
            } catch (e) {
                console.log(e);
                res.writeHead(500);
                res.end('Internal server error');
            }
        } else {
            res.writeHead(405);
            res.end('HTTP method not allowed');
        }
    } else if (req.url === '/delete') {
        if (req.method === 'DELETE') {
            let reg = new RegExp(`userId=(${user.id})\\b`, 'ig');
            if (req.headers.cookie.match(/authorized=(true)\b/ig) !== null && req.headers.cookie.match(reg) !== null) {
                let data = '';
                let request_data = {};
                req.on('data', chunk => { data += chunk; })
                req.on('end', () => {
                    request_data.filename = JSON.parse(data).filename;
                    fs.unlink(path + '/' + request_data.filename, (err) => {
                        if (err) {
                            res.writeHead(500);
                            res.end(`Internal Server Error`);
                        } else {
                            res.writeHead(200);
                            res.end(`Deleted file ${request_data.filename}`);
                        }
                    });
                })
            } else {
                res.writeHead(401);
                res.end('Unauthorized');
            }
        } else {
            res.writeHead(405);
            res.end('HTTP method not allowed');
        }
    } else if (req.url === '/post') {
        if (req.method === 'POST') {
            let reg = new RegExp(`userId=(${user.id})\\b`, 'ig');
            if (req.headers.cookie.match(/authorized=(true)\b/ig) !== null && req.headers.cookie.match(reg) !== null) {
                let data = '';
                let request_data = {};
                req.on('data', chunk => { data += chunk; })
                req.on('end', () => {
                    request_data.filename = JSON.parse(data).filename;
                    request_data.content = JSON.parse(data).content;
                    fs.writeFile(path + '/' + request_data.filename, request_data.content, (err) => {
                        if (err) {
                            res.writeHead(500);
                            res.end(`Internal Server Error`);
                        } else {
                            res.writeHead(200);
                            res.end(`Create file ${request_data.filename}`);
                        }
                    });
                })
            } else {
                res.writeHead(401);
                res.end('Unauthorized');
            }
        } else {
            res.writeHead(405);
            res.end('HTTP method not allowed');
        }
    } else if (req.url === '/redirect' && req.method === 'GET') {
        res.writeHead(301, {
            'Location': '/redirected'
        });
        res.end('redirect');
    } else if (req.url === '/redirected' && req.method === 'GET') {
        res.writeHead(200);
        res.end('redirected page');
    } else if (req.url === '/auth') {
        if (req.method === 'POST') {
            let data = '';
            let request_data = {};
            req.on('data', chunk => { data += chunk; })
            req.on('end', () => {
                request_data.username = JSON.parse(data).username;
                request_data.password = JSON.parse(data).password;
                if (request_data.username === user.username && request_data.password === user.password) {
                    let date = new Date();
                    date.setTime(date.getTime() + (2 * 24 * 60 * 60 * 1000));
                    let expires = "expires=" + date.toGMTString();
                    res.writeHead(200, {
                        'Set-Cookie': [
                            `userId=${user.id}; Domain=.localhost; Path=/; ${expires}`,
                            `authorized=true; Domain=.localhost; Path=/; ${expires}`,
                        ]
                    });
                    // Domain=.localhost не работает с суб доменами. Необходима вторая точка в домене
                    // Тоесть Domain=.localhost не сработает на www.localhost
                    // А Domain=.www.localhost работает на abc.www.localhost
                    // К сожалению это ограничение стандарта
                    // Если есть решение, прошу написать в коментариях
                    res.end('OK');
                } else {
                    res.writeHead(400);
                    res.end('Неверный логин или пароль');
                }
            })
        } else {
            res.writeHead(405);
            res.end('HTTP method not allowed');
        }
    } else {
        res.writeHead(404);
        res.end('not found');
    }
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});


