// override getValueArrayFor method
var asdf_base_getValueArrayFor = getValueArrayFor;  
getValueArrayFor = function(account) {  
  // make sure this account has required attributes
  asdfTouchAccount(account);
  // call base method
  return asdf_base_getValueArrayFor(account);
}
