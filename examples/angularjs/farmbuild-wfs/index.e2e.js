var superagent = require('superagent');
var expect = require('expect.js');
var config = require('./../../confige2e')();


describe('WFS Soils Connection ', function () {
  it('retrieve soils response', function (done) {
        console.info('config.wfsSampleEndPoints.soils: %s', config.wfs.soils);
        config.wfs.soils =config.wfs.soils+'&maxFeatures=50';
        superagent.get(config.wfs.soils)
          .end(function (e, res) {
            console.info('err: %j, res: %j',e, res);
            expect(res.status).to.equal(200);
            done();
        })

  })

})