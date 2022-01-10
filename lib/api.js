const https = require('https');

function request(url, payload, method, headers, callback) {
    if (!url || url === '') {
        if (typeof callback === 'function') {
            callback('no url specified');
        }
        return;
    }

    const options = {
        method: method === 'GET' ? 'GET' : 'POST',
        rejectUnauthorized: false,
        headers: {
            'Accept': 'application/vnd.neato.nucleo.v1'
        }
    };

    if (options.method === 'POST' && payload && payload.length) {
        options.headers['Content-Length'] = payload.length;
    }

    if (typeof headers === 'object') {
        for (const header in headers) {
            if (headers.hasOwnProperty(header)) {
                options.headers[header] = headers[header];
            }
        }
    }

    const req = https.request(url, options, (res) => {
        const data = [];
        res.on('data', d => data.push(d));
        res.on('end', () => {
            try{
                const parsedData = JSON.parse(data.toString());
                callback(null, parsedData);
            } catch(err) {
                callback(err, null);
            }
        });
    });

    req.on('error', (err) => {
        callback(err, null);
    });
    req.end(payload && payload.length ? payload : '');
}

exports.request = request;
