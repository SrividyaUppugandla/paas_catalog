/**
 * Created by Srividya on 19/05/16.
 */
var request = require('request');
var fs = require('fs');


var async = require('async');

var hashMap = require('hashmap');
var map = new hashMap();

//var DataCall = function(){
//};

/*
 This module is used to create the GIST structure.
 This api call needs data in body to create GIST data structure like description and files which we need to create.
 */
var createData = function(requestData,callback){
    var body = '';
    requestData.on('data', function (data) {
        body += data;
    });

    requestData.on('end',function(){
        //forming http request string
        var postOptions = {
            url:'https://api.github.com/gists',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic c3JpdmlkeWEudXBwdWdhbmRsYUBjb2duaXphbnQuY29tOlNyMXYxZHlh',
                'user-agent': 'node.js'
            },
            body:body
        };

        request(postOptions,function(err,response,body){
            if(err){
                return callback(err);
            }
            else {
                fs.writeFileSync('gistID.txt',JSON.parse(body).id,'utf8');
                return callback(null,JSON.stringify(response));
            }
        });
    });
};


var tempGetData = function(callback){
    fs.readFile('gistID.txt','utf-8',function(err,gistID){
        if(err) {
            return callback(err);
        }
        else {
            //forming http request string
            var getOptions = {
                url:'https://api.github.com/gists/'+gistID,
                method: 'GET',
                headers: {
                    'Authorization': 'Basic c3JpdmlkeWEudXBwdWdhbmRsYUBjb2duaXphbnQuY29tOlNyMXYxZHlh',
                    'user-agent': 'node.js'
                }
            };

            request(getOptions,function(err,response){
                if(err){
                    return callback(err);
                }
                else {
                    return callback(null,JSON.stringify(response));
                }
            });
        }
    });
};

/*
 This module is used to Edit the data.
 This api call needs data in body to edit  data structure like description and files which we need to edit.
 */
var editData = function(editedStr,callback){
    fs.readFile('gistID.txt','utf-8',function(err,gistID){
        if(err) {
            return callback(err);
        }
        else {
            var editedBody = '';
            editedStr.on('data', function (data) {
                editedBody += data;
            });

            editedStr.on('end',function(){
                //forming http request string
                var postOptions = {
                    url:'https://api.github.com/gists/'+gistID,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic c3JpdmlkeWEudXBwdWdhbmRsYUBjb2duaXphbnQuY29tOlNyMXYxZHlh',
                        'user-agent': 'node.js'
                    },
                    body:editedBody
                };

                request(postOptions,function(err,response){
                    if(err){
                        return callback(err);
                    }
                    else {
                        return callback(null,JSON.stringify(response));
                    }
                });
            });
        }
    });
};

var replaceStringCall = function(stringsDataArray,replaceCallBack){
    for(var i = 0; i < stringsDataArray.length; ++i) {
        var obj = stringsDataArray[i];
        for(var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var finalStr = obj[key];
                finalStr = finalStr.replace(/\\n/g, '').replace(/\\/g, '').replace(/ /g,'').replace("\"","").replace(new RegExp("\"" + '$'), "").replace(/\\r/g, "").replace(/\\t/g, "").replace(/\\f/g, "");
                map.set(key,JSON.parse(finalStr));
            }
        }
    }
    replaceCallBack(null,finalStr);
};

var switchResult = function(queryType,callback){
    switch (queryType)
    {
        case "category":
            callback(null,map.get("categoriesCollection"));
            break;
        case "services":
            callback(null,map.get("servicesCollection"));
            break;
        case "hooks":
            var hooksJSONObj =
            callback(null,map.get("hooksCollection"));
            break;
    }
};

/*
 This module is used to get the entire data.
 */
var getData = function(request,response,callbackHandler){
    var cachedJSON = map.get("categoriesCollection");


    if(cachedJSON){
        var callbackWithResult = function(err,result){
            if(err){
                callbackHandler(error);
            }
            else{
                if (request.query.type.toLowerCase() == 'services') {
                    if (request.query.category == null) {
                        callbackHandler(null,result);
                    }
                    else {
                        var category = request.query.category.toLowerCase();
                        var category = request.query.category.toLowerCase();
                        var hooksArray = map.get("servicesCollection").services;
                        var hooksReturnedArray = [];
                        for (var index = 0; index < hooksArray.length; index++) {
                            if(hooksArray[index].category.toLowerCase() == category){
                                hooksReturnedArray.push(hooksArray[index]);
                            }
                        }
                        callbackHandler({"services" : hooksReturnedArray});
                    }
                }
                else {
                    callbackHandler(null,result);
                }
            }
        };
        switchResult(request.query.type.toLowerCase(),callbackWithResult);
    }
    else {
        var callBack = function(error,result){
            if(error){
                callbackHandler(error);
            }
            else{
                if (request.query.type.toLowerCase() == 'services') {
                    if (request.query.category == null) {
                        callbackHandler(null,result);
                    }
                    else {
                        var category = request.query.category.toLowerCase();
                        var hooksArray = map.get("servicesCollection").services;
                        var hooksReturnedArray = [];
                        for (var index = 0; index < hooksArray.length; index++) {
                            if(hooksArray[index].category.toLowerCase() == category){
                                hooksReturnedArray.push(hooksArray[index]);
                            }
                        }
                        callbackHandler({"services" : hooksReturnedArray});
                    }
                }
                else {
                    callbackHandler(null,result);
                }
            }
        };
        var clientGetData = function(callBack){
            tempGetData(callBack);
        };
        async.waterfall([clientGetData,resultedDataBasedOnSelection],callBack);
    }

    function resultedDataBasedOnSelection(entireData,resultedDataFinalcallback){
        var stringData = JSON.parse(JSON.parse(entireData).body);

        var categoriesContent = JSON.stringify(stringData.files['Categories.json'].content);
        var servicesContent = JSON.stringify(stringData.files['Services.json'].content);
        var hooksContent = JSON.stringify(stringData.files['Hooks.json'].content);
        var bluemixContent = JSON.stringify(stringData.files['Bluemix.json'].content);

        var dataJSON = [{
            "categoriesCollection":categoriesContent,
            "servicesCollection":servicesContent,
            "hooksCollection":hooksContent,
            "bluemixCollection":bluemixContent
        }];

        var functioncallback = function(){
            var callbackWithResult = function(err,result){
                if(err){
                    resultedDataFinalcallback(error);
                }
                else{
                    resultedDataFinalcallback(null,result);
                }
            };
            switchResult(request.query.type.toLowerCase(),callbackWithResult);
        };

        replaceStringCall(dataJSON,functioncallback);
    }
};

