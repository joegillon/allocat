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
    projectListToolbarCtlr.clearFilter();
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
          value: "Add",
          click: function() {
            projectListToolbarCtlr.add();
          }
        }
      ]
    },
    {
      view: "text",
      id: "projectFilter",
      label: 'Filter',
      width: 200,
      on: {
        onTimedKeyPress: function() {
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
    assignmentPanelCtlr.clear();
  },

  filter: function(value) {
    $$("projectList").filter(function(obj) {
        return obj.nickname.toLowerCase().indexOf(value) == 0;
    })
  },

  clearFilter: function() {
    $$("projectFilter").setValue("");
  }
};

/*=====================================================================
Project Form
=====================================================================*/
var projectForm = {
  view: "form",
  id: "projectForm",
  elements: [
    {view: "text", name: "id", hidden: true},
    {view: "textarea", label: "Name", name: "name", width: 300, height: 100},
    {view: "text", label: "Nickname", name: "nickname", width: 300},
    {view: "text", label: "First Month", name: "first_month", width: 300},
    {view: "text", label: "Last Month", name: "last_month", width: 300},
    {view: "textarea", label: "Notes", name: "notes", width: 300, height: 100},
    {
      view: "button",
      value: "Save",
      type: "form",
      click: function() {
        projectFormCtlr.save();
      }
    },
    {
      view: "button",
      value: "Remove",
      type: "danger",
      click: function() {
        projectFormCtlr.remove(this.getParentView().getValues().id);
      }
    }
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
      id: prj.id,
      name: prj.name,
      nickname: prj.nickname,
      first_month: prj.first_month,
      last_month: prj.last_month,
      notes: prj.notes
    });
  },

  save: function() {
    var frm = $$("projectForm");
    if (!frm.validate()) {
      return;
    }
    var values = frm.getValues({hidden: true});

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("prj.prj_save");

    ajaxDao.post(url, values, function(data) {
      projectListCtlr.load(data["projects"]);
      webix.message("Record saved!");
    });

  },

  remove: function(id) {
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("prj.prj_drop", {prjid: id});

    ajaxDao.get(url, function(data) {
      projectListCtlr.load(data["projects"]);
      webix.message("Record removed!");
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
