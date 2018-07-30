let map,
markers,
info_window;

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
}

function ViewModel() {
    this.side_bar_shown = ko.observable(true);
    this.locations = ko.observableArray(locations);
    this.input_changed = function(vm, event) {
        const value = event.target.value;
        if ( value ) {
            markers.forEach(marker => {marker.setVisible(false);});
            locations.forEach(location => {location.visible(false); location.clicked(false);});
            info_window.close();
            locs = locations.filter(location => location.title.toLowerCase().indexOf(value.toLowerCase()) === 0);
            if (locs[0]) {
                locs[0].visible(true);
                markers.filter(marker => marker.getTitle() === locs[0].title)[0].setVisible(true);
            }
        } else {
            markers.forEach(marker => {marker.setVisible(true);});
            locations.forEach(location => {location.visible(true);});
        }
    };
    this.location_clicked = function(location) {
        locations.forEach(loc => {
            if ( loc !== location ) {
                loc.clicked(false);
            } else {
                loc.clicked(!loc.clicked());
            }
        });
        marker_clicked(markers.filter(marker => marker.getTitle() === location.title)[0]);
    };
    this.toggle_side_bar = function() {
        this.side_bar_shown(!this.side_bar_shown());
    };
}
const vm = new ViewModel;
ko.applyBindings(vm);

window.gm_authFailure = () => { alert("Problem with the map");};

const marker_clicked = function(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
        info_window.close();
        vm.locations().filter( location => location.title === marker.getTitle())[0].clicked(false);
    } else {
        stop_animations();
        marker.setAnimation(google.maps.Animation.BOUNCE);
        vm.locations().forEach( location => location.clicked(false));
        loc = vm.locations().filter( location => location.title === marker.getTitle())[0];
        loc.clicked(true);
        let info_window_content;
        if ( "data" in loc ) {
            if (loc.data) {
                // "https://www.mediawiki.org/wiki/API:Showing_nearby_wiki_information" is copied from Google Chrome browser because I need to attribute a content.
                info_window_content = `<h1>${loc.data}</h1><p>Source: <a href="https://www.mediawiki.org/wiki/API:Showing_nearby_wiki_information">MediaWiki</a></p>`
            } else {
                info_window_content = `<h4>Error while loading information</h4>`
            }
        } else {
            info_window_content = `<h4>Waiting for information</h4>`;
        }
        info_window.setContent(info_window_content);
        info_window.open(map, marker);
    }
};

const stop_animations = function() {
    markers.forEach(marker => marker.setAnimation(null));
};

const compose_url = function(coords) {
    // /w/api.php?action=query&format=json&list=geosearch&gscoord=37.786952%7C-122.399523&gsradius=10000&gslimit=10 is copied from https://en.wikipedia.org/wiki/Special:ApiSandbox#action=query&format=json&list=geosearch&gscoord=37.786952%7C-122.399523&gsradius=10000&gslimit=10 I copied it because I think that I don't need to write it myself.
    // https://en.wikipedia.org/wiki/Special:ApiSandbox#action=query&format=json&list=geosearch&gscoord=37.786952%7C-122.399523&gsradius=10000&gslimit=10 is copied from Google Chrome browser because I need to attribute a content.
    return `https://en.wikipedia.org/w/api.php?action=query&format=json&list=geosearch&gscoord=${coords.lat}%7C${coords.lng}&gslimit=1&origin=*`;
}

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
        location.data = data.query.geosearch[0].title;
    })
    .catch(error => {
        console.log(error);
        location.data = null;
    });
});
