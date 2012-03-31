var asdf_gAutoSaveDraftsRadioElemChoice;
var asdf_gAutoSaveDraftsRadioElemChoiceLocked;

var asdf = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("asdf-strings");	
    // add support for preferences
    this.prefs = Components.classes["@mozilla.org/preferences-service;1"]  
        .getService(Components.interfaces.nsIPrefService)  
        .getBranch("extensions.asdf.");  
    this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);  
	  this.prefs.addObserver("", this, false); 	     
  },
  
  onUnload: function() {    
    // cleanup preferences
    this.prefs.removeObserver("", this);  
  },
  
  observe: function(subject, topic, data) {  
    if (topic != "nsPref:changed") {  
      return; // only need to act on pref change
    }  
    // process change	
    switch(data) {  
      //case "showDeleteButton":  
         //this.updateJunkSpamButtons();
         //break;  
      }  
  }, 
  
  // Set radio element choices and picker states
 setPickersState: function (enablePickerId, disablePickerId, event)
 {
   SetPickerEnabling(enablePickerId, disablePickerId);
 
   var radioElemValue = event.target.value;
 
   switch (event.target.id) {     
     case "asdfAutoSaveDraft_selectAccount":
     case "asdfAutoSaveDraft_selectFolder":
       asdf_gAutoSaveDraftsRadioElemChoice = radioElemValue;
       break;     
     default:
       dump("Error in setting picker state.\n");
       return;
   }
 },
  
  noteSelectionChange: function(type, event) {
    var checkedElem = document.getElementById("asdfAutoSaveDraft_select" + type);
    var folder = event.target._folder;
    var modeValue = checkedElem.value;
    var radioGroup = checkedElem.radioGroup.getAttribute("id");
    var picker;
    asdf_gAutoSaveDraftsRadioElemChoice = modeValue;
    asdf_gAutoSaveDraftsRadioElemChoice = modeValue;
    picker = document.getElementById("asdfAutoSaveDrafts" + type + "Picker");
    picker.folder = folder;
    picker.setAttribute("label", folder.prettyName);
  }
};

// override onInitCopiesAndFolders method
asdf.base_onInitCopiesAndFolders = onInitCopiesAndFolders;
onInitCopiesAndFolders = function() {
  asdf.base_onInitCopiesAndFolders();
  SetFolderDisplay(asdf_gAutoSaveDraftsRadioElemChoice, asdf_gAutoSaveDraftsRadioElemChoiceLocked,
                      "asdfAutoSaveDraft",
                      "asdfAutoSaveDraftsAccountPicker",
                      "identity.asdfAutoSaveDraftFolder",
                      "asdfAutoSaveDraftsFolderPicker");
} // var asdf

// override SetGlobalRadioElemChoices method
asdf.base_SetGlobalRadioElemChoices = SetGlobalRadioElemChoices;
SetGlobalRadioElemChoices = function() {
  asdf.base_SetGlobalRadioElemChoices();
  var pickerModeElement = document.getElementById("identity.asdfAutoSaveDraftsFolderPickerMode");
  asdf_gAutoSaveDraftsRadioElemChoice = pickerModeElement.getAttribute("value");
  asdf_gAutoSaveDraftsRadioElemChoiceLocked = pickerModeElement.getAttribute("disabled");
  if (!asdf_gAutoSaveDraftsRadioElemChoice) 
    asdf_gAutoSaveDraftsRadioElemChoice = gDefaultPickerMode;
}

// override onSaveCopiesAndFolders method
asdf.base_onSaveCopiesAndFolders = onSaveCopiesAndFolders;
onSaveCopiesAndFolders = function() {
  asdf.base_onSaveCopiesAndFolders();
  SaveFolderSettings( asdf_gAutoSaveDraftsRadioElemChoice,
                        "asdfAutoSaveDrafts",
                        gDraftsFolderWithDelim,
                        "asdfAutoSaveDraftsAccountPicker",
                        "asdfAutoSaveDraftsFolderPicker",
                        "identity.asdfAutoSaveDraftFolder",
                        "identity.asdfAutoSaveDraftsFolderPickerMode" );
}

// listen for initial window load event
window.addEventListener("load", function () { asdf.onLoad(); }, false);
// listen for window unload event
window.addEventListener("unload", function () { asdf.onUnload(); }, false);