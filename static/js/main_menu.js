/**
 * Created by Joe on 11/15/2017.
 */

var skins = [
  "Aircompact", "Antique", "Brownie", "Clouds", "Compact", "Dusty",
  "Eggplant", "Flamingo", "Flat", "Forest", "Light", "Mauve", "Metro", "Monkey",
  "Pinko", "QED", "Saints", "Sandy", "Tan", "Tangerine"
];

var menu_data = [
  {
    id: "login",
    icon: "sign-in",
    value: "Log in"
  },
  {
    id: "projects",
    icon: "newspaper-o",
    value: "Projects"
  },
  {
    id: "employees",
    icon: "group",
    value: "Employees"
  },
  {
    id: "effort",
    icon: "pie-chart",
    value: "Effort"
  },
  {
    id: "usermgt",
    icon: "user-secret",
    value: "Users",
    submenu: [
      {id: "change", value: "Change Password"},
      {id: "usermgt", value: "Manage Users"}
    ]
  },
  {
    id: "backup",
    icon: "save",
    value: "Backup"
  },
  {
    id: "skins",
    icon: "",
    value: "Skins...",
    submenu: skins
  },
  {
    id: "logout",
    icon: "sign-out",
    value: "Log off"
  }
];

var mainMenu = {
  view: "menu",
  id: "mainMenu",
  data: menu_data,
  type: {
    subsign: true,
    height: 40
  },
  on: {
    onMenuItemClick: function(id) {
      if (id == "login") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('usr.login');
        return;
      }
      if (id == "usermgt") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('usr.user_mgt');
        return;
      }
      if (id == "change") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('usr.change_password');
        return;
      }
      if (id == "projects") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('prj.prj_list');
        return;
      }
      if (id == "employees") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('emp.emp_list');
        return;
      }
      if (id == "effort") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("eff.eff_page");
        return;
      }
      if (id == "logout") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('usr.logoff');
        return;
      }
      if (id == "backup") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('backup');
        return;
      }
      if (skins.indexOf(id) != -1) {
        switch_skin(id);
        return false;
      }
      webix.message("Not yet implemented");
    }
  }
};
