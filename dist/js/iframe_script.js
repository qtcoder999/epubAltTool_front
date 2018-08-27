"use strict";
var baseURL = "http://cnf-gcb-335331:3000/";
var reponseFromServer = void 0,
    URLs = void 0,
    currentIndex = void 0,
    $iframeDOM = void 0,
    currentTarget = null,
    changesMade = false,
    cssAdded = false;
var myIframe = document.getElementById("epub_iframe");
$.ajax({
    url: "./json/data.json",
    data: {
        format: "json"
    },
    error: function error() { },
    dataType: "json",
    success: function success(b) {
        var c = $("#sel1");
        for (var a in b) {
            c.append($("<option />").val(a).text(b[a].projectName))
        }
        reponseFromServer = b;
        URLs = reponseFromServer[0];
        $("#epub_iframe").attr("src", "../server/" + URLs.paths[0].path + "?rand=" + Math.round(Math.random() * 10000000));
        $("#URLbar").val("../server/" + URLs.paths[0].path);
        currentIndex = 0
    }
});
$("#sel1").on("change", function (b) {
    var c = $("option:selected", this);
    var a = this.value;
    URLs = reponseFromServer[a];
    $("#epub_iframe").attr("src", "../server/" + URLs.paths[0].path + "?rand=" + Math.round(Math.random() * 10000000));
    $("#URLbar").val("../server/" + URLs.paths[0].path);
    currentIndex = 0
    removeImageSupportTools();
});
$("#nav-left-1").click(function () {

    if (currentIndex - 1 >= 0) {
        myIframe = document.getElementById("epub_iframe");
        $("#epub_iframe").attr("src", "../server/" + URLs.paths[currentIndex - 1].path + "?rand=" + Math.round(Math.random() * 10000000));
        $("#URLbar").val("../server/" + URLs.paths[currentIndex - 1].path);
        currentIndex -= 1;
        removeImageSupportTools();
        changesMade = false;
        cssAdded = false;
    }
});
$("#nav-right-1").click(function () {
    if (currentIndex + 1 <= URLs.paths.length - 1) {
        myIframe = document.getElementById("epub_iframe");
        $("#epub_iframe").attr("src", "../server/" + URLs.paths[currentIndex + 1].path + "?rand=" + Math.round(Math.random() * 10000000));
        $("#URLbar").val("../server/" + URLs.paths[currentIndex + 1].path);
        currentIndex += 1;
        removeImageSupportTools();
        changesMade = false
        cssAdded = false;
    }
});
$("#insert-alt-text-2").click(function () {
    if (!currentTarget) {
        showSnackBarAlert("snackbar-select-image");
    } else {
        if ($("#alt-text-2").val().trim() == "") {
            showSnackBarAlert("snackbar-enter");
        } else {
            changesMade = true;
            var a = $(currentTarget[0]).attr("class").toString();
            a = a.split(" ");
            for (const x in a) {
                if (a[x].indexOf('selected') > -1) {
                    a = a[x];
                    //console.log(a);
                }
            }
            $iframeDOM.find("." + a).attr("alt", $("#alt-text-2").val());
            $("#currentAltText-1").val($iframeDOM.find("." + a).attr("alt"));
            $("#alt-text-2").val("");
            ImageCounter()
        }
    }
});
$("#delete-image-1").click(function () {
    var a = $(currentTarget[0]).attr("class").toString();
    a = a.split(" ");
    for (const x in a) {
        if (a[x].indexOf('selected') > -1) {
            a = a[x];
        }
    }
    $("#epub_iframe").contents().find("." + a).parent().remove();
    removeImageSupportTools();
    showSnackBarAlert("snackbar-image-deletion");
    changesMade = true;
});
$("#crop-image-1").click(function () {
    localStorage.setItem("ImageToCrop", $(currentTarget[0]).prop('src'));
    window.open("/crop/");
    // var a = $(currentTarget[0]).attr("class").toString();
    // a = a.split(" ");
    // for (const x in a) {
    //     if (a[x].indexOf('selected') > -1) {
    //         a = a[x];
    //     }
    // }
    // console.log($(currentTarget[0]).prop('src'));
    // $('body').append('<a href='+ $(currentTarget[0]).prop('src') + ' data-toggle="lightbox"><img src=' + $(currentTarget[0]).prop('src') +'></a>');
    // $('[data-toggle="lightbox"]').ekkoLightbox();
    // cropMode('[data-toggle="lightbox"] img');
    // cropMode();


    // showSnackBarAlert("snackbar-image-crop");

});
var getDocTypeAsString = function getDocTypeAsString() {
    var a = document.doctype;
    return a ? "<!DOCTYPE " + a.name + (a.publicId ? ' PUBLIC "' + a.publicId + '"' : "") + (!a.publicId && a.systemId ? " SYSTEM" : "") + (a.systemId ? ' "' + a.systemId + '"' : "") + ">\n" : ""
};

document.getElementById('epub_iframe').onload = function () {
    onMyFrameLoad();
    //alert("iframe loaded")
};

function onMyFrameLoad() {
    if (!cssAdded) {
        addCSSToIframe();
    }
}

