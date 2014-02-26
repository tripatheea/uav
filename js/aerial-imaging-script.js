width = 1;
height = 1;
dataURL = "http://127.0.0.1:5000/simulate_aerial_image_data";
baseImgURL = 'http://127.0.0.1/uav/gui/smile/tiles/';



$(function() {
  $.ajax({
            type: 'GET',
            url: "http://127.0.0.1:5000/simulate_aerial_image_data",
            dataType: 'jsonp',
            jsonp: 'jsonp',
            success: function(data) {
                          console.log(data);
                        },
            error: function() {
                    console.log("Nooooooo!");
                  }
          });
});
