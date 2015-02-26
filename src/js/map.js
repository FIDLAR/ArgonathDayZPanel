var shopIcon = L.icon({
	iconUrl: '../map/markers/supermarket.png',
	iconSize: [32, 27],
	iconAnchor: [16, 13.5],
	popupAnchor: [0, 0]
});

var aircraftIcon = L.icon({
	iconUrl: '../map/markers/airport.png',
	iconSize: [32, 27],
	iconAnchor: [16, 13.5],
	popupAnchor: [0, 0]
});

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

var sabinaTrader = L.marker([85.04142, -179.89434], {icon: shopIcon}).addTo(map);
var sabinaAircraftDealer = L.marker([85.04197, -179.88559], {icon: aircraftIcon}).addTo(map);
var heroTrader = L.marker([85.04554, -179.89348], {icon: shopIcon}).addTo(map);


sabinaTrader.bindPopup("Sabina Trader City");
sabinaAircraftDealer.bindPopup("Aircraft Dealer");
heroTrader.bindPopup("Hero Trader");

map.on('load', function(e) {

	console.log("Loaded.");

});

jQuery(document).ready(function($) {
	$('#map').height($( window ).height());
});

var dynamicMarkers;
var socket = io.connect("http://localhost:3035");

socket.on("mapData", function(data) {
	L.marker([data.lat, data.lng]).addTo(map);
});

map.on('click', function(e){
	var jData = {
		"lat": e.latlng.lat,
		"lng": e.latlng.lng
	}
	socket.emit('mapClick', jData);
});