// localStorageのキー
var key = "cybo_url";

// localStorageに保存したデータの表示
var showStorage = function() {
  var url = localStorage.getItem(key);
  $('#cybozu_url').val(url);
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
    var url = $('#cybozu_url').val();
    localStorage.setItem(key, url);
    showStorage();
    showAlert();
  });

  showStorage();
});
