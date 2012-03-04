$(function () {
  // オプションの設定をする
  var options = set_options(),
      data;

  $(function () {
    // 初期化してデータ設定する
    data = initialize(options);

    // 行先とルートの設定をする
    $('#to').bind('change', search_to);
  });

  /*********************************
   * 各種オプション情報をセットする
   */
  function set_options(){
    // 経度緯度の初期値:東京駅
    var latlng = new google.maps.LatLng(35.681382,139.766084);

    return {
      // 地図のオプション
      map: {
        zoom: 13, // ズームの初期値:山手線が収まるくらいの大きさ
        center: latlng, // 中心地の経度緯度
        mapTypeId: google.maps.MapTypeId.ROADMAP, // マップ形式:通常の2Dタイプ
        navigationControlOptions: {
          style: google.maps.NavigationControlStyle.ANDROID // ナビゲーションスタイル:Android風
        }
      },

      // マーカーのオプション
      marker: {
        map: undefined, // 表示するマップ: 初期化の際に設定する
        position: latlng // マーカーの位置: 地図の中心
      },

      // 情報ウィンドウのオプション
      info_window: {
        content: '日本, 東京駅',
        position: latlng // 情報ウィンドウの位置: 地図の中心
      },
      //ルート検索のオプション
      direction: {
        origin: latlng, // 出発地
        destination: undefined, // 行先: あとで設定する
        travelMode: google.maps.DirectionsTravelMode.WALKING // 表示モード: 自動車
      }
    };
  };

  /*********************************
   * 初期化してデータを取得する
   */
 function initialize() {
    // 出発点の初期化
    var from = options.map.center;

    // 地図の初期化
    var map = new google.maps.Map(
      document.getElementById('map_canvas'),
      options.map
    );

    // マーカーの初期化
    var marker = new google.maps.Marker(options.marker);
    marker.setMap(map);

    // マーカーに情報ウィンドウを設定する
    var info_window = new google.maps.InfoWindow(options.info_window).open(map, marker);

    // マーカーを保存する配列を用意する
    var markers = [marker];

    // ジオコードの初期化
    var geocoder = new google.maps.Geocoder();

    // ルート検索の初期化
    var direction = new google.maps.DirectionsService();

    // ルート表示の初期化
    var renderer = new google.maps.DirectionsRenderer();

    return {
      map: map,
      from: from,
      to: undefined, // 行先が決まったら設定
      markers: markers,
      geocoder: geocoder,
      direction: direction,
      renderer: renderer
    };
  };

  /*********************************
   * 行先を設定する
   */

  function search_to() {
    var addr = $('#to').val();

    // 空文字だったら何もしない
    if (addr == '') {
      return;
    }

    // ジオコードで住所を求めて地図上に表示する
    data.geocoder.geocode({'address': addr}, function (geo_results, geo_status) {
      if (geo_status == google.maps.GeocoderStatus.OK) {
        var to = geo_results[0].geometry.location;

        // 住所が変わってなかったら何もしない
        if (to == '') {
          return;
        }
        data.to = to;

        // 地図の位置を変更
        var bounds = new google.maps.LatLngBounds(data.from, data.to);
        data.map.panToBounds(bounds);

        // 行先にマーカーを設定
        var marker = new google.maps.Marker({
          map: data.map,
          position: data.to
        });

        // 行先の情報ウィンドウを設定
        var info_window = new google.maps.InfoWindow({
          content: geo_results[0].formatted_address,
          position: data.to
        }).open(data.map, marker);

        data.markers.push(marker);

        // 出発点から行先までのルートを設定
        options.direction.destination = data.to;
        data.direction.route(options.direction, function (route_result, route_status) {
          if (route_status == google.maps.DirectionsStatus.OK) {
            // ルートのレンダラ
            data.renderer.setMap(data.map);
            // ルートを地図上に描く
            data.renderer.setDirections(route_result);
          } else {
            alert('ルートが見つかりませんでした: ' + route_status);
          }
        });
      } else {
        alert('行先が見つかりませんでした: ' + geo_status);
      }
    });
  }
});
