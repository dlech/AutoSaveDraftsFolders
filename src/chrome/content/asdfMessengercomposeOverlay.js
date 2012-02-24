// used to remember drafts folder since we will be writing over it for autosave
var asdfDraftFolder;

var asdfUpdateDraftFolder = function() {
  try {
  // get message save type
  var msgType = document.getElementById("msgcomposeWindow").getAttribute("msgtype");      
  // get current account
  var currentAccountKey = getCurrentAccountKey();
  var account = gAccountManager.getAccount(currentAccountKey);
  // can't do what we need without account
  if (!account)
    return;
	
  // TODO add support for other identities
	
  // backup drafts folder if it has not already been backed up
  if (!asdfDraftFolder)
    asdfDraftFolder = account.defaultIdentity.draftFolder;
  // if we are not autosaving put drafts folder back
  if (msgType != nsIMsgCompDeliverMode.AutoSaveAsDraft) {
    account.defaultIdentity.draftFolder = asdfDraftFolder;
  } else {
    // set autosave folder attributes in case user has not 
    asdfTouchAccount(account);
	account.draftsFolder = account.defaultIdentity.getCharAttribute("asdfAutoSaveDraftsFolder");
  }
  } catch(ex) {
    alert(ex);
  }
}

// listen for compose-send-message event
document.getElementById("msgcomposeWindow").addEventListener("compose-send-message", function () { asdfUpdateDraftFolder(); }, false);