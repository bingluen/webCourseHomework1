$document.ready(function()
{
  var canvas = $('#canvas')[0];
  var cxt = canvas.getContext("2d");
  var img = new Image();
  img.src = "img/55280.jpg";
  cxt.drawImage(img, 0,0);

});
