var superagent = require('superagent')
var expect = require('expect.js')
var config = require('./../../../config')()

describe('Unauthorised Connection ', function () {
  it('unauthorised should be rejected', function (done) {
    superagent.get(config.wfsSoilArea)
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

    superagent.post(config.auth)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(authenticationForm)
      .end(function (err, res) {
        console.info('err: %j, res: %j', err, res)
        expect(res.status).to.equal(200)

        var text = JSON.parse(res.text)
        console.info('text:%s', text)

        var token = text.access_token

        console.info('token: %s', token)
        superagent.get(config.wfsSoilArea)
          .set('Authorization', 'Bearer ' + token)
          .end(function (e, res) {
            console.info('err: %j, res: %j', err, res)
            expect(res.status).to.equal(200)
            done()
        })
      })
  })

})