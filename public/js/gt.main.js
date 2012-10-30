var GT = GT || {};

GT.main = (function (window, document, $, undefined) {
  'use strict';

  var elements, google = window.google;

  function init(el) {
    elements = el;
  }

  function getLatLong(location, callback) {
    if (location.length) {
      $.ajax({
        type     : 'GET',
        cache    : false,
        dataType : 'json',
        url      : '/search/' + location,
        success  : function (resp) {
          var geoLocation;
          if (resp.status === 'OK' && resp.results && resp.results.length) {
            geoLocation = resp.results[0].geometry.location;
            callback(null, geoLocation.lat, geoLocation.lng, resp);
          }
          else {
            callback(resp.status);
          }
        },
        error   : function(jqXHR, textStatus, err) {
          callback(err);
        }
      });
    }
  }


  function getDistance(loc1, loc2, callback) {
    var
    origin1 = new google.maps.LatLng(loc1.lat, loc1.lng),
    origin2 = new google.maps.LatLng(loc2.lat, loc2.lng),
    service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix({
      origins       : [origin1],
      destinations  : [origin2],
      travelMode    : google.maps.TravelMode.DRIVING,
      avoidHighways : false,
      avoidTolls    : false,
      unitSystem    : google.maps.UnitSystem.IMPERIAL
    },
    function (response, status) {
      var
      origins,
      destinations,
      element,
      distance,
      duration,
      from,
      to,
      results,
      i,
      j,
      output = [];

      if (status === 'OK') {
        origins      = response.originAddresses;
        destinations = response.destinationAddresses;

        for (i = 0; i < origins.length; i++) {
          results = response.rows[i].elements;

          for (j = 0; j < results.length; j++) {
            element  = results[j];
            distance = element.distance.text;
            duration = element.duration.text;
            from     = origins[i];
            to       = destinations[j];

            output.push('distance: ', distance + '\n');
            output.push('duration: ', duration + '\n');
            output.push('from: ', from + ': ' + loc1.lat + ', ' + loc1.lng + '\n');
            output.push('to: ', to + ': ' + loc2.lat + ', ' + loc2.lng + '\n');

            callback(null, output.join(''));
          }
        }
      }
      else {
        callback(status);
      }
    });
  }


  function renderMap(lat, lng) {
    var map;

    map = new google.maps.Map(elements.map[0], {
      center             : new google.maps.LatLng(lat, lng),
      zoom               : 11,
      disableDefaultUI   : true,
      mapTypeId          : google.maps.MapTypeId.ROADMAP,
      zoomControl        : true,
      zoomControlOptions : {
        style : google.maps.ZoomControlStyle.SMALL
      }
    });

    map.setOptions({styles: [
      {
        stylers : [{ hue: "#04C" }, { saturation: -60 }]
      },
      {
        featureType : "road",
        elementType : "geometry",
        stylers     : [{ lightness: 100 }, { visibility: "on" }]
      },
      {
        featureType : "road",
        elementType : "labels",
        stylers     : [{ visibility: "off" }]
      }
    ]});

    return map;
  }


  function setMapMarkers(map, lat, lng) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng)
    });
    marker.setMap(map);
  }


  return {
    getDistance   : getDistance,
    getLatLong    : getLatLong,
    init          : init,
    renderMap     : renderMap,
    setMapMarkers : setMapMarkers
  };

}(window, window.document, jQuery));
