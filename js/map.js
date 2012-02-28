$(function(){
  /*********************************
   * 地図情報の初期化
   */
  var centerMarker = (function () {

    // 中心地の軽度緯度
    var latlng = new google.maps.LatLng(35.607002,139.749107);

    // 地図の設定
    var mapopts = {
      zoom: 11,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      navigationControlOptions: {
        style: google.maps.NavigationControlStyle.ANDROID
      }
    };

    var map = new google.maps.Map(
      document.getElementById('map_canvas'),
      mapopts
    );

    // 中心地のマーカー設定
    return new google.maps.Marker({
      map: map,
      position: latlng
    });
  })();

  /*********************************
   * 住所から地図を探す
   */
  $('#search_text').textinput().bind('change', function (event, ui) {
    var address = $(this).val();
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'address': address}, function (results, status){
      var location;
      if (status == google.maps.GeocoderStatus.OK) {
        location = results[0].geometry.location;
        centerMarker.map.setCenter(location);
        centerMarker.setPosition(location);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  });

});
