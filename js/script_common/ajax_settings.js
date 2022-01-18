$(function() {
  var token = $('meta[name="_csrf"]').attr('content');
  var header = $('meta[name="_csrf_header"]').attr('content');
  $(document).ajaxSend(function(ev, jqXHR, ajaxOptions) {
    jqXHR.setRequestHeader(header, token);
  });

  $(document).ajaxError(function(ev, jqXHR, ajaxSettings) {
    console.error(jqXHR.responseText);
    //alert('通信エラーが発生しました。');
  });
});