myIframe.addEventListener("load", function () {
    $iframeDOM = $(myIframe).contents();
    ImageCounter();

    // if (!cssAdded) {
    //     alert();
    //     addCSSToIframe();
    // }
    $iframeDOM.find("body").on("click", function (a) {
        var b = $(a.target).clone();
        if (b.is("img")) {
            currentTarget = $(a.target).clone();
            $("#selectedImage img").addClass("img-width-height");
            $("#selectedImage img").attr("src", $(b[0]).prop("src"));
            $("#current-selected-label-1").html('<a class="selectedImageSupport cursor-default-1" href="#"><span>Currently selected image</span></a>');
            $("#current-label").html('<a class="padding-bottom-off-1 selectedImageSupport cursor-default-1" href="#"><span>Current alt text</span></a>');
            $("#image-selected-1").html('<form class="sidebar-form selectedImageSupport cursor-default-1"><div class="input-group width-100"><textarea id="currentAltText-1" class="form-control color-white min-height-1 cursor-default-1" disabled>' + $(b[0]).prop("alt") + "</textarea></div></form>")
            $("#delete-image-1").html('<a href="#" class="text-center"> <i class=""></i> <span id="">Delete</span> </a>');
            $("#crop-image-1").html('<a href="#" class="text-center"> <i class=""></i> <span id="">Crop</span> </a>');
        } else {
            removeImageSupportTools()
        }
    })
});
function addCSSToIframe() {
    var $head = $("#epub_iframe").contents().find("head");
    $head.append($("<link/>",
        { rel: "stylesheet", href: window.origin + "/front/dist/css/iframe-style.css", type: "text/css" }));
    $("#epub_iframe").contents().find("img").each(function () {
        $(this).addClass('outline-3px');
    });
    cssAdded = true;
}
function removeCSSFromIframe() {
    $("#epub_iframe").contents().find("link").each(function () {
        if ($(this).attr('href').indexOf('iframe-style.css') > -1) {
            $(this).remove();
        }
    });
    $("#epub_iframe").contents().find(".outline-3px").each(function () {
        $(this).removeClass('outline-3px');
    });
    cssAdded = false;
}
function checkScroll(scrollPos) {
    myIframe.addEventListener("load", function () {
        $('#epub_iframe').contents().scrollTop(scrollPos);
    });
}
function removeImageSupportTools() {
    $("#selectedImage").html('<img src=""/>');
    $(".selectedImageSupport").remove();
    $("#delete-image-1").html('');
    $("#crop-image-1").html('');
    currentTarget = null;
    $("#alt-text-2").val("");
}
$("#save-page-1").click(function () {
    removeImageSupportTools();
    removeCSSFromIframe();
    if (changesMade) {
        var b = '{ "DOM" : "' + escape(getDocTypeAsString() + $iframeDOM.find("html")[0].outerHTML) + '", "path" : "' + $("#epub_iframe").contents().get(0).location.pathname + ' "}';
        // var a = $("#epub_iframe").contents().get(0).location.pathname.split("/");
        // var d;
        // d = a.splice(2);
        // d = d.join("/");
        // d += "?rand=" + Math.round(Math.random() * 10000000);
        // console.log(d);
        $.ajax({
            url: baseURL + "iframeData",
            data: JSON.parse(b),
            error: function c() {
                showSnackBarAlert("snackbar-error-saving");
                //alert("Error saving!")
            },
            dataType: "text",
            success: function e(f) {
                showSnackBarAlert("snackbar-saved-success");
                var scrollPos = $('#epub_iframe').contents().scrollTop();
                $("#epub_iframe").attr("src", "../server/" + URLs.paths[currentIndex].path + "?rand=" + Math.round(Math.random() * 10000000));
                checkScroll(scrollPos);
                ImageCounter();
                //alert("Saved!")
            },
            type: "POST"
        })
        changesMade = false;
    } else {
        showSnackBarAlert("snackbar-make-changes");
        //alert("Please make some changes first.")
    }
});
$("#start-1").click(function () {
    removeImageSupportTools();
    var currentProjectName = $('#sel1').find(":selected").text();
    var d = { path: escape(currentProjectName.trim()) };
    //console.log(d);
    $.ajax({
        url: baseURL + "start",
        data: d,
        error: function c() {
            showSnackBarAlert("snackbar-error-starting");
            //alert("Error saving!")
        },
        dataType: "text",
        success: function e(f) {
            showSnackBarAlert("snackbar-saved-starting");
            var scrollPos = $('#epub_iframe').contents().scrollTop();
            $("#epub_iframe").attr("src", "../server/" + URLs.paths[currentIndex].path + "?rand=" + Math.round(Math.random() * 10000000));
            checkScroll(scrollPos);
            ImageCounter();
            //alert("Saved!")
        },
        type: "POST"
    })
});
$("#end-1").click(function () {
    removeImageSupportTools();
    var currentProjectName = $('#sel1').find(":selected").text();
    var d = { path: escape(currentProjectName.trim()) };
    //console.log(d);
    $.ajax({
        url: baseURL + "end",
        data: d,
        error: function c() {
            showSnackBarAlert("snackbar-error-ending");
            //alert("Error saving!")
        },
        dataType: "text",
        success: function e(f) {
            showSnackBarAlert("snackbar-saved-ending");
            $("#epub_iframe").attr("src", "../server/" + URLs.paths[currentIndex].path + "?rand=" + Math.round(Math.random() * 10000000));
            ImageCounter();
            //alert("Saved!")
        },
        type: "POST"
    })
});
function ImageCounter() {
    var count = $("#epub_iframe").contents().find("img").length;
    var sum = count;
    if (sum < 0) {
        sum = 0;
    }
    if ($("#epub_iframe").contents().find("img").prop('alt') != "Placeholder Text") {
        if (count > 0)
            count--;
    }
    if (count == 0) {
        $("#image-counter-box").removeClass('bg-blue');
        $("#image-counter-box").addClass('bg-green');
    }
    else if (count > 0) {
        $("#image-counter-box").addClass('bg-blue');
        $("#image-counter-box").removeClass('bg-green');
    }
    $("#image-counter").text(count + "/" + sum);
}
function showSnackBarAlert(msgID) {
    $("#" + msgID).addClass("show");
    setTimeout(function () { $("#" + msgID).removeClass("show") }, 2500);
}
//---------------------------------------------------//