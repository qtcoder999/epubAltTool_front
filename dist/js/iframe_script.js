"use strict";
var reponseFromServer = void 0,
    URLs = void 0,
    currentIndex = void 0,
    $iframeDOM = void 0,
    currentTarget = null,
    changesMade = false;
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
});
$("#nav-left-1").click(function () {
    if (currentIndex - 1 >= 0) {
        myIframe = document.getElementById("epub_iframe");
        $("#epub_iframe").attr("src", "../server/" + URLs.paths[currentIndex - 1].path + "?rand=" + Math.round(Math.random() * 10000000));
        //console.log(currentIndex);
        $("#URLbar").val("../server/" + URLs.paths[currentIndex - 1].path);
        currentIndex -= 1;
        removeImageSupportTools();
        changesMade = false
    }
});
$("#nav-right-1").click(function () {
    if (currentIndex + 1 <= URLs.paths.length - 1) {
        myIframe = document.getElementById("epub_iframe");
        $("#epub_iframe").attr("src", "../server/" + URLs.paths[currentIndex + 1].path + "?rand=" + Math.round(Math.random() * 10000000));
        //console.log(currentIndex);
        $("#URLbar").val("../server/" + URLs.paths[currentIndex + 1].path);
        currentIndex += 1;
        removeImageSupportTools();
        changesMade = false
    }
});
$("#insert-alt-text-2").click(function () {
    if (!currentTarget) {
        showSnackBarAlert("snackbar-select-image");
        //alert("Please select an image.")
    } else {
        if ($("#alt-text-2").val().trim() == "") {
            showSnackBarAlert("snackbar-enter");
            //alert("Please enter some alt text to insert.")
        } else {
            changesMade = true;
            var a = $(currentTarget[0]).attr("class").toString();
            $iframeDOM.find("." + a).attr("alt", $("#alt-text-2").val());
            $("#currentAltText-1").val($iframeDOM.find("." + a).attr("alt"));
            $("#alt-text-2").val("")
        }
    }
});
var getDocTypeAsString = function getDocTypeAsString() {
    var a = document.doctype;
    return a ? "<!DOCTYPE " + a.name + (a.publicId ? ' PUBLIC "' + a.publicId + '"' : "") + (!a.publicId && a.systemId ? " SYSTEM" : "") + (a.systemId ? ' "' + a.systemId + '"' : "") + ">\n" : ""
};
myIframe.addEventListener("load", function () {
    $iframeDOM = $(myIframe).contents();
    $iframeDOM.find("body").on("click", function (a) {
        var b = $(a.target).clone();
        if (b.is("img")) {
            currentTarget = $(a.target).clone();
            $("#selectedImage img").addClass("img-width-height");
            $("#selectedImage img").attr("src", $(b[0]).prop("src"));
            $("#current-selected-label-1").html('<a class="selectedImageSupport cursor-default-1" href="#"><span>Currently selected image</span></a>');
            $("#current-label").html('<a class="padding-bottom-off-1 selectedImageSupport cursor-default-1" href="#"><span>Current alt text</span></a>');
            $("#image-selected-1").html('<form class="sidebar-form selectedImageSupport cursor-default-1"><div class="input-group width-100"><textarea id="currentAltText-1" class="form-control color-white min-height-1 cursor-default-1" disabled>' + $(b[0]).prop("alt") + "</textarea></div></form>")
        } else {
            removeImageSupportTools()
        }
    })
});

function checkScroll(scrollPos){
    myIframe.addEventListener("load", function () {
        $('#epub_iframe').contents().scrollTop(scrollPos);
    });
}

function removeImageSupportTools() {
    $("#selectedImage").html('<img src=""/>');
    $(".selectedImageSupport").remove();
    currentTarget = null;
    $("#alt-text-2").val("")
}
$("#save-page-1").click(function () {
    if (changesMade) {
        var b = '{ "DOM" : "' + escape(getDocTypeAsString() + $iframeDOM.find("html")[0].outerHTML) + '", "path" : "' + $("#epub_iframe").contents().get(0).location.pathname + ' "}';
        // var a = $("#epub_iframe").contents().get(0).location.pathname.split("/");
        // var d;
        // d = a.splice(2);
        // d = d.join("/");
        // d += "?rand=" + Math.round(Math.random() * 10000000);
        // console.log(d);
        $.ajax({
            url: "//localhost:3000/iframeData",
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
                //alert("Saved!")
            },
            type: "POST"
        })
    } else {
        showSnackBarAlert("snackbar-make-changes");
        //alert("Please make some changes first.")
    }
});

$("#start-1").click(function () {
    var currentProjectName = $('#sel1').find(":selected").text();
    var d = { path :  escape(currentProjectName.trim()) };
    //console.log(d);
    $.ajax({
        url: "//localhost:3000/start",
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
            //alert("Saved!")
        },
        type: "POST"
    })
    
});

$("#end-1").click(function () {
    var currentProjectName = $('#sel1').find(":selected").text();
    var d = { path :  escape(currentProjectName.trim()) };
    //console.log(d);
    $.ajax({
        url: "//localhost:3000/end",
        data: d,
        error: function c() {
            showSnackBarAlert("snackbar-error-ending");
            //alert("Error saving!")
        },
        dataType: "text",
        success: function e(f) {
            showSnackBarAlert("snackbar-saved-ending");
            $("#epub_iframe").attr("src", "../server/" + URLs.paths[currentIndex].path + "?rand=" + Math.round(Math.random() * 10000000));
            //alert("Saved!")
        },
        type: "POST"
    })
});

function showSnackBarAlert(msgID) {
    $("#"+msgID).addClass("show");
    setTimeout(function(){ $("#"+msgID).removeClass("show") }, 2500);
}