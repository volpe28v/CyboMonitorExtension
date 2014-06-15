var parsedItems = [];
var lastUpdatedAt = new Date();
var intervalTime = 10000;
var base_url = "https://dg1uu.cybozu.com/o/";
var news_param = "ag.cgi?page=ReportWhole";

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

      var title = $elems.eq(1).html().replace('href="','target="_blank" href="' + base_url);
      var date = $elems.eq(3).text()
      return {title: title, date: date};
    });

    parsedItems = items;
    console.log(items);
    lastUpdatedAt = new Date();
  });
}

// 定周期で取得を繰り返す
$(document).ready(function() {
  doMonitor();
  setInterval(doMonitor,intervalTime);
});
