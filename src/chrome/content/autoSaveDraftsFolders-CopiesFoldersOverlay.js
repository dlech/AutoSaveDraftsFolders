var autoSaveDraftsFolders_gAutoSaveDraftsRadioElemChoice;
var autoSaveDraftsFolders_gAutoSaveDraftsRadioElemChoiceLocked;

var autoSaveDraftsFolders = {
  onLoad: function () {
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("autoSaveDraftsFolders-strings");
    // add support for preferences
    this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefService)
        .getBranch("extensions.autoSaveDraftsFolders.");
    this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch);
	  this.prefs.addObserver("", this, false);
  },

  onUnload: function () {
    // cleanup preferences
    this.prefs.removeObserver("", this);
  },

  observe: function (subject, topic, data) {
    if (topic != "nsPref:changed") {
      return; // only need to act on pref change
    }
    // process change	
    switch (data) {
      //case "showDeleteButton":  
         //this.updateJunkSpamButtons();
         //break;  
    }
  },

  // Set radio element choices and picker states
  setPickersState: function (enablePickerId, disablePickerId, event) {
    SetPickerEnabling(enablePickerId, disablePickerId);

    var radioElemValue = event.target.value;

    switch (event.target.id) {
    case "autoSaveDraftsFolders_selectAccount":
    case "autoSaveDraftsFolders_selectFolder":
      autoSaveDraftsFolders_gAutoSaveDraftsRadioElemChoice = radioElemValue;
      break;
    default:
      dump("Error in setting picker state.\n");
      return;
    }
  },

  noteSelectionChange: function (type, event) {
    var checkedElem =
      document.getElementById("autoSaveDraftsFolders_select" + type);
    var folder = event.target._folder;
    var modeValue = checkedElem.value;
    var radioGroup = checkedElem.radioGroup.getAttribute("id");
    var picker;
    autoSaveDraftsFolders_gAutoSaveDraftsRadioElemChoice = modeValue;
    autoSaveDraftsFolders_gAutoSaveDraftsRadioElemChoice = modeValue;
    picker = document.getElementById("autoSaveDraftsFolders_AutoSaveDrafts" + type + "Picker");
    picker.folder = folder;
    picker.setAttribute("label", folder.prettyName);
  }
};

// override onInitCopiesAndFolders method
autoSaveDraftsFolders.base_onInitCopiesAndFolders = onInitCopiesAndFolders;
onInitCopiesAndFolders = function () {
  autoSaveDraftsFolders.base_onInitCopiesAndFolders();
  SetFolderDisplay(
    autoSaveDraftsFolders_gAutoSaveDraftsRadioElemChoice,
    autoSaveDraftsFolders_gAutoSaveDraftsRadioElemChoiceLocked,
    "autoSaveDraftsFolders",
    "autoSaveDraftsFolders_AutoSaveDraftsAccountPicker",
    "identity.autoSaveDraftsFolders_AutoSaveDraftFolder",
    "autoSaveDraftsFolders_AutoSaveDraftsFolderPicker"
  );
}; // var autoSaveDraftsFolders

// override SetGlobalRadioElemChoices method
autoSaveDraftsFolders.base_SetGlobalRadioElemChoices =
  SetGlobalRadioElemChoices;
SetGlobalRadioElemChoices = function () {
  autoSaveDraftsFolders.base_SetGlobalRadioElemChoices();
  var pickerModeElement =
    document.getElementById("identity.autoSaveDraftsFolders_AutoSaveDraftsFolderPickerMode");
  autoSaveDraftsFolders_gAutoSaveDraftsRadioElemChoice =
    pickerModeElement.getAttribute("value");
  autoSaveDraftsFolders_gAutoSaveDraftsRadioElemChoiceLocked =
    pickerModeElement.getAttribute("disabled");
  if (!autoSaveDraftsFolders_gAutoSaveDraftsRadioElemChoice) {
    autoSaveDraftsFolders_gAutoSaveDraftsRadioElemChoice = gDefaultPickerMode;
  }
};

// override onSaveCopiesAndFolders method
autoSaveDraftsFolders.base_onSaveCopiesAndFolders = onSaveCopiesAndFolders;
onSaveCopiesAndFolders = function () {
  autoSaveDraftsFolders.base_onSaveCopiesAndFolders();
  SaveFolderSettings(
    autoSaveDraftsFolders_gAutoSaveDraftsRadioElemChoice,
    "autoSaveDraftsFolders_radioGroup",
    gDraftsFolderWithDelim,
    "autoSaveDraftsFolders_AutoSaveDraftsAccountPicker",
    "autoSaveDraftsFolders_AutoSaveDraftsFolderPicker",
    "identity.autoSaveDraftsFolders_AutoSaveDraftFolder",
    "identity.autoSaveDraftsFolders_AutoSaveDraftsFolderPickerMode"
  );
};

// listen for initial window load event
window.addEventListener(
  "load",
  function () { autoSaveDraftsFolders.onLoad(); },
  false
);
// listen for window unload event
window.addEventListener(
  "unload",
  function () { autoSaveDraftsFolders.onUnload(); },
  false
);