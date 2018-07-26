const locations = [
    {
    title: "Oracle",
    coords: {
        /* lat and lng are copied from: https://en.wikipedia.org/wiki/Oracle_Corporation because I have to get a location to show a marker on the map.
         * https://en.wikipedia.org/wiki/Oracle_Corporation is copied from Google Chrome browser to make attribution of the copied lat and lng */
        lng: -122.265966,
        lat: 37.5294,
    },
    visible: ko.observable(true),
    clicked: ko.observable(false),
},
{
    title: "Googleplex",
    coords: {
        /* lat and lng are copied from: https://en.wikipedia.org/wiki/Googleplex because I have to get a location to show a marker on the map.
         * https://en.wikipedia.org/wiki/Googleplex is copied from Google Chrome browser to make attribution of the copied lat and lng */
        lng: -122.084,
        lat: 37.422,
    },
    visible: ko.observable(true),
    clicked: ko.observable(false),
},
{
    title: "Apple",
    coords: {
        /* lat and lng are copied from: https://en.wikipedia.org/wiki/Apple_Inc. because I have to get a location to show a marker on the map.
         * https://en.wikipedia.org/wiki/Apple_Inc. is copied from Google Chrome browser to make attribution of the copied lat and lng */
        lng: -122.03118,
        lat: 37.33182,
    },
    visible: ko.observable(true),
    clicked: ko.observable(false),
},
{
    title: "Cisco",
    coords: {
        /* lat and lng are copied from: https://en.wikipedia.org/wiki/Cisco_Systems because I have to get a location to show a marker on the map.
         * https://en.wikipedia.org/wiki/Cisco_Systems is copied from Google Chrome browser to make attribution of the copied lat and lng */
        lng: -121.954088,
        lat: 37.4083562,
    },
    visible: ko.observable(true),
    clicked: ko.observable(false),
},
{
    title: "Mozilla",
    coords: {
        /* lat and lng are copied from: https://en.wikipedia.org/wiki/Mozilla_Foundation because I have to get a location to show a marker on the map.
         * https://en.wikipedia.org/wiki/Mozilla_Foundation is copied from Google Chrome browser to make attribution of the copied lat and lng */
        lng: -122.08284,
        lat: 37.38792,
    },
    visible: ko.observable(true),
    clicked: ko.observable(false),
},
];

const init = {
    center: {
        /* lat and lng are copied from: https://en.wikipedia.org/wiki/Apple_Inc. because I have to get a location to set the center of the map.
         * https://en.wikipedia.org/wiki/Apple_Inc. is copied from Google Chrome browser to make attribution of the copied lat and lng */
        lng: -122.03118,
        lat: 37.33182,
    },
    zoom: 10,
};
