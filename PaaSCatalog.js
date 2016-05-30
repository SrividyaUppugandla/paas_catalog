/**
 * Created by Srividya on 23/05/16.
 */
var express = require('express');
var router = express.Router();

var async = require('async');

var dataClient = require('./DataClient.js');
//var dataClient = new DataClient();

var app = express();

/*
This rest api is used to create the GIST structure.
This api call needs data in body to create GIST data structure like description and files which we need to create.
 */
router.route('/createCatalog')
    .post(function(request, response){

        var callBack = function(error,result){
            if(error){
                response.send(error);
            }
            else{
                response.send(result);
            }
        };

        var createData = function(callBack){
            dataClient.createData(request,callBack);
        };
        async.waterfall([createData],callBack);
    });

/*
 This rest api is used to get the entire data.
 */
router.route('/catalog')
    .get(function(request, response){
        var callbackHandler = function(error,result){
            if(error){
                response.send(error);
            }
            else{
                response.send(result);
            }
        };
        dataClient.getData(request,response,callbackHandler);
    });

/*
 This rest api is used to Edit the data.
 This api call needs data in body to edit  data structure like description and files which we need to edit.
 */
router.route('/editCatalog')
    .patch(function(request, response){

        var callBack = function(error,result){
            if(error){
                response.send('Creation Error**'+error);
            }
            else{
                response.send(result);
            }
        };
        var editData = function(callBack){
            dataClient.editData(request,callBack);
        };
        async.waterfall([editData],callBack);
    });


/*
 This rest api is used to Search the data.
 This api call needs searchstring & type of search like need category,hooks as query parameters.
 */
router.route('/searchCatalog')
    .get(function(request, response){
        var callBack = function(error,result){
            if(error){
                response.send(error);
            }
            else{
                if (result.length == 0) {
                    response.send('No Results Found');
                }
                else {
                    response.send(result);
                }
            }
        };
        var searchData = function(callBack){
            dataClient.searchData(request,response,callBack);
        };
        async.waterfall([searchData],callBack);
    });

/*
 This rest api is used to get the categories data.
 This api call needs id of category & platforms as query parameters.
 */
router.route('/platformservices')
    .get(function(request,response){
        var callBack = function(error,result){
            if(error){
                response.send(error);
            }
            else{
                if (result.length == 0) {
                    response.send('No Results Found');
                }
                else {
                    response.send(result);
                }
            }
        };
        var relatedData = function(callBack){
            dataClient.getRelatedData(request,callBack);
        };
        async.waterfall([relatedData],callBack);
    });

app.use('/PaaSCatalog',router);

var port = 3030;

app.listen(port);

console.log('Listening on port ...'+ port);