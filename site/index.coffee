# Main client-side logic for wirelessmap.markhansen.co.nz

# Start the fullscreen map
map = new google.maps.Map $("#map_canvas")[0], {
  # close enough to the middle of New Zealand that the whole country should
  # be shown when the user first loads the page
  center: new google.maps.LatLng(-41, 174)
  zoom: 6
  # Satellite view is much nicer for visualising antenna masts
  mapTypeId: google.maps.MapTypeId.SATELLITE
}

# A factory for FusionTableLayers querying for a company or something.
queryPointToPointLayer = (where_clause) ->
  return new google.maps.FusionTablesLayer {
  query: {
    select: "kml"
    from: "1355581"
    where: where_clause
  }
}

# Main model of the layers.
# Defines the FusionTableLayers, and whether that layer is initially enabled or not.
layers =
  "All Fixed Point Links":
    layer: queryPointToPointLayer ""
    enabled: true
  "Telecom Links":
    layer: queryPointToPointLayer "clientname CONTAINS IGNORING CASE 'telecom'"
    enabled: false
  "Vodafone Links":
    layer: queryPointToPointLayer "clientname CONTAINS IGNORING CASE 'vodafone'"
    enabled: false
  "Two Degrees Links":
    layer: queryPointToPointLayer "clientname CONTAINS IGNORING CASE 'two degrees'"
    enabled: false
  "Kordia Links":
    layer: queryPointToPointLayer "clientname CONTAINS IGNORING CASE 'kordia'"
    enabled: false
  "TeamTalk Links":
    layer: queryPointToPointLayer "clientname CONTAINS IGNORING CASE 'teamtalk'"
    enabled: false
  "The Radio Network Links":
    layer: queryPointToPointLayer "clientname CONTAINS IGNORING CASE 'the radio network limited'"
    enabled: false
  "RadioWorks Links":
    layer: queryPointToPointLayer "clientname CONTAINS IGNORING CASE 'radioworks'"
    enabled: false
  "TvWorks Links":
    layer: queryPointToPointLayer "clientname CONTAINS IGNORING CASE 'tvworks'"
    enabled: false
  "Woosh Links":
    layer: queryPointToPointLayer "clientname CONTAINS IGNORING CASE 'woosh'"
    enabled: false

render_layer_model = (name, model) ->
  # Paint the layer.
  model.layer.setMap map if model.enabled

  # Make a checkbox to add to the 'layers' dropdown.
  checkbox = $("<input type='checkbox'>")
  checkbox.data("model", model)
  checkbox.attr "checked", "checked" if model.enabled

  checkbox.change ->
    if $(this).is(":checked")
      $(this).data("model").layer.setMap map

    else
      $(this).data("model").layer.setMap null

  label = $("<label>").append(checkbox).append(name)
  li = $("<li>").append(label)
  $("ul#layer_menu").append(li)

for name, model of layers
  render_layer_model name, model

# Hook up the logic to show and hide the modal dialogs.
$("a#about").click -> $("#about-dialog").toggle()
$("a#feedback").click -> $("#feedback-dialog").toggle()
$(".close").click -> $(this).parent().parent().hide()

# Hook up the logic to show the dropdown layers list.
$("a.menu").click (e) ->
  $li = $(this).parent("li").toggleClass("open")
  false

$("a#add_custom_search").click () ->
  q = prompt "Enter Company Name"
  if q
    model =
        layer: queryPointToPointLayer "clientname CONTAINS IGNORING CASE '"+q+"'"
        enabled: true
    render_layer_model q, model
