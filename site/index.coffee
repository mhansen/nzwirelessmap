class Layer extends Backbone.Model
  defaults:
    query: ""
    shown: false

class LayersList extends Backbone.Collection
  model: Layer

window.layers = new LayersList

class LayerMapView extends Backbone.View
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
      mpq.track "Clicked Radio Link"
        layerName: @model.get "name"
        licenceid: licenceid
        clientname: clientname
        mp_note: "client: #{clientname}, licence: #{licenceid}"
  render: ->
    if @model.get "shown"
      @gmapsLayer.setMap map
    else
      @gmapsLayer.setMap null
    return this

class LayerListView extends Backbone.View
  initialize: ->
    @model.bind "change", @render, this
  tagName: "li"
  events:
    "change .check": "toggleCheckbox"
  toggleCheckbox: (e) ->
    isChecked = @$("input").is ":checked"
    @model.set shown: isChecked
    event = if isChecked then "Showed Layer" else "Hid Layer"
    layerName: @model.get "name"
    mpq.track event,
      name: layerName
      mp_note: "layer: #{layerName}"
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

track_bounds_changed = -> mpq.track "Bounds Changed"
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
    mpq.track "Added Custom Layer"
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
layers.reset [
  new Layer
    name: "All Fixed Point Links"
    shown: true
  new Layer
    name: "Telecom Links"
    query: "clientname CONTAINS IGNORING CASE 'telecom'"
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
    mpq.track "Opened About Dialog"
  $("#about-dialog").toggle()
$("a#feedback").click ->
  if not $("#feedback-dialog").is ":visible"
    mpq.track "Opened Feedback Dialog"
  $("#feedback-dialog").toggle()
$(".close").click -> $(this).parent().parent().hide()

# Hook up the logic to show the dropdown layers list.
$("a.menu").click (e) ->
  parentLi = $(this).parent("li")
  if not parentLi.hasClass "open"
    mpq.track "Layers Dropdown"
  parentLi.toggleClass("open")
  false
