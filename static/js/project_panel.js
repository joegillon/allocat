/**
 * Created by Joe on 11/15/2017.
 */

/*=====================================================================
Project List
=====================================================================*/
var projectList = {
  view: "list",
  id: "projectList",
  select: true,
  height: 500,
  width: 200,
  template: "#nickname#",
  click: function(id) {
    projectFormCtlr.load(this.getItem(id));
    assignmentListCtlr.load(id);
  }
};

/*=====================================================================
Project List Controller
=====================================================================*/
var projectListCtlr = {
  init: function() {
    this.load(projects);
  },

  clear: function() {
    $$("projectList").clearAll();
  },

  load: function(data) {
    this.clear();
    $$("projectList").parse(data);
  }

};

/*=====================================================================
Project List Toolbar
=====================================================================*/
var projectListToolbar = {
  view: "toolbar",
  id: "projectListToolbar",
  height: 70,
  rows: [
    {
      cols: [
        {
          view: "label",
          label: "Projects"
        },
        {
          view: "button",
          //id: "addButton",
          value: "Add",
          click: function() {
            projectListToolbarCtlr.add();
          }
        }
      ]
    },
    {
      view: "text",
      id: "fltr",
      label: 'Filter',
      width: 200,
      on: {
        onTimedKeyPress: function() {
          webix.message('boo');
          projectListToolbarCtlr.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

/*=====================================================================
Project List Toolbar Controller
=====================================================================*/
var projectListToolbarCtlr = {
  init: function() {},

  add: function() {
    projectFormCtlr.clear();
  },

  filter: function(value) {
    $$("projectList").filter(function(obj) {
        return obj.nickname.toLowerCase().indexOf(value) == 0;
    })
  }
};

/*=====================================================================
Project Form
=====================================================================*/
var projectForm = {
  view: "form",
  id: "projectForm",
  elements: [
    {view: "textarea", label: "Name", name: "name", width: 300, height: 100},
    {view: "text", label: "Nickname", name: "nickname", width: 300},
    {view: "text", label: "First Month", name: "first_month", width: 300},
    {view: "text", label: "Last Month", name: "last_month", width: 300},
    {view: "textarea", label: "Notes", name: "notes", width: 300, height: 100},
    {view: "button", value: "Save", type: "form"},
    {view: "button", value: "Remove"}
  ]
};

/*=====================================================================
Project Form Controller
=====================================================================*/
var projectFormCtlr = {
  init: function() {},

  clear: function() {
    $$("projectForm").clear();
  },

  load: function(prj) {
    $$("projectForm").setValues({
      name: prj.name,
      nickname: prj.nickname,
      first_month: prj.first_month,
      last_month: prj.last_month,
      notes: prj.notes
    });
  }
};

/*=====================================================================
Project Form Toolbar
=====================================================================*/
var projectFormToolbar = {
  view: "toolbar",
  id: "projectFormToolbar",
  height: 35,
  cols: [
    {view: "label", label: "Project Details"}
  ]
};

/*=====================================================================
Project Form Toolbar Controller
=====================================================================*/
var projectFormToolbarCtlr = {
  init: function() {}
};

/*=====================================================================
Project Panel
=====================================================================*/
var projectPanel = {
  type: "space",
  cols: [
    {
      rows: [projectListToolbar, projectList]
    },
    {
      rows: [projectFormToolbar, projectForm]
    }
  ]
};

/*=====================================================================
Project Panel Controller
=====================================================================*/
var projectPanelCtlr = {

  init: function() {
    projectListCtlr.init();
    projectListToolbarCtlr.init();
    projectFormCtlr.init();
    projectFormToolbarCtlr.init();
  }

};
