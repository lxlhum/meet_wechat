/*get settings*/
$.ajax('/settings?date=' + new Date(), {
   method: "get",
   error: function(){
      console.log("get settings error");  
   },
   success: function(data){
      console.log("get settings done");    
      data.shrink=="true" ? shrinkButtonAction(true) : shrinkButtonAction(false);
      data.nightMode=="true" ? $("#uploadZone").addClass('nightMode') : $("#uploadZone").removeClass('nightMode'); 
   }
});

/*save setting*/

function saveSettings(data){
   $.ajax('/settings/save', {
      method: "post",
      data: data,
      error: function(){
        console.log("save settings error");
      },
      success: function(data){
        console.log(data);
      }
   });
}

/*for upload*/
function getCurrentTime(){
    return (new Date().toString()).replace(/(.*)GMT(.*)/, function($,$1){return $1});
}

var messageZone = $('#messageZone');
messageZone.css("display","none");
var closeButton = '<button type="button" class="close" data-dismiss="alert">'
        + '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';

function showMessage(msg, classStr){
   messageZone.append("<div role='alert'></div>").children(":first-child").get(0).innerHTML = closeButton + getCurrentTime() + msg;
   messageZone.css("display","block");
   messageZone.children(":first-child").removeClass().addClass(classStr).css("margin-bottom","0px");
}

$('#uploadZone').on('drop', function(event) {
	var file = event.originalEvent.dataTransfer.files[0];

        if(!/\.md$/.test(file.name)){
           //console.log('please upload *.md file');
           var msg = '<strong style="padding-left:10px;"> Please upload *.md file.</strong>';
           var classStr = 'alert alert-warning alert-dismissible';
           showMessage(msg, classStr);
           return false;
        }
       
	var formData = new FormData();
	formData.append('file', file);
		
	$.ajax('/upload', {
		method: 'POST',
		contentType: false,
		processData: false,
		data:formData,
		error: function(xhr, error) {
		   //console.log('upload failed');
           var msg = '<strong style="padding-left:10px;">Sorry, upload file failed.</strong>';
           var classStr = 'alert alert-warning alert-dismissible';
           showMessage(msg, classStr);
		   //console.log(error);
		},
		success: function(response) {
           //console.log('upload success');
           var msg = '<strong style="padding-left:10px;"> Upload file success,' + ' open '
              + '<a href="/' + response + '">' + response + '</a></strong>';
           var classStr = 'alert alert-success alert-dismissible';
           showMessage(msg, classStr);
           //console.log(response);
		}
	});

	return false;
				
}).on('dragover', function(event) {
	return false;
});

/*for shrink button*/
function shrinkButtonAction(bool){
  var button = $("#shrinkButton");
  var listDiv = button.parent().prev();
  var contentDiv = button.parent();
  var icon = button.children();
  if(bool){
      icon.get(0).innerHTML = "&#xf016d";
      listDiv.addClass('shrink');
      contentDiv.removeClass().addClass('col-lg-12 col-md-12 col-sm-12 col-xs-12 mdContent');
  }else{
      icon.get(0).innerHTML = "&#xf016e";
      listDiv.removeClass('shrink');
      contentDiv.removeClass().addClass('col-lg-9 col-md-9 col-sm-8 col-xs-12 mdContent');
  }
}

$("#shrinkButton").on('click', function(){
  var listDiv = $(this).parent().prev();
  var bool = listDiv.css('display') != 'none';
  shrinkButtonAction(bool);
  saveSettings({key: "shrink", value: bool});
});

var eleTop = parseInt($("#shrinkButton").css('top'));

$(window).scroll(function() {
   var scrollTop = $(document).scrollTop();
   //var pTop = $(".mdContent").offset().top;
   $("#shrinkButton").css('top', (scrollTop + eleTop) + "px");
});

/*for setting and operation button group*/

var settingTop = parseInt($("#settingBg").css('top'));
var operationTop = parseInt($("#operation").css('top'));
var githubTop = parseInt($("#github").css('top'));

$(window).scroll(function() {
   var scrollTop = $(document).scrollTop();
   //var pTop = $(".mdContent").offset().top;
   $("#settingBg").css('top', (scrollTop + settingTop) + "px");
   $("#operation").css('top', (scrollTop + operationTop) + "px");
   $("#github").css('top', (scrollTop + githubTop) + "px");
});

$("#settingBg").children(":first-child").on('click', function(){
  $("#uploadZone").removeClass('nightMode');
  saveSettings({key: "nightMode", value: false});
});

$("#settingBg").children(":last-child").on('click', function(){
  $("#uploadZone").addClass('nightMode');
  saveSettings({key: "nightMode", value: true});  
});

$("#operation").children(":nth-child(1)").on('click', function(){
  var href = $(this).attr("href");
  if(href == "/edit/") {
    return false;
  }else{
    return true;
  }
});

$("#operation").children(":nth-child(2)").on('click', function(){
  //console.log(editor.getValue());
  var fileName = $(this).attr("fileName");
  if(typeof(editor) == 'undefined') return false;
  var updateValue = editor.getValue();
  $.ajax('/save', {
      type: "POST",
      dataType:"json",
      data: {fileName: fileName, content: updateValue},
      success: function(data){
          console.log(data);
          var msg = '<strong style="padding-left:10px;"> Save file success,' + ' open '
              + '<a href="/' + data + '">' + data + '</a></strong>';
          var classStr = 'alert alert-success alert-dismissible';
          showMessage(msg, classStr);
      },
      error: function(){
        console.log("save file error");
        var msg = '<strong style="padding-left:10px;">Sorry, save file failed.</strong>';
        var classStr = 'alert alert-warning alert-dismissible';
        showMessage(msg, classStr);
      }
   });
});

$("#operation").children(":nth-child(3)").on('click', function(){
  window.print();
});

$("#operation").children(":nth-child(4)").on('click', function(){
  var href = $(this).attr("href");
  if(href == "/download/"){ 
    return false;
  }else{
    return true;
  }
});

if(document.getElementById("editor") != null){
  var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
     lineWrapping: true,
     viewportMargin: Infinity
  });
}



