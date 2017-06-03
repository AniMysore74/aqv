/*
 * @constructor for Data
 */
function Data(url,user,aqmTag) {
    this.url = url;
    this.user = user;
    this.aqmTag = aqmTag;
    this.markers = [];
    this.infoWindows = [];
}
/*
 * setThresholds
 * Load thresholds from json 
 */

/*
 * setOAQData
 * Send http request to get all OAQ Data 
 */
Data.prototype.setOAQData = function() {
    var obj = this;
    httpGet(this.url, function(s){obj.setRBUser(s)});
}
/*
 * setRBUser
 * Get all channels of a user 
 */
Data.prototype.setRBUser = function(str) {
    this.OAQData = JSON.parse(str);
    var str = "http://139.59.43.105:3000/users/"+this.user+"/channels.json";
    var obj = this;
    httpGet(str, function(s){obj.setAQMChannels(s)});
}
/*
 * setAQMChannels
 * Store all channels with tag 'aqm' from a given user 
 */
Data.prototype.setAQMChannels = function(str) {
    var data = JSON.parse(str);  
    this.aqmIDS = [];
    this.RBData = [];
    for(var x in data.channels) {
        if(containsTag(data.channels[x],this.aqmTag)) {
            this.aqmIDS.push(data.channels[x].id);
        }  
    }
    for (var x in this.aqmIDS) {
        var obj = this;
        httpGet("http://139.59.43.105:3000/channels/"+this.aqmIDS[x]+"/feed.json?results=1",function(s){obj.aggregateRBData(s)});
    } 
}
/*
 * aggregateRBData
 * Push all AQM Channels to RBData member 
 */
Data.prototype.aggregateRBData = function(str) {
     var data = JSON.parse(str);
     this.RBData.push(data);
     if(this.RBData.length == this.aqmIDS.length) {
        console.log(this);
        this.mapify('nothing');
     }
}
/* 
 * mapify 
 * Adds markers to map from OAQ and RB data
*/
Data.prototype.mapify = function(parameter) {
    this.clearMap();
    var OAQlength = this.OAQData.results.length;
    var RBlength = this.RBData.length;
    var length = OAQlength+RBlength;
    for(var x=0; x<length; x++)
    {   
        var result, contentString, latLng;
        if(x<OAQlength) {
            result = this.OAQData.results[x];
            content = genOAQContent(result,parameter);
            latLng = new google.maps.LatLng(result.coordinates.latitude,result.coordinates.longitude);
        }
        else { 
            result = this.RBData[x-OAQlength];
            content = genRBContent(result,parameter);    
            latLng = new google.maps.LatLng(result.channel.latitude,result.channel.longitude);
        }
        
        this.infoWindows[x] = new google.maps.InfoWindow({
            content: content.string
        });
        this.markers[x] = new google.maps.Marker({
            position: latLng,
            map: map,
            title: result.location,
            icon: content.image
        });
        var obj = this;
        // javascript jazz to get around other javascript jazz
        this.markers[x].addListener('click', function(innerKey) {
            return function() {
                obj.infoWindows[innerKey].open(map, obj.markers[innerKey]);
                for(var i in obj.markers)
                {
                    if(i!=innerKey)
                    {
                        obj.infoWindows[i].close(map,obj.markers[x]);
                    }
                }
            }
            
        }(x));
    }
}
/* 
 * clearMap 
 * Removes all added markers
*/
Data.prototype.clearMap = function() {
    for(var x in this.markers) {
        this.markers[x].setMap(null);
        this.infoWindows[x] = null;
    }
    this.markers = [];
    this.infoWindows = [];
}
/*
 * createView
 * creates graph using specified parameter
 */
Data.prototype.createView = function(parameter) {
    DataObject.mapify(parameter);
    var generated = [];
    for(var x in this.OAQData.results) {
        var result = this.OAQData.results[x];
        for(var y in result.measurements) {
            var measurement = result.measurements[y];
            if(measurement.parameter == parameter) {
                var newRow = {};
                newRow.location = result.location;
                newRow.value = measurement.value;
                generated.push(newRow)
            }
        }
    }
    console.log(JSON.stringify(generated));
    plot(generated);
}
