/* Initialize Material */

  $(document).ready(function() {
    $('select').material_select();
  });
   
/* 
 * httpGet
 * Sends a HTTP GET request asyncronously. Calls callback() when request returns
 * http://stackoverflow.com/questions/247483/http-get-request-in-javascript
*/
function httpGet(url, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); 
    xmlHttp.send(null);
}
/* 
 * mapify 
 * Adds markers to map using a json string returned from api callback
*/
function mapify(jsonString)
{
    var data = JSON.parse(jsonString);
    if(data.meta.found)
    {
        var markers = [];
        var infoWindows =[];
        for(var x in data.results)
        {
            var result = data.results[x]
            var contentString = generateContentString(result);
            var latLng = new google.maps.LatLng(result.coordinates.latitude,result.coordinates.longitude);

            infoWindows[x] = new google.maps.InfoWindow({
                content: contentString
            });
            markers[x] = new google.maps.Marker({
                position: latLng,
                map: map,
                title: result.location
            });
            markers[x].addListener('click', function(innerKey) {
                return function() {
                    infoWindows[innerKey].open(map, markers[innerKey]);
                }
                
            }(x));
        }
    }

}
/* 
 * generateContentString
 * Generates HTML contentString from an array of measurements
*/
function generateContentString(result)
{ 
    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h3 id="firstHeading" class="firstHeading">'+result.location+'</h3>'+'<div id="bodyContent">'+'<ul class = "measurements">';
    for(var x in result.measurements)
    {
        var measurement = result.measurements[x];
        contentString += '<li>' + measurement.parameter + ' : ' + measurement.value + ' ' + measurement.unit + '</li>';
    }
    contentString += '</ul></div></div>';
    return contentString;
}
/* 
 * initMap
 * Called when Maps API code loads
*/
function initMap() {
    var city = {lat: 12.97, lng: 77.59}; 
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: city
    });
    httpGet("https://api.openaq.org/v1/latest?city=Bengaluru",mapify);
}
/*
 * Event handler
 * Whenever option is changed 
*/
$(".areawise-parameter").change(function(){
    var val = $(this).val();
    console.log(val); 
    if(val!="disabled"){
        httpGet("https://api.openaq.org/v1/latest?city=Bengaluru&parameter="+val,createView);
    }
});
/*
 * createView
 * Sets the right variables and calls plot 
 */
function createView(result) {
    console.log(result);
    var data = JSON.parse(result);
    var generated = [];
    if(data.meta.found) {
        for(var x in data.results) {
            var newRow = {};
            newRow.location = data.results[x].location;
            newRow.value = data.results[x].measurements[0].value;
            console.log(JSON.stringify(newRow));
            generated.push(newRow)
        }
    }
    console.log(JSON.stringify(generated));
    plot(generated);
}

var map;

