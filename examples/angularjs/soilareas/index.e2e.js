var superagent = require('superagent')
var expect = require('expect.js')
var config = require('./../../confige2e')()

describe('Unauthorised Connection to WFS Soil Areas should be rejected', function () {
  it('unauthorised should be rejected', function (done) {
    superagent.get(config.wfs.soilareas)
        .end(function (e, res) {
          console.log('check error: %j res: %j, res.status:%s', e, res, res.status)
          expect(res.status).to.equal(401)
          done()
        })
  })
})


describe('WFS Soil Areas Authenticated Connection ', function () {
  it('retrieve token', function (done) {
    var authenticationForm = 'grant_type=client_credentials&client_id=' + config.authentication.clientId
        + '&client_secret=' + config.authentication.clientSecret + '&scope='+config.authentication.scope;

    console.log('authenticationForm: %s', authenticationForm)

    superagent.post(config.authentication.url)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(authenticationForm)
      .end(function (err, res) {
        console.info('err: %j, res: %j', err, res)
        expect(res.status).to.equal(200)

        var text = JSON.parse(res.text)
        console.info('text:%s', text)

        var token = text.access_token

        console.info('token: %s', token)
        superagent.get(config.wfs.soils)
          .set('Authorization', 'Bearer ' + token)
          .end(function (e, res) {
            console.info('err: %j, res: %j', err, res)
            expect(res.status).to.equal(200)
            done()
        })
      })
  })
})

