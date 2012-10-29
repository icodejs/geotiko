
var Tiko = (function (window, document, $, undefined) {

  $(function () {

    var elements = {
      location     : $('.location'),
      map          : $('#map'),
      output       : $('.output'),
      searchButton : $('.search')
    };


    elements.searchButton.on('click', function (e) {
      e.preventDefault();

      var location = elements.location.val();

      if (location.length) {
        $.ajax({
          type     : 'GET',
          cache    : false,
          dataType : 'json',
          url      : '/search/' + location,
          success  : function (json) {
            var geoLocation;
            if (json.status === 'OK' && json.results && json.results.length ) {
              geoLocation = json.results[0].geometry.location;
              renderMap(geoLocation.lat, geoLocation.lng);
            }

            elements.output
                .find('pre')
                  .text(JSON.stringify(json, null, 2))
              .end().fadeIn();
          },
          error   : function(jqXHR, textStatus, err) {
            console.log(err);
          }
        });
      }
    });


    function renderMap(lat, lng) {
      var map, marker, infoWindow;

      // setup basic map
      map = new google.maps.Map(elements.map[0], {
        center    : new google.maps.LatLng(lat, lng),
        zoom      : 11,
        mapTypeId : google.maps.MapTypeId.ROADMAP
      });

      // add marker
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng)
      });
      marker.setMap(map);

      // add onlick info window
      infoWindow = new google.maps.InfoWindow({
        content: 'Your code for this region is: TK937'
      });

      google.maps.event.addListener(marker, 'click', function (e) {
        infoWindow.open(map, marker);
      });
    }

  }); // end jQuery

}(window, window.document, jQuery));
