'use strict';
var superagent = require('superagent');
var config = require('./../../../config')();

describe('Unauthorised Connection ', function() {
    it('unauthorised should be rejected', function() {
        superagent.get(config.testWFS)
            .end(function(e, res) {
                console.log('e: %j', e);
                expect(res.statusCode).to.equal(403);
                done();
            })
    });
});

describe('WFS Authenticated Connection ', function() {
    it('retrieve token', function() {
        var authenticationForm= 'grant_type=client_credentials&client_id='+config.clientId
            +'&client_secret='+config.clientSecret+'&scope=WFS_SERVICES';

        superagent.post(config.authWFS)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send(authenticationForm)
            .end(function (err, res) {
                console.log('Resp from authentication err %j', err);
                expect(res.statusCode).to.equal(200);
                console.log(res.body);
                done();
            })
    });
});