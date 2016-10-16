# Layer model
#
# - query: the Fusion Tables Query
# - shown: whether the layer is shown on the map
# - showsAllConnections: is the layer the special 'All Layers' layer?
#
# You can listen to change events on this model.
class Layer extends Backbone.Model
  defaults:
    query: ""
    shown: false
    showsAllConnections: false

# A Backbone collection of layers - you can listen to add/remove events.
class LayersList extends Backbone.Collection
  model: Layer

window.layers = new LayersList

# Map View class.
class LayerMapView extends Backbone.View
  # Construct the map
  initialize: ->
    @model.bind "change:shown", @render, this
    @gmapsLayer = new google.maps.FusionTablesLayer
      query:
        select: "kml"
        from: "1355581"
        where: @model.get "query"
    google.maps.event.addListener @gmapsLayer, 'click', (e) =>
      licenceid = e.row.licenceid.value
      clientname = e.row.clientname.value
  # Render the layer onto the map
  render: ->
    if @model.get "shown"
      @gmapsLayer.setMap map
    else
      @gmapsLayer.setMap null
    return this

# Layer Checkbox List View class
class LayerListView extends Backbone.View
  # Constructor
  initialize: ->
    @model.bind "change", @render, this
  tagName: "li"
  # jQuery events to delegate
  events:
    "change .check": "toggleCheckbox"
  toggleCheckbox: (e) ->
    isChecked = @$("input").is ":checked"

    # If we're selecting a more specific layer, hide the 'show everything'
    # layer.
    if @model.get("showsAllConnections") == false and !@model.get("shown")
      allConnectionsLayer.set shown: false

    @model.set shown: isChecked
    event = if isChecked then "Showed Layer" else "Hid Layer"
    layerName = @model.get "name"
  # Render the view
  render: ->
    $(@el).children().remove()
    checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.className = 'check'
    checkbox.checked = @model.get "shown"

    label = document.createElement('label')
    label.appendChild(checkbox)
    label.appendChild(document.createTextNode(@model.get "name"))

    @el.appendChild(label)
    return this

# Start the fullscreen map
window.map = new google.maps.Map document.getElementById("map_canvas"),
  # Center the map close enough to the middle of New Zealand, so that the
  # whole country should be shown when the user first loads the page
  center: new google.maps.LatLng(-41, 174)
  zoom: 6
  # Satellite view is much nicer for visualising antenna masts
  mapTypeId: google.maps.MapTypeId.SATELLITE

document.getElementById("add_custom_search").addEventListener 'click', ->
  q = prompt "Enter Company Name"
  if q
    layers.add
      name: q
      query: "clientname CONTAINS IGNORING CASE '"+q+"'"
      shown: true

addAll = -> layers.each(addOne)
addOne = (layer) ->
  mapView = new LayerMapView
    model: layer
  mapView.render()
  listView  = new LayerListView
    model: layer
  el = listView.render().el
  document.getElementById("layer_menu").appendChild(el)

layers.bind 'reset', addAll
layers.bind 'add', addOne
allConnectionsLayer = new Layer
  name: "All Fixed Point Links"
  showsAllConnections: true
  shown: true

# Initialize layers with some common radio links.
initialLayers = topClients.map (c) => 
  new Layer
    name: c
    query: "clientname CONTAINS IGNORING CASE '" + c + "'"
initialLayers.unshift(allConnectionsLayer)
layers.reset initialLayers

# Hook up the logic to show and hide the modal dialogs.
document.getElementById("about").addEventListener 'click', ->
  $("#about-dialog").toggle()

document.getElementById("feedback").addEventListener 'click', ->
  $("#feedback-dialog").toggle()

document.querySelectorAll(".close").forEach (el) =>
  el.addEventListener 'click', (e) ->
    $(e.target).parent().parent().hide()

# Hook up the logic to show the dropdown layers list.
document.getElementById("layers_link").addEventListener 'click', (e) ->
  console.log 'foo'
  $(e.target).parent("li").toggleClass("open")
  false
