// localStorageに保存したデータの表示
var showStorage = function() {
  $('#cybozu_url').val(localStorage.cybo_url);
  $('#interval').val(localStorage.cybo_interval);
};

// 保存表示
var showAlert = function(){
  $('#save_alert').fadeIn("nomarl",function(){
    setTimeout(function(){
      $('#save_alert').fadeOut();
    },2000);
  });
}

$(function(){
  $('#save').click(function() {
    localStorage.cybo_url = $('#cybozu_url').val();
    var interval = Number($('#interval').val());
    localStorage.cybo_interval = interval >= 1 ? interval : 1;
    showStorage();
    showAlert();

    // background.js に更新を通知
    chrome.runtime.sendMessage({"update": true},function(response) {
      console.log(response);
    });
  });

  showStorage();
});
