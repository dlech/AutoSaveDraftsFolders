// used to remember drafts folder since we will be writing over it for autosave
var asdf_gDraftFolder;

var asdfUpdateDraftFolder = function() {
  try {
    // get message save type
    var msgType = document.getElementById("msgcomposeWindow").getAttribute("msgtype");  
    // if this is not an auto save, they we don't do anything
    if (msgType != nsIMsgCompDeliverMode.AutoSaveAsDraft)
      return;
    // get current identity
    var currentIdentity = getCurrentIdentity();
    // can't do anything if it is not valid
    if(!currentIdentity)
      return;
    // backup drafts folder if it has not already been backed up
    if (!asdf_gDraftFolder)
      asdf_gDraftFolder = currentIdentity.draftFolder;  
    // uncomment alert for debuging
    alert("Backedup folder is: " + asdf_gDraftFolder);
    // set autosave folder attributes in case user has not 
    asdfTouchAccount(currentIdentity);
    // set draft folder in user preferences
	  currentIdentity.draftFolder = currentIdentity.getCharAttribute("asdfAutoSaveDraftFolder");   
    // uncomment alert for debuging
    alert("Auto Save: " + currentIdentity.draftFolder);
  } catch(ex) {
    alert(ex);
  }
}

var asdf_gSendListener = {
  // nsIMsgSendListener
  onStartSending: function (aMsgID, aMsgSize) {}, // not used
  onProgress: function (aMsgID, aProgress, aProgressMax) {}, // not used
  onStatus: function (aMsgID, aMsg) {}, // not used
  onStopSending: function (aMsgID, aStatus, aMsg, aReturnFile) {}, // not used
  onGetDraftFolderURI: function (aFolderURI) {    
    // uncomment alert for debugging
    //alert("Saving draft to: " + aFolderURI);
  },
  onSendNotPerformed: function (aMsgID, aStatus) {}, // not used
};

var asdf_gMsgComposeStateListener = {
  NotifyComposeFieldsReady : function () {},
  ComposeProcessDone : function (aResult) {},
  SaveInFolderDone : function (folderName) {
    // if folder has been backed up
    if (asdf_gDraftFolder) {
      // get current identity
      var currentIdentity = getCurrentIdentity();
      // can't do anything if it is not valid
      if(!currentIdentity)
        return;
      // restore backed up folder
      currentIdentity.draftFolder = asdf_gDraftFolder; 
      // uncomment alert for debuging
      alert("Folder done:\n" + currentIdentity.draftFolder);
    }
  },
  NotifyComposeBodyReady : function () {},
};

// after init, we can add a message send listener  
var asdfOnComposeWindowInit = function() {
  gMsgCompose.addMsgSendListener(asdf_gSendListener);  
  gMsgCompose.RegisterStateListener(asdf_gMsgComposeStateListener);
}

var asdfOnComposeWindowUnload = function() {
  gMsgCompose.removeMsgSendListener(asdf_gSendListener);  
  gMsgCompose.UnregisterStateListener(asdf_gMsgComposeStateListener);
}

// listen for compose-window-init
document.getElementById("msgcomposeWindow").addEventListener("compose-window-init", asdfOnComposeWindowInit, false);
// listen for compose-send-message event
document.getElementById("msgcomposeWindow").addEventListener("compose-send-message", asdfUpdateDraftFolder, false);
// TODO add close listener to unregister other listeners
document.getElementById("msgcomposeWindow").addEventListener("unload", asdfOnComposeWindowUnload, false);