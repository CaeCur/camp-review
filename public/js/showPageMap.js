mapboxgl.accessToken = mapToken;
const campCoords = JSON.parse(campCoordsString);

const map = new mapboxgl.Map({
	container : "map", // container ID
	style     : "mapbox://styles/mapbox/streets-v11", // style URL
	center    : campCoords, // starting position [lng, lat]
	zoom      : 12 // starting zoom
});

const marker1 = new mapboxgl.Marker()
	.setLngLat(campCoords)
	.setPopup(
		new mapboxgl.Popup({ offset: 20, closeButton: false, maxWidth: "none", focusAfterOpen: false }).setHTML(
			`<h5>${campTitle}</h5><p>${campLocation}</p>`
		)
	)
	.addTo(map);
