var map;
function initialize() {
  var mapStyles = [
  {
    elementType: "labels",
    stylers: [
    {
      visibility: "off"
    }
    ]
  }, {
    featureType: "water",
    stylers: [
    {
      color: "#b4dedd"
    }
    ]
  }, {
    featureType: "road.highway",
    stylers: [
    {
      visibility: "off"
    }
    ]
  }, {
    featureType: "road",
    stylers: [
    {
      color: "#b4dedd"
    }
    ]
  }, {
    featureType: "landscape",
    stylers: [
    {
      color: "#fcf8f5"
    }
    ]
  }, {
    featureType: "administrative",
    stylers: [
    {
      visibility: "off"
    }
    ]
  }, {
    featureType: "poi",
    stylers: [
    {
      visibility: "off"
    }
    ]
  }, {
    featureType: "transit",
    stylers: [
    {
      visibility: "off"
    }
    ]
  }, {
    featureType: "road.arterial",
    stylers: [
    {
      weight: 0.5
    }
    ]
  }
  ];

  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(37.76, -122.436),
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    scaleControl: false,
    streetViewControl: false
  };

  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  map.setOptions({styles: mapStyles});

  // finds id and location
  var location_arr = {}
  $(".posts_location", ".main-content").each(function(){
    id = $(this).attr("name")
    location_arr[id] = $(this).val();
    return location_arr
  });


  allMarkers = []
  for (var id in location_arr) {
    (function (id_copy) {
      if (location_arr.hasOwnProperty(id_copy)){
        $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address='+ location_arr[id_copy] +'&sensor=false', null, function (data) {
          var p = data.results[0].geometry.location
          var latlng = new google.maps.LatLng(p.lat, p.lng);
          marker = new google.maps.Marker({
            position: latlng,
            icon: "/images/marker-orange.png",
            id: id_copy,
            map: map
          });
          allMarkers.push(marker);
        });
      };
    }(id));
  };

  google.maps.event.addListenerOnce(map, 'idle', function(){
    addEventToMap(allMarkers);
  });



// single page post location
var geocoder = new google.maps.Geocoder();

  if ($(".post_location").length > 0){
    var loc = $(".post_location").val()
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( {'address': loc}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

        var marker = new google.maps.Marker({
          position: results[0].geometry.location,
          icon: "/images/marker-orange.png"
        });

        marker.setMap(map);
        map.setZoom(16);
        map.panTo(results[0].geometry.location);

      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  };
};


function addEventToMap(allMarkers){
  if (allMarkers.length > 0){
    for (i in allMarkers){
      (function (i_copy) {
        google.maps.event.addListener(allMarkers[i_copy], "mouseover", function(){
          var id = allMarkers[i_copy].id;
          var post_id = "#" + id

          $(".post-preview", ".main-content").foggy({
                       blurRadius: 2,          // In pixels.
                       opacity: 0.8,           // Falls back to a filter for IE.
                       cssFilterSupport: true  // Use "-webkit-filter" where available.
                     });

          $(post_id).foggy(false);

        });

        google.maps.event.addListener(allMarkers[i_copy], "mouseout", function(){
          $(".post-preview", ".main-content").foggy(false);
        });

        google.maps.event.addListener(allMarkers[i_copy], "click", function(){
          var id = allMarkers[i_copy].id;
          console.log(id);
          var url = $('a[name="'+ id +'"]').attr('href')
          window.location = url
        });
      }(i));
    };
  };
};

google.maps.event.addDomListener(window, 'load', initialize);

