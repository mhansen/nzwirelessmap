(function() {
  var Layer, LayerListView, LayerMapView, LayersList, addAll, addOne, allConnectionsLayer, throttled_track_bounds_changed, track_bounds_changed,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Layer = (function(_super) {

    __extends(Layer, _super);

    function Layer() {
      Layer.__super__.constructor.apply(this, arguments);
    }

    Layer.prototype.defaults = {
      query: "",
      shown: false,
      showsAllConnections: false
    };

    return Layer;

  })(Backbone.Model);

  LayersList = (function(_super) {

    __extends(LayersList, _super);

    function LayersList() {
      LayersList.__super__.constructor.apply(this, arguments);
    }

    LayersList.prototype.model = Layer;

    return LayersList;

  })(Backbone.Collection);

  window.layers = new LayersList;

  LayerMapView = (function(_super) {

    __extends(LayerMapView, _super);

    function LayerMapView() {
      LayerMapView.__super__.constructor.apply(this, arguments);
    }

    LayerMapView.prototype.initialize = function() {
      var _this = this;
      this.model.bind("change:shown", this.render, this);
      this.gmapsLayer = new google.maps.FusionTablesLayer({
        query: {
          select: "kml",
          from: "1355581",
          where: this.model.get("query")
        }
      });
      return google.maps.event.addListener(this.gmapsLayer, 'click', function(e) {
        var clientname, licenceid;
        licenceid = e.row.licenceid.value;
        clientname = e.row.clientname.value;
        return mpq.track("Clicked Radio Link", {
          layerName: _this.model.get("name"),
          licenceid: licenceid,
          clientname: clientname,
          mp_note: "client: " + clientname + ", licence: " + licenceid
        });
      });
    };

    LayerMapView.prototype.render = function() {
      if (this.model.get("shown")) {
        this.gmapsLayer.setMap(map);
      } else {
        this.gmapsLayer.setMap(null);
      }
      return this;
    };

    return LayerMapView;

  })(Backbone.View);

  LayerListView = (function(_super) {

    __extends(LayerListView, _super);

    function LayerListView() {
      LayerListView.__super__.constructor.apply(this, arguments);
    }

    LayerListView.prototype.initialize = function() {
      return this.model.bind("change", this.render, this);
    };

    LayerListView.prototype.tagName = "li";

    LayerListView.prototype.events = {
      "change .check": "toggleCheckbox"
    };

    LayerListView.prototype.toggleCheckbox = function(e) {
      var event, isChecked, layerName;
      isChecked = this.$("input").is(":checked");
      if (this.model.get("showsAllConnections") === false && this.model.get("shown") === false) {
        allConnectionsLayer.set({
          shown: false
        });
      }
      this.model.set({
        shown: isChecked
      });
      event = isChecked ? "Showed Layer" : "Hid Layer";
      layerName = this.model.get("name");
      return mpq.track(event, {
        name: layerName,
        mp_note: "layer: " + layerName
      });
    };

    LayerListView.prototype.render = function() {
      var checkbox, label;
      $(this.el).children().remove();
      checkbox = $("<input type='checkbox' class='check'>");
      if (this.model.get("shown")) checkbox.attr("checked", "checked");
      label = $("<label>").append(checkbox).append(this.model.get("name"));
      $(this.el).append(label);
      return this;
    };

    return LayerListView;

  })(Backbone.View);

  window.map = new google.maps.Map($("#map_canvas")[0], {
    center: new google.maps.LatLng(-41, 174),
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  });

  track_bounds_changed = function() {
    return mpq.track("Bounds Changed");
  };

  throttled_track_bounds_changed = _.throttle(track_bounds_changed, 1000);

  google.maps.event.addListener(map, 'bounds_changed', function() {
    return throttled_track_bounds_changed();
  });

  $("a#add_custom_search").click(function() {
    var q;
    q = prompt("Enter Company Name");
    if (q) {
      layers.add({
        name: q,
        query: "clientname CONTAINS IGNORING CASE '" + q + "'",
        shown: true
      });
      return mpq.track("Added Custom Layer", {
        searchTerm: q,
        mp_note: "term: '" + q + "'"
      });
    }
  });

  addAll = function() {
    return layers.each(addOne);
  };

  addOne = function(layer) {
    var el, listView, mapView;
    mapView = new LayerMapView({
      model: layer
    });
    mapView.render();
    listView = new LayerListView({
      model: layer
    });
    el = listView.render().el;
    return $("ul#layer_menu").append(el);
  };

  layers.bind('reset', addAll);

  layers.bind('add', addOne);

  allConnectionsLayer = new Layer({
    name: "All Fixed Point Links",
    showsAllConnections: true,
    shown: true
  });

  layers.reset([
    allConnectionsLayer, new Layer({
      name: "Telecom Links",
      query: "clientname CONTAINS IGNORING CASE 'telecom'"
    }), new Layer({
      name: "Vodafone Links",
      query: "clientname CONTAINS IGNORING CASE 'vodafone'"
    }), new Layer({
      name: "Two Degrees Links",
      query: "clientname CONTAINS IGNORING CASE 'two degrees'"
    }), new Layer({
      name: "Kordia Links",
      query: "clientname CONTAINS IGNORING CASE 'kordia'"
    }), new Layer({
      name: "TeamTalk Links",
      query: "clientname CONTAINS IGNORING CASE 'teamtalk'"
    }), new Layer({
      name: "The Radio Network Links",
      query: "clientname CONTAINS IGNORING CASE 'the radio network limited'"
    }), new Layer({
      name: "RadioWorks Links",
      query: "clientname CONTAINS IGNORING CASE 'radioworks'"
    }), new Layer({
      name: "TvWorks Links",
      query: "clientname CONTAINS IGNORING CASE 'tvworks'"
    }), new Layer({
      name: "Woosh Links",
      query: "clientname CONTAINS IGNORING CASE 'woosh'"
    })
  ]);

  $("a#about").click(function() {
    if (!$("#about-dialog").is(":visible")) mpq.track("Opened About Dialog");
    return $("#about-dialog").toggle();
  });

  $("a#feedback").click(function() {
    if (!$("#feedback-dialog").is(":visible")) mpq.track("Opened Feedback Dialog");
    return $("#feedback-dialog").toggle();
  });

  $(".close").click(function() {
    return $(this).parent().parent().hide();
  });

  $("a.menu").click(function(e) {
    var parentLi;
    parentLi = $(this).parent("li");
    if (!parentLi.hasClass("open")) mpq.track("Layers Dropdown");
    parentLi.toggleClass("open");
    return false;
  });

}).call(this);
