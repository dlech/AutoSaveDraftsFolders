// adds required generic attributes to account if they
// do not already exist
var autoSaveDraftsFolders_TouchIdentity = function(identity) {
  try {      
	  if (identity instanceof Components.interfaces.nsIMsgIdentity) {	    
      // if autoSaveDraftsFolders_AutoSaveDraftFolder does not exist, 
      // create it an assign the value of the draft folder
      if (!identity.getCharAttribute("autoSaveDraftsFolders_AutoSaveDraftFolder")) {
        identity.setCharAttribute("autoSaveDraftsFolders_AutoSaveDraftFolder",
            identity.draftFolder);			
        identity.setIntAttribute("autoSaveDraftsFolders_AutoSaveDraftsFolderPickerMode",
            identity.draftsFolderPickerMode);
      }
    }
  } catch(ex) {
    // all exceptions caught so that base method is sure to be called
    alert(ex);
  }
}