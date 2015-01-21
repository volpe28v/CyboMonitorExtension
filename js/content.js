chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.updated){
      getReportList()
    }
    sendResponse('ok');
  }
);

chrome.runtime.sendMessage({"update_from_content": "ok",},function(response) {
  console.log("update_from_content: " + response);
});

function getReportList(){
  chrome.runtime.sendMessage({"list": "ok",},function(response) {
    console.log('list:' + response.length);
    if (response.length == 0){ return; }

    setTitleLink(response[0].title);
  });
}

function setTitleLink(title){
  var $unjump_title = $(title.replace('target="_blank"',""));
  var $nextLi= $('<li/>')
    .addClass("yuimenubaritem vr_headerMenuAdmin yuimenubaritem-hassubmenu")
    .attr("groupindex",0).attr("index",5)
    .css("display","none")
    .append($('<span/>')
      .addClass('latest-report-link')
      .append($unjump_title)
    );

  $('.headermenutip').append($nextLi);
  $nextLi.fadeIn();
}
