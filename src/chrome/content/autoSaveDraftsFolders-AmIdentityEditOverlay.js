var autoSaveDraftsFolders_base_onInitCopiesAndFolders;

// override initCopiesAndFolder method
var autoSaveDraftsFolders_base_initCopiesAndFolder = initCopiesAndFolder;  
initCopiesAndFolder = function(identity) {     
  
  // override onInitCopiesAndFolders method 
  autoSaveDraftsFolders_base_onInitCopiesAndFolders = onInitCopiesAndFolders;  
  onInitCopiesAndFolders = function() {   
    try {
      // have to repeat this from calling function - don't know of a way to get it directly
      var copiesAndFoldersIdentity = identity ? identity : gAccount.defaultIdentity; 
      
      // touch identity incase it does not have custom attributes yet
      autoSaveDraftsFolders_TouchIdentity(copiesAndFoldersIdentity);
      
      // assign values
      if (copiesAndFoldersIdentity instanceof Components.interfaces.nsIMsgIdentity) {	   
        document.getElementById('identity.autoSaveDraftsFolders_AutoSaveDraftFolder').value = 
            copiesAndFoldersIdentity.getCharAttribute("autoSaveDraftsFolders_AutoSaveDraftFolder");
        document.getElementById('identity.autoSaveDraftsFolders_AutoSaveDraftsFolderPickerMode').value = 
            copiesAndFoldersIdentity.getIntAttribute("autoSaveDraftsFolders_AutoSaveDraftsFolderPickerMode") ? 
            copiesAndFoldersIdentity.getIntAttribute("autoSaveDraftsFolders_AutoSaveDraftsFolderPickerMode") : 0;
      }
    } catch (ex) {
      // just in case - so we don't break built in
      alert(ex);
    }
    // call base method
    autoSaveDraftsFolders_base_onInitCopiesAndFolders();
  };
  
  // call base method  
  autoSaveDraftsFolders_base_initCopiesAndFolder(identity);
  
  // ditch override
  onInitCopiesAndFolders = autoSaveDraftsFolders_base_onInitCopiesAndFolders;
};

//override saveCopiesAndFolderSettings method
var autoSaveDraftsFolders_base_saveCopiesAndFolderSettings = saveCopiesAndFolderSettings;
saveCopiesAndFolderSettings = function (identity) {
  // call base method
  autoSaveDraftsFolders_base_saveCopiesAndFolderSettings(identity);
  try {
    identity.setCharAttribute("autoSaveDraftsFolders_AutoSaveDraftFolder",
        document.getElementById('identity.autoSaveDraftsFolders_AutoSaveDraftFolder').value);
    identity.setIntAttribute("autoSaveDraftsFolders_AutoSaveDraftsFolderPickerMode",
            document.getElementById('identity.autoSaveDraftsFolders_AutoSaveDraftsFolderPickerMode').value);
  } catch (ex) {
    alert(ex);
  }
};
