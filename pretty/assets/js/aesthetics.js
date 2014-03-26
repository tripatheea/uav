$('.go').mouseover(function(){
  $('.go').removeClass('go-default').addClass('go-hover');
});

$('.go').mouseout(function(){
  $('.go').removeClass('go-hover').addClass('go-default');
});

$('.go').mousedown(function(){
  $('.go').removeClass('go-hover').addClass('go-clicked');
});

$('.go').mouseup(function(){
  $('.go').removeClass('go-clicked').addClass('go-hover');
});
