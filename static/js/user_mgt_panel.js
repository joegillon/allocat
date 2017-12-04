/**
 * Created by Joe on 11/15/2017.
 */

/*=====================================================================
User List
=====================================================================*/
var userList = {
  view: "list",
  id: "userList",
  select: true,
  height: 300,
  width: 200,
  template: "#username#",
  on: {
    onAfterSelect: function() {
      userListCtlr.selected();
    }
  }
};

/*=====================================================================
User List Controller
=====================================================================*/
var userListCtlr = {
  list: null,

  init: function () {
    this.list = $$("userList");
    this.load(users);
  },

  clear: function () {
    this.list.clearAll();
  },

  load: function (data) {
    this.clear();
    this.list.parse(data);
  },

  select: function (id) {
    this.list.select(id);
    this.list.showItem(id);
  },

  selected: function () {
    selectedUser = this.list.getSelectedItem();
    userFormCtlr.load(selectedUser);
  },

  add: function() {
    userFormCtlr.clear();
  }
};

/*=====================================================================
User List Toolbar
=====================================================================*/
var userListToolbar = {
  view: "toolbar",
  id: "userListToolbar",
  height: 35,
  rows: [
    {
      cols: [
        {
          view: "label",
          label: "Users"
        },
        {
          view: "button",
          value: "Add",
          css: "add_button",
          click: function() {
            userListCtlr.add();
          }
        }
      ]
    }
  ]
};

/*=====================================================================
User Form
=====================================================================*/
var userForm = {
  view: "form",
  id: "userForm",
  elements: [
    {view: "text", name: "user_id", hidden: true},
    {
      view: "text",
      label: "Username",
      name: "username",
      width: 300,
      invalidMessage: "Username is required!"
    },
    {
      view: "richselect",
      label: "Role",
      name: "role",
      width: 300,
      options: roles
    },
    {
      view: "text",
      label: "Password",
      name: "password",
      width: 300,
      hidden: false
    },
    {
      view: "text",
      label: "Confirm Password",
      name: "confirm",
      width: 300,
      hidden: false
    },
    {
      view: "button",
      value: "Save",
      type: "form",
      click: function() {
        userFormCtlr.save();
      }
    },
    {
      view: "button",
      value: "Remove",
      type: "danger",
      click: function() {
        userFormCtlr.remove(this.getParentView().getValues().id);
      }
    }
  ],
  rules: {
    "username": webix.rules.isNotEmpty
  }
};

/*=====================================================================
User Form Controller
=====================================================================*/
var userFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("userForm");
  },

  clear: function() {
    this.frm.clear();
  },

  load: function(usr) {
    this.frm.setValues({
      id: usr.user_id,
      username: usr.username,
      password: usr.password,
      confirm: usr.password
    });
    //noinspection JSUnresolvedVariable
    this.frm.getChildViews()[2].setValue(usr.role_id);
  },

  save: function() {
    var values = this.validate();
    if (!values) return;

    var url = "usr.usr_add";

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    url = Flask.url_for(url);

    ajaxDao.post(url, values, function(data) {
      usrListCtlr.load(data["users"]);
      userListCtlr.select(data["usrid"]);
      webix.message("User saved!");
    });

  },

  validate: function() {
    if (!this.frm.validate()) {
      return null;
    }
    var values = this.frm.getValues({hidden: true});

    if (values["password"] != values["confirm"]) {
      webix.alert({type: "alert-error", text: "Passwords don't match!"});
      return null;
    }

    //check that role is selected

    return values;
  },

  remove: function(id) {
    webix.confirm("Are you sure you want to remove this user?", function(result) {
      webix.message(result);
    });

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("usr.usr_drop", {user_id: id});

    ajaxDao.get(url, function(data) {
      selectedUser = null;
      userListCtlr.load(data["users"]);
      userFormCtlr.clear();
      webix.message("User removed!");
    });
  }
};

/*=====================================================================
User Form Toolbar
=====================================================================*/
var userFormToolbar = {
  view: "toolbar",
  id: "userFormToolbar",
  height: 35,
  cols: [
    {view: "label", label: "User Details"}
  ]
};

/*=====================================================================
User Panel
=====================================================================*/
var userPanel = {
  type: "space",
  css: "panel_layout",
  cols: [
    {
      rows: [userListToolbar, userList]
    },
    {
      rows: [userFormToolbar, userForm]
    }
  ]
};

/*=====================================================================
User Panel Controller
=====================================================================*/
var userPanelCtlr = {

  init: function() {
    userListCtlr.init();
    userFormCtlr.init();
  }

};
