var co = require(process.cwd() + '/config/dataList.js');
var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;
describe('config', function() {
    it('require config/dataList.js', function(done) {
        expect(co).to.be.an('object');
        console.log(co)
        done()
    });
});
