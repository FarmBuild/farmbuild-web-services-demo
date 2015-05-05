var superagent = require('superagent')
var expect = require('expect.js')
var config = require('./../../confige2e')()

describe('WFS Authenticated Connection ', function () {
  it('retrieve token', function (done) {
    var authenticationForm = 'grant_type=client_credentials&client_id=' + config.authentication.clientId
      + '&client_secret=' + config.authentication.clientSecret + '&scope=WFS_SERVICES';

    console.log('authenticationForm: %s', authenticationForm)
    console.log('authentication URL: %s', config.authentication.url)

    superagent.post(config.authentication.url)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(authenticationForm)
      .end(function (err, res) {
        console.info('err: %j, res: %j', err, res)
        expect(res.status).to.equal(200)

        var text = JSON.parse(res.text)
        console.info('text:%s', text)

        var token = text.access_token;

        console.info('token: %s', token);
          done();
      })
  })

})