var parsedItems = [];
var lastUpdatedAt = null;
var newsParam     = "ag.cgi?page=ReportWhole";
var bulletinParam = "ag.cgi?page=BulletinIndex";
var notificationParam = "ag.cgi?page=NotificationIndex";
var reportDepth = 3; // 20件 x depth
var number = 0;

var baseUrl = "";
var intervalTime = getInterval();

function updateBadge(count){
  if (count == 0){
    chrome.browserAction.setBadgeBackgroundColor({color:[0, 0, 255, 100]});
  }else{
    chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 100]});
  }
  chrome.browserAction.setBadgeText({text:String(count)});
}

function getReport(urlParam, depth, callback){
  $.get(baseUrl + urlParam, function(data) {
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
      var title = $elems.eq(1).html().replace('href="','data-id="' + current_no + '" class="title-link" target="_blank" href="' + baseUrl);
      var date = $elems.eq(3).text()
      return {no: current_no, title: title, date: date};
    });

    // 結果を格納
    parsedItems = parsedItems.concat(items);

    depth--;
    if (depth > 0){
      // 次のリンク先を取得
      var nextLinks = $data.find(".vr_nNavi").find("a");
      var nextLink = null;
      nextLinks.each(function(){
        if ($(this).text().match("次の20件へ")){
          nextLink = $(this).attr("href");
        }
      });
      if (nextLink){
        getReport(nextLink, depth, callback);
      }else{
        callback();
      }
    }else{
      callback();
    }
  });
}

function getBulletin(callback){
  // 掲示板の取得
  $.get(baseUrl + bulletinParam, function(data) {
    var $data = $(data);
    var news = $data.find(".dataList").find("tr");

    var items = $.map(news,function(one_news, i) {
      if (i == 0){ return null; } // 1つ目は見出し
      var $elems = $(one_news).find("td");
      if ($elems.eq(0).find("b").length > 0){
        // 本文未読の場合は有効
      }else if ($elems.eq(0).find("img").attr("src").match("_u.png")){
        // コメント未読の場合は有効
      }else{
        return null;
      }

      var current_no = number++;
      var title = $elems.eq(0).html().replace('href="','data-id="' + current_no + '" class="title-link" target="_blank" href="' + baseUrl);
      var date = $elems.eq(3).text()
      return {no: current_no, title: title, date: date};
    });

    parsedItems = parsedItems.concat(items);

    callback();
  });
}

function getNotification(callback){
  // メッセージの取得
  $.get(baseUrl + notificationParam, function(data) {
    var $data = $(data);
    var notifications= $data.find(".notificationRow");

    var items = $.map(notifications,function(notification) {
      var $elems = $(notification).find(".notificationSubject");
      if ($elems[0] == undefined){ return null; }

      var current_no = number++;
      var title = $elems.eq(0).html().replace('href="','data-id="' + current_no + '" class="title-link" target="_blank" href="' + baseUrl);
      var date = "-";

      return {no: current_no, title: title, date: date};
    });

    parsedItems = parsedItems.concat(items);

    callback();
  });
}

function doMonitor(callback){
  baseUrl = localStorage.cybo_url;
  if (baseUrl == null || baseUrl == ""){
    if (callback){
      callback();
    }
    return;
  }

  parsedItems = [];
  getReport(newsParam, reportDepth, function(){
    getBulletin(function(){
      getNotification(function(){
        lastUpdatedAt = new Date();
        updateBadge(parsedItems.length);
        chrome.runtime.sendMessage({"update": "ok",},function(response) {
          console.log('message res:' + response);
        });
        if (callback){
          callback();
        }
      });
    });
  });
}

function getInterval(){
  var interval = Number(localStorage.cybo_interval);
  return interval >= 1 ? interval * 60 * 1000 : 60000;
}

var timerId = 0;
function startMonitoring(){
  doMonitor();
  intervalTime = getInterval();
  timerId = setTimeout(startMonitoring, intervalTime);
}

function stopMonitoring(){
  if (timerId == 0){ return; }
  clearTimeout(timerId);
  timerId = 0;
}

function restartMonitoring(){
  stopMonitoring();
  startMonitoring();
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.delete_no){
      // 既読時に元配列から削除する
      var delete_no = request.delete_no;

      parsedItems.some(function(v, i){
        if (v.no == delete_no) parsedItems.splice(i,1);
        console.log("deleted : " + delete_no);
      });

      // バッジを更新
      updateBadge(parsedItems.length);
      sendResponse('finish');
      return;
    } else if (request.update){
      restartMonitoring();
      sendResponse('finish');
      return;
    } else if (request.update_from_content){
      doMonitor(function(){
        chrome.tabs.getSelected(null, function(tab) {
          chrome.tabs.sendRequest(tab.id, {updated: "ok"}, function(response) {
            console.log("updated: " + response);
          });
        });
      });
      sendResponse('finish');
      return;
    } else if (request.list){
      sendResponse(parsedItems);
      return;
    }
  }
);

// 定周期で取得を繰り返す
$(document).ready(function() {
  startMonitoring();
});
