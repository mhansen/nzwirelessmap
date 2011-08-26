latlng = new google.maps.LatLng(-41, 174)
myOptions =
  zoom: 6
  center: latlng
  mapTypeId: google.maps.MapTypeId.SATELLITE

map = new google.maps.Map document.getElementById("map_canvas"), myOptions

queryPointToPointLayer = (where_clause) ->
  return new google.maps.FusionTablesLayer {
  query: {
    select: "kml"
    from: "1355581"
    where: where_clause
  }
}

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
  "The Radio Network Links":
    layer: queryPointToPointLayer "clientname CONTAINS IGNORING CASE 'the radio network limited'"
    enabled: false
  "RadioWorks Links":
    layer: queryPointToPointLayer "clientname CONTAINS IGNORING CASE 'radioworks'"
    enabled: false
  "TvWorks Links":
    layer: queryPointToPointLayer "clientname CONTAINS IGNORING CASE 'tvworks'"
    enabled: false

for name, model of layers
  model.layer.setMap map if model.enabled # paint the layer
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

$("a#about").click -> $("#about-dialog").toggle()
$("a#feedback").click -> $("#feedback-dialog").toggle()
$(".close").click -> $(this).parent().parent().hide()

$("a.menu").click (e) ->
  $li = $(this).parent("li").toggleClass("open")
  false
