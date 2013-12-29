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
      track "Clicked Radio Link",
        layerName: @model.get "name"
        licenceid: licenceid
        clientname: clientname
        mp_note: "client: #{clientname}, licence: #{licenceid}"
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
    if @model.get("showsAllConnections") == false and @model.get("shown") == false
      allConnectionsLayer.set shown: false

    @model.set shown: isChecked
    event = if isChecked then "Showed Layer" else "Hid Layer"
    layerName = @model.get "name"
    track event,
      name: layerName
      mp_note: "layer: #{layerName}"
  # Render the view
  render: ->
    $(@el).children().remove()
    checkbox = $("<input type='checkbox' class='check'>")
    checkbox.attr "checked", "checked" if @model.get "shown"
    label = $("<label>").append(checkbox).append(@model.get "name")
    $(@el).append(label)
    return this

# Start the fullscreen map
window.map = new google.maps.Map $("#map_canvas")[0],
  # Center the map close enough to the middle of New Zealand, so that the
  # whole country should be shown when the user first loads the page
  center: new google.maps.LatLng(-41, 174)
  zoom: 6
  # Satellite view is much nicer for visualising antenna masts
  mapTypeId: google.maps.MapTypeId.SATELLITE

# Analytics code for measuring engagement with mixpanel.
track_bounds_changed = -> track "Bounds Changed"
throttled_track_bounds_changed = _.throttle track_bounds_changed, 1000

google.maps.event.addListener map, 'bounds_changed', ->
  throttled_track_bounds_changed()

$("a#add_custom_search").click ->
  q = prompt "Enter Company Name"
  if q
    layers.add
      name: q
      query: "clientname CONTAINS IGNORING CASE '"+q+"'"
      shown: true
    track "Added Custom Layer",
      searchTerm: q
      mp_note: "term: '#{q}'"

addAll = -> layers.each(addOne)
addOne = (layer) ->
  mapView = new LayerMapView
    model: layer
  mapView.render()
  listView  = new LayerListView
    model: layer
  el = listView.render().el
  $("ul#layer_menu").append el

layers.bind 'reset', addAll
layers.bind 'add', addOne
allConnectionsLayer = new Layer
    name: "All Fixed Point Links"
    showsAllConnections: true
    shown: true
# Initialize layers with some common radio links.
layers.reset [
  allConnectionsLayer
  new Layer
    name: "Chorus Links"
    query: "clientname CONTAINS IGNORING CASE 'chorus'"
  new Layer
    name: "Vodafone Links"
    query: "clientname CONTAINS IGNORING CASE 'vodafone'"
  new Layer
    name: "Two Degrees Links"
    query: "clientname CONTAINS IGNORING CASE 'two degrees'"
  new Layer
    name: "Kordia Links"
    query: "clientname CONTAINS IGNORING CASE 'kordia'"
  new Layer
    name: "TeamTalk Links"
    query: "clientname CONTAINS IGNORING CASE 'teamtalk'"
  new Layer
    name: "The Radio Network Links"
    query: "clientname CONTAINS IGNORING CASE 'the radio network limited'"
  new Layer
    name: "RadioWorks Links"
    query: "clientname CONTAINS IGNORING CASE 'radioworks'"
  new Layer
    name: "TvWorks Links"
    query: "clientname CONTAINS IGNORING CASE 'tvworks'"
  new Layer
    name: "Woosh Links"
    query: "clientname CONTAINS IGNORING CASE 'woosh'"
]

# Hook up the logic to show and hide the modal dialogs.
$("a#about").click ->
  if not $("#about-dialog").is ":visible"
    track "Opened About Dialog"
  $("#about-dialog").toggle()

$("a#feedback").click ->
  if not $("#feedback-dialog").is ":visible"
    track "Opened Feedback Dialog"
  $("#feedback-dialog").toggle()

$(".close").click ->
  $(this).parent().parent().hide()

# Hook up the logic to show the dropdown layers list.
$("a.menu").click (e) ->
  parentLi = $(this).parent("li")
  if not parentLi.hasClass "open"
    track "Layers Dropdown"
  parentLi.toggleClass("open")
  false

track = ->
  # Do nothing, tracking's disabled.
