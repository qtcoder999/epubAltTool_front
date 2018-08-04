'use strict';
var reponseFromServer = void 0,
    URLs = void 0,
    currentIndex = void 0,
    $iframeDOM = void 0,
    currentTarget = null,
    changesMade = false;
var myIframe = document.getElementById('epub_iframe');
$.ajax({
    url: './json/data.json',
    data: {
        format: 'json'
    },
    error: function error() { },
    dataType: 'json',
    success: function success(data) {
        //console.log(data);
        var $dropdown = $("#sel1");
        for (const x in data) {
            $dropdown.append($("<option />").val(x).text(data[x].projectName));
            //console.log(data[x].projectName);
        }
        reponseFromServer = data;
        URLs = reponseFromServer[0];
        $('#epub_iframe').attr('src', '../server/' + URLs.paths[0].path);
        $('#URLbar').val('../server/' + URLs.paths[0].path);
        currentIndex = 0;
    }
});
$('#sel1').on('change', function (e) {
    //alert();
    var optionSelected = $("option:selected", this);
    var valueSelected = this.value;
    URLs = reponseFromServer[valueSelected];
    $('#epub_iframe').attr('src', '../server/' + URLs.paths[0].path);
    $('#URLbar').val('../server/' + URLs.paths[0].path);
    currentIndex = 0;
});

$("#nav-left-1").click(function () {
    if (currentIndex - 1 >= 0) {
        myIframe = document.getElementById('epub_iframe');
        //console.log(currentIndex - 1);
        $('#epub_iframe').attr('src', '../server/' + URLs.paths[currentIndex - 1].path);
        $('#URLbar').val('../server/' + URLs.paths[currentIndex - 1].path);
        currentIndex -= 1;
        removeImageSupportTools();
        changesMade = false
    }
});
$("#nav-right-1").click(function () {
    if (currentIndex + 1 <= URLs.paths.length - 1) {
        myIframe = document.getElementById('epub_iframe');
        //console.log(currentIndex + 1);
        $('#epub_iframe').attr('src', '../server/' + URLs.paths[currentIndex + 1].path);
        $('#URLbar').val('../server/' + URLs.paths[currentIndex + 1].path);
        currentIndex += 1;
        removeImageSupportTools();
        changesMade = false
    }
});

$("#insert-alt-text-2").click(function () {
    if (!currentTarget) {
        alert('Please select an image.')
    } else if ($('#alt-text-2').val().trim() == '') {
        alert('Please enter some alt text to insert.');
    }
    else {
        changesMade = true;
        //alert('changing alt');
        var a1 = $(currentTarget[0]).attr('class').toString();
        $iframeDOM.find('.' + a1).attr('alt', $('#alt-text-2').val());
        $('#currentAltText-1').val($iframeDOM.find('.' + a1).attr('alt'));
        //console.log($(currentTarget[0]).attr('alt'))
    }
});

var getDocTypeAsString = function () {
    var node = document.doctype;
    return node ? "<!DOCTYPE "
        + node.name
        + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
        + (!node.publicId && node.systemId ? ' SYSTEM' : '')
        + (node.systemId ? ' "' + node.systemId + '"' : '')
        + '>\n' : '';
};

myIframe.addEventListener("load", function () {
    $iframeDOM = $(myIframe).contents();
    $iframeDOM.find('body').on("click", function (event) {
        var target_1 = $(event.target).clone();
        if (target_1.is("img")) {
            currentTarget = $(event.target).clone();
            $('#selectedImage img').addClass('img-width-height');
            $('#selectedImage img').attr('src', $(target_1[0]).prop('src'));
            $('#current-selected-label-1').html('<a class="selectedImageSupport cursor-default-1" href="#"><span>Currently selected image</span></a>');
            $('#current-label').html('<a class="padding-bottom-off-1 selectedImageSupport cursor-default-1" href="#"><span>Current alt text</span></a>');
            $('#image-selected-1').html('<form class="sidebar-form selectedImageSupport cursor-default-1"><div class="input-group width-100"><textarea id="currentAltText-1" class="form-control color-white min-height-1 cursor-default-1" disabled>' + $(target_1[0]).prop('alt') + '</textarea></div></form>')
        } else {
            removeImageSupportTools()
        }
    })
});
function removeImageSupportTools() {
    $('#selectedImage').html('<img src=""/>');
    $('.selectedImageSupport').remove();
    currentTarget = null
}


$('#save-page-1').click(function () {
    //what if iframe is not present or is not loaded ?
    //console.log($iframeDOM);
    //console.log(getDocTypeAsString() + $iframeDOM.find('html')[0].outerHTML);

    if (changesMade) {
        var iframeData = '{ "DOM" : "' + escape(getDocTypeAsString() + $iframeDOM.find('html')[0].outerHTML) + '", "path" : "' + $('#epub_iframe').contents().get(0).location.pathname + ' "}';

        //console.log(JSON.parse(iframeData));
        //console.log($('#epub_iframe').contents().get(0).location.pathname);

        var pathToWrite = $('#epub_iframe').contents().get(0).location.pathname.split("/");
        //console.log(pathToWrite);
        var pathToWrite1;
        pathToWrite1 = pathToWrite.splice(2);
        pathToWrite1 = pathToWrite1.join('/');
        //console.log(pathToWrite1);


        $.ajax({
            url: '//localhost:3000/iframeData',
            data: JSON.parse(iframeData),
            error: function () {
                alert('Error saving!');
            },
            dataType: 'text',
            success: function (data) {
                alert('Saved!');
            },
            type: 'POST'
        });
    }
    else {
        alert("Please make some changes first.");
    }
})
