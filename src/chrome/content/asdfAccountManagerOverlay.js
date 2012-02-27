// override getValueArrayFor method
var asdf_base_getValueArrayFor = getValueArrayFor;  
getValueArrayFor = function(account) {  
  // make sure this account has required attributes
  try {
    if (account) {      
      for (var identity in fixIterator(account.identities, Components.interfaces.nsIMsgIdentity))
        asdfTouchIdentity(identity);
    }
  } catch (ex) {
    alert(ex);
  }
  // call base method
  return asdf_base_getValueArrayFor(account);
}
