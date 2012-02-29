$(function(){
  /*********************************
   * 各種オプション
   */
  var options = function (){
    // 出発点(初期値:東京駅)
    var latlng = new google.maps.LatLng(35.681382,139.766084);

    return {
      // 地図オプション
      map: {
        zoom: 13,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP, // 通常のマップ形式
        navigationControlOptions: {
          style: google.maps.NavigationControlStyle.ANDROID // Androidタイプのナビゲーションコントロール
        }
      },
      marker: {
        map: undefined, // あとで設定する
        position: latlng
      },
      info_window: {
        content: '東京駅',
        position: latlng
      }
    };
  }();

  /*********************************
   * 地図情報の初期化
   */
  var data = function () {
    var map = new google.maps.Map(
      document.getElementById('map_canvas'),
      options.map
    );

    // マーカー設定
    options.marker.map = map;
    var marker = new google.maps.Marker(options.marker);

    // 情報ウィンドウ設定
    var info_window = new google.maps.InfoWindow(options.info_window).open(map, marker);

    return {
      map: map
    };
  }();

  /*********************************
   * 指定された住所を地図上に表示する
   */
  $('#address_search').textinput().bind('change', function (event, ui) {
    var address = $(this).val();

    // 検索ワードがなかったら何もしない
    if (address == '') {
      return;
    }

    // 住所からジオコードを取得
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function (results, status){
      var latlng;
      // 取得できた場合
      if (status == google.maps.GeocoderStatus.OK) {
        latlng = results[0].geometry.location;

        // 地図の中心を変更
        data.map.setCenter(latlng);

        // 新しいマーカーの生成
        var marker = new google.maps.Marker({
          map: data.map,
          position: latlng
        });

        // 新しい情報ウィンドウの生成
        var info_window = new google.maps.InfoWindow({
          position: latlng,
          content: address
        }).open(data.map, marker);

      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  });

});
