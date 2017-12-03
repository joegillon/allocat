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
    value: "User Management",
    submenu: [
      {id: "register", value: "Create Account"},
      {id: "change", value: "Change Password"}
    ]
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
  //css: "menu_bar",
  type: {
    subsign: true,
    height: 40
  },
  on: {
    onMenuItemClick: function(id) {
      if (id == "login") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('security.login');
        return;
      }
      if (id == "register") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('security.register');
        return;
      }
      if (id == "change") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('security.change_password');
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
        window.location.href = Flask.url_for('security.logout');
        return;
      }
      webix.message("Not yet implemented");
    }
  }
};
