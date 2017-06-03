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
 * containsTag
 * Utility function to check if given channel contains a specified tag 
 */
function containsTag(channel, tag)
{
    for(var x in channel.tags)
    {
        if(channel.tags[x].name==tag)
            return true;
    }
    return false;
}

/* 
 * genOAQContent
 * Generates marker content from an array of measurements
*/
function genOAQContent(result,parameter)
{ 
    var content={}, flag=0, mFill, tFill='000', text;
    content.string = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h3 id="firstHeading" class="firstHeading">'+result.location+'</h3>'+'<div id="bodyContent">'+'<ul class = "measurements">';
    for(var x in result.measurements)
    {
        var measurement = result.measurements[x];
        content.string += '<li>' + measurement.parameter + ' : ' + measurement.value + ' ' + measurement.unit + '</li>';
        if(measurement.parameter==parameter)
        {
            flag=1;
            text=measurement.value;
            //compute thresholds here and calculate color
            mFill="fff";
        }
    }
    if(!flag)
    {
        text = "CBCB";
        mFill = "ccc";
    }
    content.string += '</ul></div></div>';
    content.image = genMarker(mFill, tFill, text); 
    return content;
}
/* 
 * genRBContent
 * Generates marker content from an array of measurements
*/
function genRBContent(data, parameter)
{
    var content = {};
    content.string = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h3 id="firstHeading" class="firstHeading">'+data.channel.name+'</h3>'+'<div id="bodyContent">'+'<ul class = "measurements">';
    
    content.string += '<li>' + data.channel.field1 + ' : ' + data.feeds[0].field1 + '</li>';
    content.string += '<li>' + data.channel.field2 + ' : ' + data.feeds[0].field2 + '</li>';
    content.string += '<li>' + data.channel.field3 + ' : ' + data.feeds[0].field3 + '</li>';

    content.string += '<li>' + 'Updated : ' + data.feeds[0].created_at + '</li>';

    content.string += '</ul></div></div>';
    content.image = genMarker("ffef31","000","RB")
    return content;
}
/* 
 * genMarker
 * Generates a url-encoded SVG marker with specified color,textcolor, and text
*/
function genMarker(mFill, tFill,text) {
    var image = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='15.480996mm' width='11.288889mm' viewBox='0 0 40.000001 54.853924' id='svg2'%3E%3Cdefs id='defs8'%3E%3Cfilter id='filter3681' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0.498039' flood-color='%23000' result='flood' id='feFlood3683'/%3E%3CfeComposite in='flood' in2='SourceGraphic' operator='in' result='composite1' id='feComposite3685'/%3E%3CfeGaussianBlur in='composite1' stdDeviation='3' result='blur' id='feGaussianBlur3687'/%3E%3CfeOffset dx='2' dy='2' result='offset' id='feOffset3689'/%3E%3CfeComposite in='SourceGraphic' in2='offset' result='composite2' id='feComposite3691'/%3E%3C/filter%3E%3Cfilter id='filter4485' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0.498039' flood-color='%23000' result='flood' id='feFlood4487'/%3E%3CfeComposite in='flood' in2='SourceGraphic' operator='out' result='composite1' id='feComposite4489'/%3E%3CfeGaussianBlur in='composite1' stdDeviation='3' result='blur' id='feGaussianBlur4491'/%3E%3CfeOffset dy='1.38778e-16' result='offset' id='feOffset4493'/%3E%3CfeComposite in='offset' in2='SourceGraphic' operator='atop' result='composite2' id='feComposite4495'/%3E%3C/filter%3E%3CclipPath id='clipPath3187'%3E%3Cpath id='rect3189' fill='%23fff' d='M86.953659 265.32013H253.057439V351.158997H86.953659z'/%3E%3C/clipPath%3E%3C/defs%3E%3Cpath d='m 310.02064,587.29285 c -54.20163,-1.5e-4 -98.14077,43.93899 -98.14062,98.14062 0.0254,18.20912 5.1162,36.05213 14.70312,51.53321 11.26125,18.29803 27.8606,40.55417 41.37305,59.74804 l 42.06445,59.74805 42.06445,-59.74805 c 13.66709,-19.98645 27.7151,-39.71713 41.31446,-59.74804 9.60751,-15.475 14.71877,-33.31843 14.76172,-51.53321 1.5e-4,-54.20163 -43.939,-98.14077 -98.14063,-98.14062 z' id='path3570' transform='matrix%28.16982 0 0 .16982 -32.65 -95.165%29' fill='";
    image += '%23'+mFill;
    image +="' fill-rule='evenodd' filter='url%28%23filter3681%29'/%3E%3Ctext fill='";
    image += '%23'+tFill;
    image += "' id='text3497' y='24.561106' x='20.21372' style='line-height:125%25;text-align:center' font-size='9.02916908px' font-family='sans-serif' letter-spacing='0px' word-spacing='0px' text-anchor='middle' stroke-width='1px'%3E%3Ctspan y='24.561106' x='20.21372' id='tspan3499'%3E";
    image += text;
    image += "%3C/tspan%3E%3C/text%3E%3C/svg%3E";
    return image;
} 