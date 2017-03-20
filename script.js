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
        for(var x in data.results)
        {
            var result = data.results[x]
            var contentString = generateContentString(result);
            var latLng = new google.maps.LatLng(result.coordinates.latitude,result.coordinates.longitude);

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: result.location
            });
            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });
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

var map;

