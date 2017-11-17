/**
 * Created by Joe on 11/17/2017.
 */

/*=====================================================================
Assignment Form
=====================================================================*/
var assignmentForm = {
  view: "form",
  id: "assignmentForm",
  elements: [
    {view: "text", label: "Employee", name: "employee", width: 300},
    {view: "text", label: "Project", name: "project", width: 300},
    {view: "text", label: "First Month", name: "first_month", width: 300},
    {view: "text", label: "Last Month", name: "last_month", width: 300},
    {view: "text", label: "Effort", name: "effort"},
    {view: "textarea", label: "Notes", name: "notes", width: 300, height: 100},
    {view: "button", value: "Save", type: "form"},
    {view: "button", value: "Remove"}
  ]
};

/*=====================================================================
Assignment Form Controller
=====================================================================*/
var assignmentFormCtlr = {
  init: function() {},

  clear: function() {
    $$("assignmentForm").clear();
  },

  load: function(asn) {
    $$("assignmentForm").setValues({
      employee: asn.employee,
      project: asn.project,
      first_month: asn.first_month,
      last_month: asn.last_month,
      effort: asn.effort,
      notes: asn.notes
    });
  }
};

/*=====================================================================
Assignment Form Toolbar
=====================================================================*/
var assignmentFormToolbar = {
  view: "toolbar",
  id: "assignmentFormToolbar",
  height: 35,
  cols: [
    {view: "label", label: "Assignment Details"}
  ]
};

/*=====================================================================
Assignment Form Toolbar Controller
=====================================================================*/
var assignmentFormToolbarCtlr = {
  init: function() {}
};

/*=====================================================================
Assignment Panel
=====================================================================*/
var assignmentPanel = {
  type: "space",
  cols: [
    {
      rows: [assignmentListToolbar, assignmentList]
    },
    {
      rows: [assignmentFormToolbar, assignmentForm]
    }
  ]
};

/*=====================================================================
Assignment Panel Controller
=====================================================================*/
var assignmentPanelCtlr = {

  init: function() {
    assignmentListPanelCtlr.init();
    assignmentFormCtlr.init();
    assignmentFormToolbarCtlr.init();
  }

};
