
// TODO: minifiyすること。ファイル数が増えてHTTP1.1だと遅くなる
$(document).ready(function() {

  /**
   * メールに記載する情報を格納する変数
   */
  var address, subject, body;

  $('.invokeMailer').on('click', function(ev) {
    ev.preventDefault();
    address = 'info@ecareer.ne.jp';
    subject = 'イーキャリア管理者画面からのお問い合わせ';
    body =  "お問い合わせに迅速に対応する為、下記の内容を添えてご連絡いただけますでしょうか。\r\n" +
            "お手数をおかけいたしますが、何卒よろしくお願い致します。\r\n" +
            "\r\n" +
            "貴社名　　：\r\n" +
            "ご担当者名：\r\n" +
            "企業コード：" + $('#companyCode').text() + "\r\n" +
            "ご連絡先　\r\n" +
            "　　メールアドレス：\r\n" +
            "　　電話番号　　　：\r\n" +
            "\r\n" +
            "※企業コードは管理者画面ログイン時に入力する11桁の数字です。\r\n" +
            "\r\n" +
            "\r\n" +
            "■以下にお問い合わせ内容をご入力ください。\r\n" +
            "\r\n" +
            "\r\n";

    body = encodeURIComponent(body);

    // subjectが空だと「&body=」が件名に入ってしまったので、件名と本文が決まるまでショートバージョンにしておく
    // location.href = 'mailto:' + address ;
    location.href = 'mailto:' + address + '?subject=' + subject + '&body=' + body;
  });

});