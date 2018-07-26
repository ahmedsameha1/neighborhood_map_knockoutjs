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
    this.locations = ko.observableArray(locations);
    this.input_changed = function(vm, event) {
        const value = event.target.value;
        if ( value ) {
            markers.forEach(marker => {marker.setVisible(false);});
            this.locations.forEach(location => {location.visible(false);});
            locs = locations.filter(location => location.title.toLowerCase.indexOf(value.toLowerCase()) > -1);
            if (locs[0]) {
                locs[0].visible(true);
                markers.filter(marker => marker.getTitle() === locs[0].title()).setVisible(true);
            }
        } else {
            markers.forEach(marker => {marker.setVisible(true);});
            this.locations.forEach(location => {location.visible(true);});
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
}

ko.applyBindings(new ViewModel);

window.gm_authFailure = () => { alert("Problem with the map");};

const marker_clicked = function(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
        info_window.close();
    } else {
        stop_animations();
        marker.setAnimation(google.maps.Animation.BOUNCE);
        info_window.open(map, marker);
    }
};

const stop_animations = function() {
    markers.forEach(marker => marker.setAnimation(null));
};
