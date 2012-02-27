// adds required generic attributes to account if they
// do not already exist
var asdfTouchIdentity = function(identity) {
  try {      
	  if (identity instanceof Components.interfaces.nsIMsgIdentity) {	    
      // if asdfAutoSaveDraftFolder does not exist, 
      // create it an assign the value of the draft folder
      if (!identity.getCharAttribute("asdfAutoSaveDraftFolder")) {
        identity.setCharAttribute("asdfAutoSaveDraftFolder",
            identity.draftFolder);			
        identity.setIntAttribute("asdfAutoSaveDraftsFolderPickerMode",
            identity.draftsFolderPickerMode);
      }
    }
  } catch(ex) {
    // all exceptions caught so that base method is sure to be called
    alert(ex);
  }
}