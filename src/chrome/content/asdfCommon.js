// adds required generic attributes to account if they
// do not already exist
asdfTouchAccount = function(account) {
  try {  
    if (account) {
	  // if asdfAutoSaveDraftFolder does not exist, 
	  // create it an assign the value of the draft folder
      if (!account.defaultIdentity.getCharAttribute("asdfAutoSaveDraftFolder"))
        account.defaultIdentity.setCharAttribute("asdfAutoSaveDraftFolder",
            account.defaultIdentity.draftFolder);			
	  // if asdfAutoSaveDraftFolder does not exist, 
	  // create it an assign the value of the draft folder
	  if (account.defaultIdentity.getIntAttribute("asdfAutoSaveDraftsFolderPickerMode") == null)
	    account.defaultIdentity.setIntAttribute("asdfAutoSaveDraftsFolderPickerMode",
            account.defaultIdentity.draftsFolderPickerMode);
    }
  } catch(ex) {
    // all exceptions caught so that base method is sure to be called
	alert(ex);
  }
}