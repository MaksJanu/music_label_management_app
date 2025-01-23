import fs from 'fs';

const path = './app.log';

const loggerMiddleware = (req, res, next) => {

    const originalJson = res.json;
    res.json = function (body) {
        res._body = body; 
        return originalJson.call(this, body);
    };

    const requestLog = `${new Date().toISOString()} Request: ${req.method} ${
        req.url
    } ${req.body ? JSON.stringify(req.body) : ''}`;
    // console.log(requestLog);

    res.on('finish', () => {
        const responseLog = `${new Date().toISOString()} Response: ${
            res.statusCode
        } ${res.statusMessage} ${
            req.method !== 'GET' ? JSON.stringify(res._body) : ''
        }`;

        fs.appendFile(path, `${requestLog}\n${responseLog}\n`, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });

    next();
};

export { loggerMiddleware };