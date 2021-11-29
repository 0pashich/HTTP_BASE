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
            res.writeHead(200);
            res.end('success');
        } else {
            res.writeHead(405);
            res.end('HTTP method not allowed');
        }
    } else if (req.url === '/post') {
        if (req.method === 'POST') {
            res.writeHead(200);
            res.end('success');
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

            //console.log(req.headers);
            console.log(req.headers['content-type']);
            console.log(req.headers['content-length']);
            let data = '';
            let request_data = {};
            let username = '';
            let password = '';
            req.on('data', chunk => {
                data += chunk;
            })

            req.on('end', () => {
                request_data.username = JSON.parse(data).username;
                request_data.password = JSON.parse(data).password;
                if (user.username === JSON.parse(data).username) { console.log('username') }
                if (user.password === JSON.parse(data).password) { console.log('password') }
                console.log(JSON.parse(data)); // 'Buy the milk'
                //  res.end();


                console.log('username', username);
                console.log('pas', password);
                //request_data = JSON.parse(data)
                console.log(123, request_data);
                if (request_data.username === user.username && request_data.password === user.password) {
                    console.log(`userId=${user.id}; max_age=172800; domain=.localhost;`);
                    res.writeHead(200, {
                        'Set-Cookie': `userId=${user.id}; authorized=true; max_age=172800; domain=.localhost;`
                    });
                    res.end('OK');

                } else {
                    res.writeHead(400);
                    res.end('Неверный логин или пароль');
                }
                //console.log(req.headers);











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


