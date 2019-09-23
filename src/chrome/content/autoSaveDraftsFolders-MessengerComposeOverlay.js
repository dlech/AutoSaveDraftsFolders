// used to remember drafts folder since we will be writing over it for autosave
var autoSaveDraftsFolders_gDraftFolderBackup;
var autoSaveDraftsFolders_gDraftFolderIdentityBackup;

var autoSaveDraftsFolders_UpdateDraftFolder = function() {
  try {
    // get message save type
    var msgType = document.getElementById("msgcomposeWindow").getAttribute("msgtype");  
    // if this is not an auto save, they we don't do anything
    if (msgType != Components.interfaces.nsIMsgCompDeliverMode.AutoSaveAsDraft)
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
    if (!autoSaveDraftsFolders_gDraftFolderBackup) {
      autoSaveDraftsFolders_gDraftFolderBackup = currentIdentity.draftFolder;  
      autoSaveDraftsFolders_gDraftFolderIdentityBackup = currentIdentity;
    }
    // uncomment alert for debuging
    //alert("Backed-up folder is: " + autoSaveDraftsFolders_gDraftFolderBackup);
    // set autosave folder attributes in case user has not 
    autoSaveDraftsFolders_TouchIdentity(currentIdentity);
    // set draft folder in user preferences
	  currentIdentity.draftFolder = currentIdentity.getCharAttribute("autoSaveDraftsFolders_AutoSaveDraftFolder");   
    // uncomment alert for debuging
    //alert("Auto Save: " + currentIdentity.draftFolder);
  } catch(ex) {
    alert(ex);
  }
}

var autoSaveDraftsFolders_gSendListener = {
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

var autoSaveDraftsFolders_gMsgComposeStateListener = {
  NotifyComposeFieldsReady : function () {},
  ComposeProcessDone : function (aResult) {},
  SaveInFolderDone : function (folderName) {
    try {
      // if folder has been backed up
      if (autoSaveDraftsFolders_gDraftFolderBackup) {    
        // can't do anything if we don't have an identity to work with
        if(!autoSaveDraftsFolders_gDraftFolderIdentityBackup)
          return;        
        // restore backed up folder
        autoSaveDraftsFolders_gDraftFolderIdentityBackup.draftFolder = autoSaveDraftsFolders_gDraftFolderBackup; 
        autoSaveDraftsFolders_gDraftFolderBackup = null;
        // uncomment alert for debuging
        //alert("Folder done:\n" + autoSaveDraftsFolders_gDraftFolderIdentityBackup.draftFolder);
        //alert("saved folder:\n" + gMsgCompose.savedFolderURI);
        // get folder object - should be auto save folder
        var folder = MailUtils.getExistingFolder(folderName);  
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
var autoSaveDraftsFolders_OnComposeWindowInit = function() {
  gMsgCompose.addMsgSendListener(autoSaveDraftsFolders_gSendListener);  
  gMsgCompose.RegisterStateListener(autoSaveDraftsFolders_gMsgComposeStateListener);
}

var autoSaveDraftsFolders_OnComposeWindowUnload = function() {
  gMsgCompose.removeMsgSendListener(autoSaveDraftsFolders_gSendListener);  
  gMsgCompose.UnregisterStateListener(autoSaveDraftsFolders_gMsgComposeStateListener);
}

// listen for compose-window-init
window.addEventListener("compose-window-init", autoSaveDraftsFolders_OnComposeWindowInit, true);
// listen for compose-send-message event
window.addEventListener("compose-send-message", autoSaveDraftsFolders_UpdateDraftFolder, true);
// TODO add close listener to unregister other listeners
window.addEventListener("compose-window-unload", autoSaveDraftsFolders_OnComposeWindowUnload, false);
