// 時間文字列生成
function dateToStr(date){
  function zero(number){
    return ('00' + number).slice(-2);
  }

  return zero(date.getHours()) + ":" + zero(date.getMinutes()) + ":" + zero(date.getSeconds());
}

// ニュースを更新
function updateNews(){
  var baseUrl = chrome.extension.getBackgroundPage().baseUrl;
  var parsedItems = chrome.extension.getBackgroundPage().parsedItems;
  var lastUpdatedAt = chrome.extension.getBackgroundPage().lastUpdatedAt;

  // URLが設定されていなければ警告表示
  if (baseUrl == null || baseUrl == ""){
    alert("[設定]->[拡張機能]->[CyboMonitor]のオプションからサイボウズURLを設定してください");
    return;
  }

  if (lastUpdatedAt){
    $('#update').html(dateToStr(lastUpdatedAt));
  }

  $("#list").empty();
  parsedItems.forEach(function(item){
    $("#list").append(
      $('<tr>').append(
        $('<td>').addClass("title").attr("nowrap",'').append(
          $('<div/>').html(item.title)
        )
      ).append(
        $('<td>').addClass("time").attr("nowrap",'').append(
          $('<div/>').html(item.date)
        )
      )
    )
  });
}

// 更新イベントが来たらリストを更新する
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.update){
      updateNews();
    }
    sendResponse("updated");
  }
);

$(document).ready(function() {
  // 記事選択時に background.js へ既読を通知する
  $("#list").on("click",".title-link", function(){
    var no = $(this).data("id");
    $(this).closest("tr").fadeOut();
    chrome.runtime.sendMessage({"delete_no": no,},function(response) {
      console.log(response);
    });
  });

  // 更新を background.js へ通知する
  $("#update_btn").click(function(){
    chrome.runtime.sendMessage({"update": true},function(response) {
      console.log(response);
    });
  });

  // 初回Popupを更新する
  updateNews();
});
