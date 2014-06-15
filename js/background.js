var parsedItems = [];
var lastUpdatedAt = new Date();
var intervalTime = 60000;
var base_url = "https://dg1uu.cybozu.com/o/";
var news_param = "ag.cgi?page=ReportWhole";
var number = 0;

function doMonitor(){
 $.get(base_url + news_param, function(data) {
    var $data = $(data);
    var news = $data.find(".dataList").find("tr");

    var items = $.map(news,function(one_news, i) {
      if (i == 0){ return null; } // 1つ目は見出し
      var $elems = $(one_news).find("td");
      if ($elems.eq(1).find("b").length > 0){
        // 本文未読の場合は有効
      }else if ($elems.eq(1).find("img").attr("src").match("_u.png")){
        // コメント未読の場合は有効
      }else{
        return null;
      }

      var current_no = number++;
      var title = $elems.eq(1).html().replace('href="','data-id="' + current_no + '" class="title" target="_blank" href="' + base_url);
      var date = $elems.eq(3).text()
      return {no: current_no, title: title, date: date};
    });

    parsedItems = items;
    console.log(items);
    lastUpdatedAt = new Date();
  });
}

// 既読時に元配列から削除する
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var delete_no = request.delete_no;

    parsedItems.some(function(v, i){
      if (v.no == delete_no) parsedItems.splice(i,1);
      console.log("deleted : " + delete_no);
    });

    var res = 'finish';
    sendResponse(res);
  }
);

// 定周期で取得を繰り返す
$(document).ready(function() {
  doMonitor();
  setInterval(doMonitor,intervalTime);
});
