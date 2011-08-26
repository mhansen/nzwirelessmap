(function() {
  var layers, map, model, name, queryPointToPointLayer, render_layer_model;
  map = new google.maps.Map($("#map_canvas")[0], {
    center: new google.maps.LatLng(-41, 174),
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  });
  queryPointToPointLayer = function(where_clause) {
    return new google.maps.FusionTablesLayer({
      query: {
        select: "kml",
        from: "1355581",
        where: where_clause
      }
    });
  };
  layers = {
    "All Fixed Point Links": {
      layer: queryPointToPointLayer(""),
      enabled: true
    },
    "Telecom Links": {
      layer: queryPointToPointLayer("clientname CONTAINS IGNORING CASE 'telecom'"),
      enabled: false
    },
    "Vodafone Links": {
      layer: queryPointToPointLayer("clientname CONTAINS IGNORING CASE 'vodafone'"),
      enabled: false
    },
    "Two Degrees Links": {
      layer: queryPointToPointLayer("clientname CONTAINS IGNORING CASE 'two degrees'"),
      enabled: false
    },
    "Kordia Links": {
      layer: queryPointToPointLayer("clientname CONTAINS IGNORING CASE 'kordia'"),
      enabled: false
    },
    "TeamTalk Links": {
      layer: queryPointToPointLayer("clientname CONTAINS IGNORING CASE 'teamtalk'"),
      enabled: false
    },
    "The Radio Network Links": {
      layer: queryPointToPointLayer("clientname CONTAINS IGNORING CASE 'the radio network limited'"),
      enabled: false
    },
    "RadioWorks Links": {
      layer: queryPointToPointLayer("clientname CONTAINS IGNORING CASE 'radioworks'"),
      enabled: false
    },
    "TvWorks Links": {
      layer: queryPointToPointLayer("clientname CONTAINS IGNORING CASE 'tvworks'"),
      enabled: false
    },
    "Woosh Links": {
      layer: queryPointToPointLayer("clientname CONTAINS IGNORING CASE 'woosh'"),
      enabled: false
    }
  };
  render_layer_model = function(name, model) {
    var checkbox, label, li;
    if (model.enabled) {
      model.layer.setMap(map);
    }
    checkbox = $("<input type='checkbox'>");
    checkbox.data("model", model);
    if (model.enabled) {
      checkbox.attr("checked", "checked");
    }
    checkbox.change(function() {
      if ($(this).is(":checked")) {
        return $(this).data("model").layer.setMap(map);
      } else {
        return $(this).data("model").layer.setMap(null);
      }
    });
    label = $("<label>").append(checkbox).append(name);
    li = $("<li>").append(label);
    return $("ul#layer_menu").append(li);
  };
  for (name in layers) {
    model = layers[name];
    render_layer_model(name, model);
  }
  $("a#about").click(function() {
    return $("#about-dialog").toggle();
  });
  $("a#feedback").click(function() {
    return $("#feedback-dialog").toggle();
  });
  $(".close").click(function() {
    return $(this).parent().parent().hide();
  });
  $("a.menu").click(function(e) {
    var $li;
    $li = $(this).parent("li").toggleClass("open");
    return false;
  });
  $("a#add_custom_search").click(function() {
    var q;
    q = prompt("Enter Company Name");
    if (q) {
      model = {
        layer: queryPointToPointLayer("clientname CONTAINS IGNORING CASE '" + q + "'"),
        enabled: true
      };
      return render_layer_model(q, model);
    }
  });
}).call(this);
