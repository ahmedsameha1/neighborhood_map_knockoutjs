let map,
markers,
info_window,
map_loaded = false;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), init)
    markers = locations.map(location => new google.maps.Marker({
        title: location.title,
        position: location.coords,
        map,
        animation: google.maps.Animation.DROP
    }));
    markers.forEach( marker => { marker.addListener("click", () => { marker_clicked(marker);});});
    info_window = new google.maps.InfoWindow();
    map_loaded = true;
}

function ViewModel() {
    this.side_bar_shown = ko.observable(true);
    this.locations = ko.observableArray(locations);
    this.input_changed = function(vm, event) {
        if ( map_loaded ) {
            const value = event.target.value;
            // There is a text in the input
            if ( value ) {
                // Hide all markers
                markers.forEach(marker => {marker.setVisible(false);});
                // Remove the clicked style from all locations
                // Hide all locations
                locations.forEach(location => {location.visible(false); location.clicked(false);});
                info_window.close();
                locs = locations.filter(location => location.title.toLowerCase().indexOf(value.toLowerCase()) === 0);
                if (locs[0]) {
                    // Show the remaining location after filteration
                    locs[0].visible(true);
                    // Show the remaining marker after filteration
                    markers.filter(marker => marker.getTitle() === locs[0].title)[0].setVisible(true);
                }
            // The input is blank
            } else {
                // Show all markers
                markers.forEach(marker => {marker.setVisible(true);});
                // Show all locations
                locations.forEach(location => {location.visible(true);});
            }
        } else {
            alert("Error with the map");
        }
    };
    this.location_clicked = function(location) {
        if (map_loaded) {
            locations.forEach(loc => {
                if ( loc !== location ) {
                    // Remove the clicked location style
                    loc.clicked(false);
                } else {
                    // Add the clicked location style
                    loc.clicked(!loc.clicked());
                }
            });
            // Call the marker click handler
            marker_clicked(markers.filter(marker => marker.getTitle() === location.title)[0]);
        } else {
            alert("Error with the map");
        }
    };
    this.toggle_side_bar = function() {
        this.side_bar_shown(!this.side_bar_shown());
    };
}

const vm = new ViewModel;
ko.applyBindings(vm);

window.gm_authFailure = () => {
    map_loaded = false;
    alert("Problem with the map");
};

const marker_clicked = function(marker) {
    // The marker has is animated
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
        info_window.close();
        vm.locations().filter( location => location.title === marker.getTitle())[0].clicked(false);
    // The marker isn't animatied
    } else {
        stop_animations();
        marker.setAnimation(google.maps.Animation.BOUNCE);
        // Remove the style of a clicked location
        vm.locations().forEach( location => location.clicked(false));
        // Get the remaining location after filteration
        loc = vm.locations().filter( location => location.title === marker.getTitle())[0];
        // Add style of a clicked location
        loc.clicked(true);
        let info_window_content;
        if ( "data" in loc ) {
            // There is information for this location
            if (loc.data) {
                // "https://www.mediawiki.org/wiki/API:Showing_nearby_wiki_information" is copied from Google Chrome browser because I need to attribute a content.
                info_window_content = `<h1>${loc.data}</h1><p>Source: <a href="https://www.mediawiki.org/wiki/API:Showing_nearby_wiki_information">MediaWiki</a></p>`
            // Error while getting the information
            } else {
                info_window_content = `<h4>Error while loading information</h4>`
            }
        // Still waiting for information
        } else {
            info_window_content = `<h4>Waiting for information</h4>`;
        }
        info_window.setContent(info_window_content);
        info_window.open(map, marker);
    }
};

// Helper function that stop the animation of all markers
const stop_animations = function() {
    markers.forEach(marker => marker.setAnimation(null));
};

// Helper function that compose the url that will be used with fetch
const compose_url = function(coords) {
    // "/w/api.php?action=query&format=json&list=geosearch&gscoord=37.786952%7C-122.399523&gsradius=10000&gslimit=10" is copied from https://en.wikipedia.org/wiki/Special:ApiSandbox#action=query&format=json&list=geosearch&gscoord=37.786952%7C-122.399523&gsradius=10000&gslimit=10 I copied it because I think that I don't need to write it myself.
    // "https://en.wikipedia.org/wiki/Special:ApiSandbox#action=query&format=json&list=geosearch&gscoord=37.786952%7C-122.399523&gsradius=10000&gslimit=10" is copied from Google Chrome browser because I need to attribute a content.
    return `https://en.wikipedia.org/w/api.php?action=query&format=json&list=geosearch&gscoord=${coords.lat}%7C${coords.lng}&gslimit=1&origin=*`;
}

// Get the information from the mediawiki api
locations.forEach(location => {
    fetch(compose_url(location.coords))
    .then(response => {
        if ( response.ok ) {
            return response.json();
        } else {
            throw new Error("There is a problem with the response");
        }
    })
    .then(data => {
        // Add the data properity to the location object with the information
        location.data = data.query.geosearch[0].title;
    })
    .catch(error => {
        console.log(error);
        location.data = null;
    });
});
