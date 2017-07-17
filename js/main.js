function AppViewModel() {
  // Styles for map
  const styles = [{
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#7c93a3',
    },
    {
      lightness: '-10',
    },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry',
    stylers: [{
      visibility: 'on',
    }],
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#a0a4a5',
    }],
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#62838e',
    }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#dde3e3',
    }],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#3f4a51',
    },
    {
      weight: '0.30',
    },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [{
      visibility: 'simplified',
    }],
  },
  {
    featureType: 'poi.attraction',
    elementType: 'all',
    stylers: [{
      visibility: 'on',
    }],
  },
  {
    featureType: 'poi.business',
    elementType: 'all',
    stylers: [{
      visibility: 'off',
    }],
  },
  {
    featureType: 'poi.government',
    elementType: 'all',
    stylers: [{
      visibility: 'off',
    }],
  },
  {
    featureType: 'poi.park',
    elementType: 'all',
    stylers: [{
      visibility: 'on',
    }],
  },
  {
    featureType: 'poi.place_of_worship',
    elementType: 'all',
    stylers: [{
      visibility: 'off',
    }],
  },
  {
    featureType: 'poi.school',
    elementType: 'all',
    stylers: [{
      visibility: 'off',
    }],
  },
  {
    featureType: 'poi.sports_complex',
    elementType: 'all',
    stylers: [{
      visibility: 'off',
    }],
  },
  {
    featureType: 'road',
    elementType: 'all',
    stylers: [{
      saturation: '-100',
    },
    {
      visibility: 'on',
    },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{
      visibility: 'on',
    }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#bbcacf',
    }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{
      lightness: '0',
    },
    {
      color: '#bbcacf',
    },
    {
      weight: '0.50',
    },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels',
    stylers: [{
      visibility: 'on',
    }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text',
    stylers: [{
      visibility: 'on',
    }],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#ffffff',
    }],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#a9b4b8',
    }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.icon',
    stylers: [{
      invert_lightness: true,
    },
    {
      saturation: '-7',
    },
    {
      lightness: '3',
    },
    {
      gamma: '1.80',
    },
    {
      weight: '0.01',
    },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [{
      visibility: 'off',
    }],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{
      color: '#a3c7df',
    }],
  },
  ];
  const self = this;
  const defaultLocation = {
    lat: 33.4484,
    lng: -112.0740,
  };
  let infoWindow;
  let name;
  let lat;
  let lng;
  let myLatLng;
  let address;
  let activeInfoWindow;
  let map;
  let fourSquareBaseURL;
  let latLng;
  let query;
  let foursquareID;
  let fourSquareURL;
  let rating;
  let marker;


  // Ko variables
  self.filterLocations = ko.observable('');
  self.mapMarkers = ko.observableArray([]);
  self.mapLocations = ko.observableArray([]);
  // Filter makers and list view against input
  self.filteredArray = ko.computed(() => ko.utils.arrayFilter(self.mapMarkers(), (item) => {
    // Check if title matches search 
    if (item.marker.title.toLowerCase().indexOf(self.filterLocations().toLowerCase()) !== -1) {
      // Display matching Markers
      if (item.marker) {
        item.marker.setMap(map);
      }
    } else if (item.marker) {
      item.marker.setMap(null);
    }
    return item.marker.title.toLowerCase().indexOf(self.filterLocations().toLowerCase()) !== -1;
  }), self);

  // Pan to an open content window when list item is clicked
  self.clickMarker = function (venue) {
    const hikingMarker = venue.marker.title.toLowerCase();
    self.mapMarkers().forEach((marker, i) => {
      const title = marker.marker.title.toLowerCase();
      if (title === hikingMarker) {
        google.maps.event.trigger(marker.marker, 'click');
        map.panTo(marker.marker.position);
      }
    });
  };

  // Load google map
  function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
      center: defaultLocation,
      // Add custom map styles
      styles,
      zoom: 12,
      mapTypeId: 'terrain',
      disableDefaultUI: true,
    });

    // Make google map responsive to window size
    google.maps.event.addDomListener(window, 'resize', () => {
      const center = map.getCenter();
      google.maps.event.trigger(map, 'resize');
      map.setCenter(center);
    });
    if (typeof google === 'object' && typeof google.maps === 'object') {
      // Request hiking Locations
      getHikingLocations();
    } else {
      alert('Something went wrong, Please try again Later!')
    }
  }

  // Initialize Map
  initMap();

  function getHikingLocations() {
    // Create fourSqaureURL
    fourSquareBaseURL = 'https://api.foursquare.com/v2/venues/explore?v=20161016';
    latLng = '&ll=33.6054149,-112.125051';
    query = '&query=hiking&venuePhotos=1';
    foursquareID = '&client_id=F4KN0OJRGLK2LRYPPAK00LZJZQORBV3VTG3MRIW3IEBIPJJX&client_secret=HAVP4AJMFWEQVHITPVMCISXSRJ3XFUKIZ5TBIKXJLZ5GTVEM';
    fourSquareURL = `${fourSquareBaseURL}${latLng}${query}${foursquareID}`;
    // Fetch fourSquare Map data
    fetch(fourSquareURL, {
      method: 'GET',
    }).then(resp => resp.json())
      .then((data) => {
        const responseArray = data.response.groups['0'].items;
        const mapBounds = data.response;

        // Push results to mapMarkers Array
        responseArray.forEach((res) => {
          self.mapLocations().push(res);
        });
        placeMapMarkers(self.mapLocations());
        setBounds(mapBounds);
      }).catch((err) => {
        // Error :(
        alert('Something went wrong, Please try again Later!');
      });
  }

  // Set Map Boundaries based on foursquare map suggested map boundaries
  function setBounds(bounds) {
    const mapBounds = bounds.suggestedBounds;
    if (mapBounds !== undefined) {
      bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(mapBounds.sw.lat, mapBounds.sw.lng),
        new google.maps.LatLng(mapBounds.ne.lat, mapBounds.ne.lng));
      map.fitBounds(bounds);
    }
  }

  // Place all map markers from foursquare response
  function placeMapMarkers(arr) {
    // Create new marker for each location
    arr.forEach((location, i) => {
      infoWindow = new google.maps.InfoWindow();
      name = location.venue.name;
      lat = location.venue.location.lat;
      lng = location.venue.location.lng;
      myLatLng = { lat, lng };
      address = location.venue.location.formattedAddress['0'];
      rating = location.venue.rating;

      // Content String for mapMarkers
      const contentString = `<div class="marker-window"">
        <h3 class="hike-title">${name}</h3>
        <h4>${(address === undefined) ? '' : address}</h4>
        <p><strong>Popularity:</strong> <span class="hike-rating">${(rating === undefined) ? 'No Rating' : `${rating}/10`}</span></p>
        <p>${(location.tips === undefined) ? '' : `<strong>Tips: </strong> ${location.tips['0'].text}`}</p>
        <img src="https://maxcdn.icons8.com/Share/icon/Logos//foursquare1600.png" alt="foursquare icon"/>
      </div > `;

      marker = new google.maps.Marker({
        map,
        title: name,
        position: myLatLng,
      });

      self.mapMarkers.push({ marker, contentString });

      // AddListner for each marker
      (function (marker) {
        google.maps.event.addListener(marker, 'click', () => {
          activeInfoWindow && activeInfoWindow.close();
          infoWindow.setContent(contentString);
          infoWindow.open(map, marker);
          toggleBounce(marker);
          activeInfoWindow = infoWindow;
        });
      }(marker));
    });

    function toggleBounce(marker) {
      if (marker.getAnimation() !== null || marker.getAnimation() === undefined) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {
          marker.setAnimation(null);
        }, 800);
      }
    }
  }
}



