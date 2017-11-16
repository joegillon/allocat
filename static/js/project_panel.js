/**
 * Created by Joe on 11/15/2017.
 */

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

  },

  load: function(prj) {
    $$("projectForm").setValues({
      name: prj.name,
      nickname: prj.nickname,
      first_month: prj.start_date,
      last_month: prj.end_date,
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
  rows: [projectFormToolbar, projectForm]
};

/*=====================================================================
Project Panel Controller
=====================================================================*/
var projectPanelCtlr = {
  init: function() {
    var detailFunc = function(prjid) {
      var prj = $$("masterList").getItem(prjid);
      projectFormCtlr.load(prj);
    };

    masterListPanelCtlr.init('Projects', '#nickname#', detailFunc);
    masterListPanelCtlr.load(projects);

    projectFormToolbarCtlr.init();
    projectFormCtlr.init();

  }

};
