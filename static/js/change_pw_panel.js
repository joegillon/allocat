/**
 * Created by Joe on 12/7/2017.
 */

/*=====================================================================
Password Form
=====================================================================*/
var passwordForm = {
  view: "form",
  id: "passwordForm",
  width: 500,
  elements: [
    {
      view: "text",
      name: "new_password",
      label: "New Password",
      labelAlign: "right",
      type: "password",
      width: 500,
      labelWidth: 120,
      invalidMessage: "New Password is required!"
    },
    {
      view: "text",
      name: "confirm",
      label: "Confirm Password",
      labelAlign: "right",
      type: "password",
      width: 500,
      labelWidth: 120,
      invalidMessage: "Confirm Password is required!"
    },
    {
      view: "button",
      value: "Save",
      type: "form",
      click: function() {
        passwordFormCtlr.save();
      }
    }
  ],
  rules: {
    "new_password": webix.rules.isNotEmpty,
    "confirm": webix.rules.isNotEmpty
  }
};

/*=====================================================================
Password Form Controller
=====================================================================*/
var passwordFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("passwordForm");
  },

  save: function() {
    if (!this.frm.validate())
      return;

    var values = this.frm.getValues();

    if (values["new_password"] != values["confirm"]) {
      webix.alert({type: "alert-error", text: "Passwords don't match!"});
      return;
    }

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("usr.change_password");
    ajaxDao.post(url, values, function(response) {
      if (response.error) {
        webix.message({type: "error", text: response.error})
      }
      else
        webix.message(response.msg);
    })
  }
};

/*=====================================================================
Password Panel
=====================================================================*/
var passwordPanel = {
  type: "space",
  css: "panel_layout",
  rows: [passwordForm]
};

/*=====================================================================
Password Panel Controller
=====================================================================*/
var passwordPanelCtlr = {
  init: function() {
    passwordFormCtlr.init();
  }
};