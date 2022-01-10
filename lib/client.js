const api = require(__dirname + '/api');
const robot = require(__dirname + '/robot');

function Client(t) {
    this._baseUrl = 'https://beehive.ksecosys.com';
    this._token = t;
    this._tokenType = 'Auth0Bearer ';
}

Client.prototype.getRobots = function (callback) {
    if (this._token) {
        api.request(this._baseUrl + '/dashboard', null, 'GET', {Authorization: this._tokenType + this._token}, (function (error, body) {
            if (!error && body && body.robots) {
                var robots = [];
                for (var i = 0; i < body.robots.length; i++) {
                    robots.push(new robot(body.robots[i].name, body.robots[i].serial, body.robots[i].secret_key, this._tokenType + this._token));
                }
                callback(null, robots);
            } else {
                if (typeof callback === 'function') {
                    if (error) {
                        callback(error);
                    } else if (body.message) {
                        callback(body.message);
                    } else {
                        callback('unkown error');
                    }
                }
            }
        }).bind(this));
    } else {
        if (typeof callback === 'function') {
            callback('not authorized');
        }
    }
};

module.exports = Client;
