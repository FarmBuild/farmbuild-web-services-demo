var superagent = require('superagent')
var expect = require('expect.js')
var fs = require('fs')
var path = require('path')
var config = require('./../../confige2e')()


describe('WFS Soil Areas Connection ', function () {
  it('retrieve soil area response', function (done) {

    var authenticationForm = 'grant_type=client_credentials&client_id=' + config.authentication.clientId
      + '&client_secret=' + config.authentication.clientSecret + '&scope='+config.authentication.scopes.SOIL_AREA;


    superagent.post(config.authentication.url)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(authenticationForm)
      .end(function (err, res) {
        console.info('Authenticate soil area service err: %j, res: %j', err, res)
        expect(res.status).to.equal(200)

        var text = JSON.parse(res.text)
        var token = text.access_token;
        var susanFarmData = fs.readFileSync(path.resolve('examples/lib/farmdata-susan.json'),'utf8');
        console.log("Read Susan's farm data from file",susanFarmData);

        var req = superagent.post(config.wfs.soilareas);
        req.set('Authorization', 'Bearer ' + token);
        req.send(susanFarmData);

        req.end(function (e, res) {
        console.info('err: %j, res: %j /n response status', err, res , res.status);

         expect(res.status).to.equal(200)
            done()
         });

      })
  })
})