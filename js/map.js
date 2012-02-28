$(function(){
  var map,
      latlng,
      centerMarker,
      geocoder;

  /*********************************
   * 地図情報の初期化
   */
  var initialize = (function () {
    var opts;

    // 中心地の軽度緯度
    latlng = new google.maps.LatLng(35.607002,139.749107),

    // 地図の設定
    mapopts = {
      zoom: 11,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      navigationControlOptions: {
        style: google.maps.NavigationControlStyle.ANDROID
      }
    };

    map = new google.maps.Map(
      document.getElementById('map_canvas'),
      mapopts
    );

    // 中心地のマーカー設定
    centerMarker = new google.maps.Marker({
      map: map,
      position: latlng
    });
  })();

  /*********************************
   * 住所から地図を探す
   */
  var search_text = $('#search_text').textinput();
  search_text.bind('change', function (event, ui) {
    var address = this.value;
    geocoder = new google.maps.Geocoder();

    geocoder.geocode({'address': address}, function (results, status){
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        centerMarker.setPosition(results[0].geometry.location)
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  });

});
