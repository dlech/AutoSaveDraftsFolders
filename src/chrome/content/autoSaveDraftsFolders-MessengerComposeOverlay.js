// used to remember drafts folder since we will be writing over it for autosave
var asdf_gDraftFolderBackup;
var asdf_gDraftFolderIdentityBackup;

var asdfUpdateDraftFolder = function() {
  try {
    // get message save type
    var msgType = document.getElementById("msgcomposeWindow").getAttribute("msgtype");  
    // if this is not an auto save, they we don't do anything
    if (msgType != nsIMsgCompDeliverMode.AutoSaveAsDraft)
      return;
    // compose also uses autosave when user closes compose window and selects 'save'
    // in the dialog box. Here, we should actually save to the normal drafts folder
    // even thougn it is called as an autosave. gCloseWindowAfterSave is set to true
    // just before GenericSendMessage is called, so we can use it at a flag that this 
    // is the case.
    if (gCloseWindowAfterSave)
      return;
    // get current identity
    var currentIdentity = getCurrentIdentity();
    // can't do anything if it is not valid
    if(!currentIdentity)
      return;
    // backup drafts folder if it has not already been backed up
    if (!asdf_gDraftFolderBackup) {
      asdf_gDraftFolderBackup = currentIdentity.draftFolder;  
      asdf_gDraftFolderIdentityBackup = currentIdentity;
    }
    // uncomment alert for debuging
    //alert("Backed-up folder is: " + asdf_gDraftFolderBackup);
    // set autosave folder attributes in case user has not 
    asdfTouchIdentity(currentIdentity);
    // set draft folder in user preferences
	  currentIdentity.draftFolder = currentIdentity.getCharAttribute("asdfAutoSaveDraftFolder");   
    // uncomment alert for debuging
    //alert("Auto Save: " + currentIdentity.draftFolder);
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
    try {
      // if folder has been backed up
      if (asdf_gDraftFolderBackup) {    
        // can't do anything if we don't have an identity to work with
        if(!asdf_gDraftFolderIdentityBackup)
          return;        
        // restore backed up folder
        asdf_gDraftFolderIdentityBackup.draftFolder = asdf_gDraftFolderBackup; 
        asdf_gDraftFolderBackup = null;
        // uncomment alert for debuging
        //alert("Folder done:\n" + asdf_gDraftFolderIdentityBackup.draftFolder);
        //alert("saved folder:\n" + gMsgCompose.savedFolderURI);
        // get folder object - should be auto save folder
        var folder = MailUtils.getFolderForURI(folderName, false);  
        // set draft flag on folder - it was cleared by restoring the normal drafts folder 
        folder.setFlag(Components.interfaces.nsMsgFolderFlags.Drafts);
      }      
    } catch (ex) {
      alert(ex);
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