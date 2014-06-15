var intervalTime = chrome.extension.getBackgroundPage().intervalTime;
var base_url = "https://github.com";

// 時間文字列生成
function dateToStr(date){
  function zero(number){
    return ('00' + number).slice(-2);
  }

  return zero(date.getHours()) + ":" + zero(date.getMinutes()) + ":" + zero(date.getSeconds());
}

// ニュースを更新
function updateNews(){
  var parsedItems = chrome.extension.getBackgroundPage().parsedItems;
  var lastUpdatedAt = chrome.extension.getBackgroundPage().lastUpdatedAt;
  var unread_num = parsedItems.length;

  $('#update').html("未読(" + unread_num + ") - " + dateToStr(lastUpdatedAt));
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

$(document).ready(function() {
  // 記事選択時に background.js へ既読を通知する
  $("#list").on("click",".title", function(){
    var no = $(this).data("id");
    $(this).closest("tr").fadeOut();
    chrome.runtime.sendMessage({"delete_no": no,},function(response) {
      console.log('message sent:' + no);
    });
  });

  // 定周期でPopupを更新する
  updateNews();
  setInterval(updateNews,intervalTime);
});
