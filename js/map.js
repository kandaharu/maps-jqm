// Ajaxナビゲーションの停止
$(document).bind('mobileinit', function() { $.mobile.ajaxLinksEnabled = false; });

$(function () {
//  var logger = new Log4js.getLogger('map-jqm');
//  logger.addAppender(new Log4js.ConsoleAppender());

  // 便利な入れ物
  var data = {};

  $(function () {
    startfunc('main');
    
    // 出発地を設定する
    $('#origin').bind('change', set_origin);

    // 目的地を設定する
    $('#destination').bind('change', set_destination);

    // ルート検索する
    $('#route_search').bind('click', route_search);

    // 地図を拡大する
    $('#zoom_in').click(function () {
      data.map.setZoom(data.map.getZoom() + 1);
    });

    // 地図を拡大する
    $('#zoom_out').click(function () {
      data.map.setZoom(data.map.getZoom() - 1);
    });

    endfunc('main');
 });

  /*********************************
   * 出発地を設定する
   ********************************/
  function set_origin() {
    startfunc('set_origin');
    set_position({
      addr: $('#origin').val(),
      which: 'origin'
    });
    endfunc('set_origin');
  }

  /*********************************
   * 目的地を設定する
   ********************************/
  function set_destination() {
    startfunc('set_destination');

    set_position({
      addr: $('#destination').val(),
      which: 'destination'
    });
    endfunc('set_destination');
  }

  /*********************************
   * 地点を設定する
   *********************************/
  function set_position(args) {
    startfunc('set_position');

    // ポイントが指定されてなかったら何もしない
    if (args.addr == '') {
      return;
    }

    // ジオコードの取得
    if (data.geocoder == undefined) {
      data.geocoder = new google.maps.Geocoder();
    }

    // ジオコードで住所を求める
    data.geocoder.geocode({'address': args.addr}, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latlng = results[0].geometry.location;

        // 住所が変わってなかったら何もしない
        if (latlng == '') {
          return;
        }

        // 出発地なのか目的地なのか
        switch (args.which) {
          case 'origin' :
            data.origin = latlng;
            break;
          case 'destination' : default:
            data.destination = latlng;
            break;
        }

        return latlng;
      } else {
        alert(args.addr + 'という場所が見つかりませんでした: ' + status);
        return;
      }
    });

    endfunc('set_position');
  }

  /*********************************
   * 地点を設定する
   *********************************/
  function route_search () {
    startfunc('route_search');

    mapinit();

    // 出発地と目的地が決まってなければルート検索しない
    if (data.origin == undefined || data.destination == undefined) {
      return;
    }

    // ルート検索する
    set_route();

    // 地図の中心地をいい感じに真ん中にする
    set_bounds();

    endfunc('route_search');
  }

  /*********************************
   * 地図を初期化する
   *********************************/
  function mapinit() {
    startfunc('mapinit');

    // 経度緯度の初期値
    var latlng;

    if (data.origin != undefined) {
      latlng = data.origin;
    } else {
      // 設定されてなかったらとりあえず東京駅を設定しておく
      latlng = new google.maps.LatLng(35.681382,139.766084);
    }

    // 地図の初期化
    if (data.map != undefined) {
      data.map = undefined;
    }
    $('map_canvas').empty();
    data.map = new google.maps.Map(
      document.getElementById('map_canvas'),
      {
        zoom: 13, // ズームの初期値:山手線が収まるくらいの大きさ
        center: latlng, // 中心地の経度緯度
        mapTypeId: google.maps.MapTypeId.ROADMAP, // マップ形式:通常の2Dタイプ
        navigationControlOptions: {
          style: google.maps.NavigationControlStyle.SMALL // ナビゲーションスタイル:ズームのみ
        }
      }
    );

    endfunc('mapinit');
  }

  /*********************************
   * ルートを設定する
   *********************************/
  function set_route() {
    startfunc('set_route');
    
    var mode,     // トラベルモード
        avoid_toll;  // 有料道路を使わないかどうか

    switch ($('input[name=travel_mode]:checked').attr('value')) {
      case 'walking' :
        mode = google.maps.DirectionsTravelMode.WALKING;
        avoid_toll = true;
        break;
      case 'local_street' :
        mode = google.maps.DirectionsTravelMode.DRIVING;
        is_tall = true;
        break;
      case 'tollway' : default :
        mode = google.maps.DirectionsTravelMode.DRIVING;
        avoid_toll = false;
        break;
    }

    // ルート案内の初期化
    if (data.direction == undefined) {
      data.direction = new google.maps.DirectionsService();
    }
    
    // ルート表示の初期化
    if (data.renderer == undefined) {
      data.renderer = new google.maps.DirectionsRenderer();
    }


    data.direction.route(
      {
        origin: data.origin,
        destination: data.destination,
        travelMode: mode,
        avoidTolls: avoid_toll
      },
      function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          // ルートのレンダラ
          data.renderer.setMap(null);
          data.renderer.setMap(data.map);
          // ルートを描画する
          data.renderer.setDirections(result);
          data.renderer.setPanel(document.getElementById('route'));
        } else {
          alert('ルートが見つかりませんでした: ' + status);
        }
      }
    );

    endfunc('set_route');
  }

  /*********************************
   * 地図のズームサイズをいい感じにする
   *********************************/
  function set_bounds() {
    startfunc('set_bounds');

    if (data.origin == undefined || data.destination == undefined) {
      return;
    }
    var bounds = new google.maps.LatLngBounds(data.origin, data.destination);
    data.map.panToBounds(bounds);

    endfunc('set_bounds');
  }
  
  /*********************************
   * 関数の開始をログ出力
   *********************************/
  function startfunc(func_name) {
    console.log('[START Func] '  + func_name);
  }

  /*********************************
   * 関数の開始をログ出力
   *********************************/
  function endfunc(func_name) {
    console.log('[END Func] '  + func_name);
  }


});
