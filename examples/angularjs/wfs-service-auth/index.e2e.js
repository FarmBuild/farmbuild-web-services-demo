var superagent = require('superagent')
var expect = require('expect.js')
var config = require('./../../../config')()

describe('Unauthorised Connection ', function () {
  it('unauthorised should be rejected', function (done) {
    superagent.get(config.testWFS)
      .end(function (e, res) {
        console.log('check error: %j res: %j, res.status:%s', e, res, res.status)

        expect(res.status).to.equal(401)
        done()
      })
  })
})

describe('WFS Authenticated Connection ', function () {
  it('retrieve token', function (done) {
    var authenticationForm = 'grant_type=client_credentials&client_id=' + config.clientId
      + '&client_secret=' + config.clientSecret + '&scope=WFS_SERVICES'

    console.log('authenticationForm: %s', authenticationForm)

    superagent.post(config.authWFS)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(authenticationForm)
      .end(function (err, res) {
        console.info('err: %j, res: %j', err, res)
        expect(res.status).to.equal(200)

        //var token = res.access_token
        //expect(token).to.equal(200)


        done()
      })
  })

})