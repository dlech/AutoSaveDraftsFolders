// override getValueArrayFor method
var autoSaveDraftsFolders_base_getValueArrayFor = getValueArrayFor;  
getValueArrayFor = function(account) {  
  // make sure this account has required attributes
  try {
    if (account) {            
      if (account.defaultIdentity) {
        autoSaveDraftsFolders_TouchIdentity(account.defaultIdentity);
      }
    }
  } catch (ex) {
    alert(ex);
  }
  // call base method
  return autoSaveDraftsFolders_base_getValueArrayFor(account);
}
