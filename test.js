/**
 * Created by Srividya on 27/05/16.
 */
//var assert = require('chai').assert;
//describe('Array', function() {
//    describe('#indexOf()', function () {
//        it('should return -1 when the value is not present', function () {
//            assert.equal(-1, [1,2,3].indexOf(5));
//            assert.equal(-1, [1,2,3].indexOf(0));
//        });
//    });
//});



var supertest = require("supertest");
var should = require("should");
var url = require('url');

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3030");

// UNIT test begin

describe("SAMPLE unit test",function(){

    // #1 should return home page


    it("should return response",function(done){
        //var queryParams = url.parse("/getCatalog?type=category", true);
        //var type = queryParams.query.type;
        //console.log(type);
        server.get('/getCatalog')
              .expect(201)
              //.send({type: 'category'})
              .end(function(err,res){
                    //res.body.error.should.equal(false);
                    console.log('My Response' + JSON.stringify(res));
                    done();
        });
        //done();
    });

});