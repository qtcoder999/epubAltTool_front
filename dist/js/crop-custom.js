function cropMode(a) {
    var img_cropMode = true;
    var $image = $(a);
    console.log($image);
    var imgMetadata = {};
    console.log("double-click fired.");
    //debugger;
    if (1) {
        console.log("inside if");
        img_cropMode = false;

        $image.cropper({
            cropBoxResizable: true,
            zoomOnWheel: false,
            crop: function (event) {
                imgMetadata = { "width": event.detail.width, "height": event.detail.height, "x": event.detail.x, "y": event.detail.y };
                console.log(imgMetadata);
                // console.log("Width: " + event.detail.width);
                // console.log("Height: " + event.detail.height);
                // console.log("X: " + event.detail.x);
                // console.log("Y: " + event.detail.y);
                // console.log(event.detail.rotate);
                // console.log(event.detail.scaleX);
                // console.log(event.detail.scaleY);
            }
        });

        // Get the Cropper.js instance after initialized
        var cropper = $image.data('cropper');
    }
    else {
        console.log("inside else");
        img_cropMode = true;
        $image.cropper("destroy");
        $(".cropper-hidden").removeAttr("class");
        $('.cropper-container').remove();
    }
}