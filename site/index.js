(function() {
  var Layer, LayerListView, LayerMapView, LayersList, addAll, addOne;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Layer = (function() {
    __extends(Layer, Backbone.Model);
    function Layer() {
      Layer.__super__.constructor.apply(this, arguments);
    }
    Layer.prototype.defaults = G({
      query: "",
      shown: false
    });
    return Layer;
  })();
  LayersList = (function() {
    __extends(LayersList, Backbone.Collection);
    function LayersList() {
      LayersList.__super__.constructor.apply(this, arguments);
    }
    LayersList.prototype.model = Layer;
    return LayersList;
  })();
  window.layers = new LayersList;
  LayerMapView = (function() {
    __extends(LayerMapView, Backbone.View);
    function LayerMapView() {
      LayerMapView.__super__.constructor.apply(this, arguments);
    }
    LayerMapView.prototype.initialize = function() {
      this.model.bind("change:shown", this.render, this);
      return this.gmapsLayer = new google.maps.FusionTablesLayer({
        query: {
          select: "kml",
          from: "1355581",
          where: this.model.get("query")
        }
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
  })();
  LayerListView = (function() {
    __extends(LayerListView, Backbone.View);
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
      return this.model.set({
        shown: this.$("input").is(":checked")
      });
    };
    LayerListView.prototype.render = function() {
      var checkbox, label;
      $(this.el).children().remove();
      checkbox = $("<input type='checkbox' class='check'>");
      if (this.model.get("shown")) {
        checkbox.attr("checked", "checked");
      }
      label = $("<label>").append(checkbox).append(this.model.get("name"));
      $(this.el).append(label);
      return this;
    };
    return LayerListView;
  })();
  window.map = new google.maps.Map($("#map_canvas")[0], {
    center: new google.maps.LatLng(-41, 174),
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  });
  $("a#add_custom_search").click(function() {
    var q;
    q = prompt("Enter Company Name");
    if (q) {
      return layers.add({
        name: q,
        query: "clientname CONTAINS IGNORING CASE '" + q + "'",
        shown: true
      });
    }
  });
  addAll = function() {
    return layers.each(addOne);
  };
  addOne = function(layer) {
    var listView, mapView;
    mapView = new LayerMapView({
      model: layer
    });
    mapView.render();
    listView = new LayerListView({
      model: layer
    });
    return $("ul#layer_menu").append(listView.render().el);
  };
  layers.bind('reset', addAll);
  layers.bind('add', addOne);
  layers.reset([
    new Layer({
      name: "All Fixed Point Links",
      shown: true
    }), new Layer({
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
}).call(this);
