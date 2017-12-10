/**
 * Created by Joe on 11/15/2017.
 */

/*=====================================================================
Backup Form
=====================================================================*/
var backupForm = {
  view: "form",
  id: "backupForm",
  width: 400,
  elements: [
    {
      view: "text",
      label: "Destination",
      name: "destination",
      width: 400,
      invalidMessage: "Destination is required!"
    },
    {
      view: "button",
      value: "Save",
      type: "form",
      click: function() {
        backupFormCtlr.save();
      }
    }
  ],
  rules: {
    "destination": webix.rules.isNotEmpty
  }
};

/*=====================================================================
Backup Form Controller
=====================================================================*/
var backupFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("backupForm");
    this.frm.setValues({
      destination: default_backup_path
    });
  },

  clear: function() {
    this.frm.clear();
  },

  save: function() {
    if (!this.frm.validate()) {
      return;
    }

    var dest = this.frm.getValues().destination;

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("backup");

    ajaxDao.post(url, {"destination": dest}, function(data) {
      var result = data.result;
      if (result == "1 file(s) copied.")
        webix.message(result);
      else
        webix.message({type: "error", text: result});
    });
  }

};

/*=====================================================================
Backup Form Toolbar
=====================================================================*/
var backupFormToolbar = {
  view: "toolbar",
  id: "backupFormToolbar",
  height: 35,
  rows: [
    {view: "label", label: "Backup DB"}
  ]
};

/*=====================================================================
Backup Panel
=====================================================================*/
var backupPanel = {
  type: "space",
  css: "panel_layout",
  cols: [
    {
      rows: [backupFormToolbar, backupForm]
    }
  ]
};

/*=====================================================================
Backup Panel Controller
=====================================================================*/
var backupPanelCtlr = {

  init: function() {
    backupFormCtlr.init();
  }

};
