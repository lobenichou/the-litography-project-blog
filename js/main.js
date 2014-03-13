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

  var map = new google.maps.Map(document.getElementById("map"),
    mapOptions);

  map.setOptions({styles: mapStyles});


  geocoder = new google.maps.Geocoder();

    // gets the location for each post into an array
    var location_arr = []
    $(".posts_location", ".main-content").each(function(){
      location_arr.push($(this).val());
      return location_arr
    });

  // Adds markers to map
  var allMarkers = []
  var counter = 0
  for (i in location_arr){
    geocoder.geocode( { 'address': location_arr[i]}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

        var marker = new google.maps.Marker({
          position: results[0].geometry.location,
          icon: "/images/marker-orange.png",
          id: counter++
        });

        marker.setMap(map);
        allMarkers.push(marker);

        google.maps.event.addListener(marker, "mouseover", function(){
          id = marker.id;
          pos = marker.position
          post_id = "#" + id
          console.log(id, post_id, pos)
          $(".post-preview", ".main-content").foggy({
                 blurRadius: 2,          // In pixels.
                 opacity: 0.8,           // Falls back to a filter for IE.
                 cssFilterSupport: true  // Use "-webkit-filter" where available.
               });

          $(post_id).foggy(false);

        });

        google.maps.event.addListener(marker, "mouseout", function(){
          $(".post-preview", ".main-content").foggy(false);
        });


        google.maps.event.addListener(marker, "click", function(){
          id = marker.id;
          console.log(id);
          url = $('a[name="'+ id +'"]').attr('href')
          window.location = url
        });

      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
};

if ($(".post_location").length > 0){
  loc = $(".post_location").val()
  geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': loc}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var marker = new google.maps.Marker({
        position: results[0].geometry.location,
        icon: "/images/marker-orange.png"
      });
      marker.setMap(map)
      map.setZoom(16);
      map.panTo(results[0].geometry.location);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
};
};



google.maps.event.addDomListener(window, 'load', initialize);