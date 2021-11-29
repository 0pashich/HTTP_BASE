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
            console.log(req.headers);

            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', () => {
                console.log(JSON.parse(data)); // 'Buy the milk'
                res.end();
            })


            //  console.log(req.headers);

            res.writeHead(200);
            res.end('success');



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


