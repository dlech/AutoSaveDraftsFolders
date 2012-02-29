var asdf_base_onInitCopiesAndFolders;

// override initCopiesAndFolder method
var asdf_base_initCopiesAndFolder = initCopiesAndFolder;  
initCopiesAndFolder = function(identity) {     
  
  // override onInitCopiesAndFolders method 
  asdf_base_onInitCopiesAndFolders = onInitCopiesAndFolders;  
  onInitCopiesAndFolders = function() {   
    try {
      // have to repeat this from calling function - don't know of a way to get it directly
      var copiesAndFoldersIdentity = identity ? identity : gAccount.defaultIdentity; 
      
      // touch identity incase it does not have custom attributes yet
      asdfTouchIdentity(copiesAndFoldersIdentity);
      
      // assign values
      if (copiesAndFoldersIdentity instanceof Components.interfaces.nsIMsgIdentity) {	   
        document.getElementById('identity.asdfAutoSaveDraftFolder').value = 
            copiesAndFoldersIdentity.getCharAttribute("asdfAutoSaveDraftFolder");
        document.getElementById('identity.asdfAutoSaveDraftsFolderPickerMode').value = 
            copiesAndFoldersIdentity.getIntAttribute("asdfAutoSaveDraftsFolderPickerMode") ? 
            copiesAndFoldersIdentity.getIntAttribute("asdfAutoSaveDraftsFolderPickerMode") : 0;
      }
    } catch (ex) {
      // just in case - so we don't break built in
      alert(ex);
    }
    // call base method
    asdf_base_onInitCopiesAndFolders();
  };
  
  // call base method  
  asdf_base_initCopiesAndFolder(identity);
  
  // ditch override
  onInitCopiesAndFolders = asdf_base_onInitCopiesAndFolders;
};

//override saveCopiesAndFolderSettings method
var asdf_base_saveCopiesAndFolderSettings = saveCopiesAndFolderSettings;
saveCopiesAndFolderSettings = function (identity) {
  // call base method
  asdf_base_saveCopiesAndFolderSettings(identity);
  try {
    identity.setCharAttribute("asdfAutoSaveDraftFolder",
        document.getElementById('identity.asdfAutoSaveDraftFolder').value);
    identity.setIntAttribute("asdfAutoSaveDraftsFolderPickerMode",
            document.getElementById('identity.asdfAutoSaveDraftsFolderPickerMode').value);
  } catch (ex) {
    alert(ex);
  }
};
