/* Initialize Material */
$(document).ready(function() {
    $('select').material_select();
});
var map;
var DataObject = new Data("https://api.openaq.org/v1/latest?city=Bengaluru","gautamp@reapbenefit.org", "aqm");

DataObject.setOAQData();
/* 
 * initMap
 * Called when Maps API code loads
*/
function initMap() {
    var city = {lat: 12.97, lng: 77.59}; 
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: city
    });
}
/*
 * Event handler
 * Whenever option is changed 
*/
$(".areawise-parameter").change(function(){
    var val = $(this).val();
    console.log(val); 
    if(val!="disabled"){
        DataObject.createView(val);
    }
});