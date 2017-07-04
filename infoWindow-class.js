/*
 * @constructor for InfoWindow
 */
function InfoWindow(content) {
    InfoWindow.content.push(content)
    InfoWindow.counter++;
    this.counter = InfoWindow.counter;
    $('#InfoWindow').append(
        '<div id="iw-'+this.counter+'"class="card InfoWindow iw-closed"><div class="card-content">'+InfoWindow.content[this.counter].content+'</div></div>'
    );
    return this;
}

InfoWindow.content = [];
InfoWindow.counter = -1;

InfoWindow.prototype.open = function(x) {
    $('#iw-'+x).removeClass('iw-closed');
    $('#iw-'+x).addClass('iw-opened');
}

InfoWindow.prototype.close = function(x) {
    $('#iw-'+x).removeClass('iw-opened');
    $('#iw-'+x).addClass('iw-closed');
}