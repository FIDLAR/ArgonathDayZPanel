var map = L.map('map', {
	maxZoom: 13,
	minZoom: 13
}).setView([0, 0], 13);

var southWest = map.unproject([0, 1024], map.getMaxZoom());
var northEast = map.unproject([1024, 0], map.getMaxZoom());
map.setMaxBounds(new L.LatLngBounds(southWest, northEast));

L.tileLayer('/map/{z}/map_{x}_{y}.png', {
	attribution: 'Map data from ctc-gaming'
}).addTo(map);

var sabinaTrader = L.marker([85.04142, -179.89434]).addTo(map);
var sabinaAircraftDealer = L.marker([85.04197, -179.88559]).addTo(map);
var heroTrader = L.marker([85.04554, -179.89348]).addTo(map);


sabinaTrader.bindPopup("Sabina Trader City");
sabinaAircraftDealer.bindPopup("Aircraft Dealer");
heroTrader.bindPopup("Hero Trader");

map.on('load', function(e) {

	console.log("Loaded.");

});

jQuery(document).ready(function($) {
	$('#map').height($( window ).height());
});

function onMapClick(e) {
	console.log("You clicked the map at " + e.latlng);
}



map.on('click', onMapClick);