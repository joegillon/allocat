/**
 * Created by Joe on 11/15/2017.
 */

var menu_data = [
  {
    id: "login",
    icon: "sign-in",
    value: "Log in"
  },
  {
    id: "projects",
    icon: "",
    value: "Projects"
  },
  {
    id: "employees",
    icon: "",
    value: "Employees"
  },
  {
    id: "effort",
    icon: "",
    value: "Effort"
  },
  {
    id: "usermgt",
    icon: "user",
    value: "User Management",
    submenu: [
      {id: "request", value: "Request Account"},
      {id: "register", value: "Create Account"},
      {id: "change", value: "Change Password"}
    ]
  }
];

var mainMenu = {
  view: "menu",
  id: "mainMenu",
  data: menu_data,
  type: {
    subsign: true,
    height: 50
  },
  on: {
    onMenuItemClick: function(id) {
      if (id == "login") {
        window.location.href = Flask.url_for('security.login');
        return;
      }
      if (id == "register") {
        window.location.href = Flask.url_for('security.register');
        return;
      }
      if (id == "change") {
        window.location.href = Flask.url_for('security.change');
        return;
      }
      if (id == "projects") {
        window.location.href = Flask.url_for('prj.prj_list');
        return;
      }
      if (id == "employees") {
        window.location.href = Flask.url_for('emp.list');
        return;
      }
      if (id == "effort") {
        window.location.href = Flask.url_for("eff.scoreboard");
        return;
      }
      webix.message("Not yet implemented");
    }
  }
};
