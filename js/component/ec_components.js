'use strict';

var ECAREER_COMPANY = ECAREER_COMPANY || {};


/** serverContextPath を考慮した URL で Ajax request を送る。 Promise を返す。
 *
 * 注: url がスラッシュ (/) で始まる場合にのみ使います。 http(s):// で始まる場合には使えません。
 */
ECAREER_COMPANY.asyncRequest = function(ajaxSettings) {
  var serverContextPathSelector = 'meta[name="_server_context_path"]';
  var $serverContextPathElem = $(serverContextPathSelector);
  if ($serverContextPathElem.length === 0) {
    throw new Error('"' + serverContextPathSelector + '" does not exist.');
  }
  var serverContextPath = $serverContextPathElem.attr('content');
  /*
   * properties ファイルの設定を変えて serverContextPath の値を取得してみると、以下のようになった。
   *   server.contextPath=/foo  のとき -> "/foo/"
   *   server.contextPath=/foo/  のとき -> "/foo/"
   *   server.contextPath=/  のとき -> "/"
   *   server.contextPath=  のとき -> "/"
   *   server.contextPath の設定が properties ファイルにないとき -> "/"
   * よって serverContextPath は必ず「スラッシュで始まってスラッシュで終わる」文字列である。
   */
  var pathPrefix = serverContextPath.slice(0, -1); // 最後の文字 (スラッシュ) を取り除いた文字列
  ajaxSettings.url = pathPrefix + ajaxSettings.url;
  var promise = $.ajax(ajaxSettings);
  return promise;
};


// Setup a modal dialog using remodal
ECAREER_COMPANY.modalDialog = function(options) {

  var remodalDialogId = options.remodalDialogId;
  var dialogOpeningCallback = options.dialogOpeningCallback;
  var dialogOpenedCallback = options.dialogOpenedCallback;
  var confirmationCallback = options.confirmationCallback;
  var cancellationCallback = options.cancellationCallback;

  var remodalInstanceSelector = '[data-remodal-id=' + remodalDialogId + ']';

  $(document)
  .on('opening', '.remodal' + remodalInstanceSelector, dialogOpeningCallback)
  .on('opened', '.remodal' + remodalInstanceSelector, dialogOpenedCallback)
  .on('closed', '.remodal' + remodalInstanceSelector, function (ev) {
    if (ev.reason === 'cancellation') {
      cancellationCallback();
    } else { // confirmation (OK)
      confirmationCallback();
    }
  })
  // If outside is clicked, close dialog with reason 'cancellation'. (By default, no reason is specified)
  .on('click', '.remodal-wrapper', function(ev) {
    if ($(this).is(ev.target)) {
      var remodalInstance = $(remodalInstanceSelector).remodal();
      remodalInstance.close('cancellation');
    }
  })
  ;
};


// Setup modal dialog for image file upload
ECAREER_COMPANY.imageFileUploadModalDialog = function(options) {

  var remodalDialogId = options.remodalDialogId;
//  var openDialogBtn = options.openDialogBtn;
  var selectImageFile = options.selectImageFile;
  var imageFileHidden = options.imageFileHidden;
  var imageDisplayArea = options.imageDisplayArea;
  var commentTextField = options.commentTextField;
  var commentHidden = options.commentHidden;
  var commentDisplayArea = options.commentDisplayArea;
  var deleteImageBtn = options.deleteImageBtn;
  var deleteImageHiddenFlg = options.deleteImageHiddenFlg;

  var dialogOpenedCallback = function() {
    commentTextField && $(commentTextField).val( $(commentDisplayArea).text() );
  };
  var confirmationCallback = function() {
    commentHidden && $(commentHidden).val( $(commentTextField).val() );
    commentDisplayArea && $(commentDisplayArea).text( $(commentTextField).val() );
    // var fileList = $(selectImageFile).files;
    // if (fileList && fileList.length > 0) {
    //  var blobUrl = window.URL.createObjectURL(fileList[0]);
    //  $(imageDisplayArea).attr('src', blobUrl);
    //  $(deleteImageHiddenFlg).val(false);
    // }
  };
  var cancellationCallback = function() {
    // revert the fields in the dialog
    commentTextField && $(commentTextField).val( $(commentHidden).val() );
    $(selectImageFile).val( $(imageFileHidden).val() );
  };

  ECAREER_COMPANY.modalDialog({
    remodalDialogId: remodalDialogId,
    dialogOpeningCallback: function() {},
    dialogOpenedCallback: dialogOpenedCallback,
    confirmationCallback: confirmationCallback,
    cancellationCallback: cancellationCallback,
  });

  $(document)
  //TODO: Fix 設定ボタンを押して初めて画像の表示が変更されるようにする
  .on('change', selectImageFile, function() {
    var fileList = this.files;
    var blobUrl = window.URL.createObjectURL(fileList[0]);
    $(imageDisplayArea).attr('src', blobUrl);
    $(deleteImageHiddenFlg).val(false);
  })
  .on('click', deleteImageBtn, function() {
    $(deleteImageHiddenFlg).val(true);
    $(selectImageFile).val('');
    $(imageDisplayArea).attr('src', '');
    commentTextField && $(commentTextField).val('');
    commentHidden && $(commentHidden).val('');
    commentDisplayArea && $(commentDisplayArea).text('');
  })
  ;

};


// 固定文
ECAREER_COMPANY.fixedTemplate = function(options) {

  var $button = options.$button;
  var $textArea = options.$textArea;
  var defaultText = options.defaultText;

  $button.on('click', function(ev) {
    ev.preventDefault();
    if (window.confirm('現在の内容を削除して固定文を入力します。よろしいですか？')) {
      $textArea.val(defaultText);
      $textArea.focus();
    }
  });

};


// 双方向チェックボックス(チェックボックス1とチェックボックス2のチェック状態が常に一致するようにする)
ECAREER_COMPANY.bidirectionalCheckboxes = function(options) {

  var chk1Selector = options.chk1Selector;
  var chk2Selector = options.chk2Selector;

  function setupTopCheckboxToReferChildren(thisChkSelector, anotherChkSelector) {
    $(thisChkSelector).on('change', function(ev) {
      if( $(this).prop('checked') === false) return false;
      var isThisChecked = this.checked;
      var $anotherChk = $(anotherChkSelector);
      if ($anotherChk.is(':checked') !== isThisChecked) {
        $anotherChk.trigger('click');
      }
    });
  }

  function setupChildCheckboxToReferTop(thisChkSelector, anotherChkSelector) {
    $(thisChkSelector).on('change', function(ev) {
      var isThisChecked = this.checked;
      var $anotherChk = $(anotherChkSelector);
      if ($anotherChk.is(':checked') !== isThisChecked) {
        $anotherChk.trigger('click');
      }
    });
  }

  setupTopCheckboxToReferChildren(chk1Selector, chk2Selector);
  setupChildCheckboxToReferTop(chk2Selector, chk1Selector);
};