/*
 This module is used to Search the data.
 */
var searchData = function(request,response,callback){
    /**
     * @namespace request.query.searchString
     */
    /**
     * @namespace resultedJson.categories
     */
    var cachedJSON = map.get("categoriesCollection");

    if(cachedJSON){
        searchFunction(cachedJSON,function(err,result){
            callback(null,result);
        });
    }
    else {
        var callBack = function(error,result){
            if(error){
                callback(error);
            }
            else{
                callback(null,result);
            }
        };

        var clientGetData = function(callBack){
            getData(request,response,callBack);
        };

        async.waterfall([clientGetData,searchFunction],callBack);
    }


    function searchFunction(resultedJson,callback){
        //resultedJson = resultedJson.replace(/\\n/g, '').replace(/\\/g, '').replace(/ /g,'').replace("\"","").replace(new RegExp("\"" + '$'), "").replace(/\\r/g, "").replace(/\\t/g, "").replace(/\\f/g, "");
        var returnedArray = [];
        var resultedJsonArray;

        if (!resultedJson.hasOwnProperty('categories')) {
            callback('No Results Found');
        }
        else {
            resultedJsonArray = resultedJson.categories;
            for (var index = 0; index < resultedJsonArray.length; index++) {
                if(resultedJsonArray[index].keys.indexOf(request.query.searchString.toLowerCase()) != -1){
                    returnedArray.push(resultedJsonArray[index]);
                }
            }
            callback(null,returnedArray);
        }
    }
};

var getOneCData = function(request,callback){
    var cachedData = map.get("categoriesCollection");
    var categoriesArray = cachedData.categories;
    for (var index = 0; index < categoriesArray.length; index++) {
        if(categoriesArray[index].id == request.query.id){
            callback(null,categoriesArray[index]);
            break;
        }
    }
    //cachedData = cachedData.replace(/\\n/g, '').replace(/\\/g, '').replace(/ /g,'').replace("\"","").replace(new RegExp("\"" + '$'), "").replace(/\\r/g, "").replace(/\\t/g, "").replace(/\\f/g, "");
};

/**
 * @namespace bluemixCachedData.metadata
 */
var getBluemixData = function(request,callback) {
    var bluemixCachedData = map.get("bluemixCollection");
    //bluemixCachedData = bluemixCachedData.replace(/\\n/g, '').replace(/\\/g, '').replace(/ /g,'').replace("\"","").replace(new RegExp("\"" + '$'), "").replace(/\\r/g, "").replace(/\\t/g, "").replace(/\\f/g, "");
    //var categoriesArray = JSON.parse(bluemixCachedData).metadata;
    //for (var index = 0; index < categoriesArray.length; index++) {
    //    console.log('inside for');
    //    if(categoriesArray[index].id == request.query.id){
    //        finalArray.push(categoriesArray[index]);
    //        break;
    //    }
    //}

    callback(null,bluemixCachedData.metadata);
};

/*
 This module is used to get the categories data.
 */
var getRelatedData = function(request,callback){
    var platformsStr = request.query.platform;

    var seletedPlatformsArray = platformsStr.split(',');

    var finalArray = [];

    for(var platformsIndex = 0; platformsIndex < seletedPlatformsArray.length; platformsIndex++){
        switch (seletedPlatformsArray[platformsIndex].toLowerCase()){
            case "cognizantone":
                var cognizantOnecallBack = function(error,data){
                    if(error) {
                        finalArray.push(error);
                    }
                    else {
                        finalArray.push(data);
                    }
                };

                getOneCData(request,cognizantOnecallBack);
                break;
            case "bluemix":
                var bluemixcallBack = function (error, data) {
                    if (error) {
                        finalArray.push(error);
                    }
                    else {
                        finalArray.push(data);
                    }
                };

                getBluemixData(request, bluemixcallBack);
                break;
            case "pivotal":
                break;
            case "azure":
                break;
        }
    }
    callback(null,finalArray);
};

exports.createData = createData;
exports.createData = editData;
exports.getData = getData;
exports.editData = editData;
exports.searchData = searchData;
exports.getRelatedData = getRelatedData;
