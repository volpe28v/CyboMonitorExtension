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
  var $nextLi= $('<li/>')
    .addClass("yuimenubaritem vr_headerMenuAdmin yuimenubaritem-hassubmenu")
    .attr("groupindex",0).attr("index",5)
    .append($('<span/>')
      .addClass('latest-report-link')
      .html(title)
    );

  $('.headermenutip').append($nextLi);
}
