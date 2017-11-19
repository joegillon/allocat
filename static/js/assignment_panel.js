/**
 * Created by Joe on 11/17/2017.
 */

/*=====================================================================
Assignment List
=====================================================================*/
var assignmentList = {
  view: "list",
  id: "assignmentList",
  select: true,
  height: 500,
  width: 200,
  template: "#employee#: #effort#",
  click: function(id) {
    assignmentFormCtlr.load(this.getItem(id));
  }
};

/*=====================================================================
Assignment List Controller
=====================================================================*/
var assignmentListCtlr = {
  init: function() {},

  clear: function() {
    $$("assignmentList").clearAll();
    assignmentFormCtlr.clear();
  },

  load: function(prjid) {
    this.clear();
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for('prj.prj_assignments', {prjid: prjid});

    ajaxDao.get(url, function(data) {
      $$("assignmentList").parse(data["assignments"]);
    });
  }

};

/*=====================================================================
Assignment List Toolbar
=====================================================================*/
var assignmentListToolbar = {
  view: "toolbar",
  id: "assignmentListToolbar",
  height: 70,
  rows: [
    {
      cols: [
        {
          view: "label",
          label: "Assignments"
        },
        {
          view: "button",
          id: "addButton",
          value: "Add",
          click: function() {
            assignmentListToolbarCtlr.add();
          }
        }
      ]
    },
    {
      view: "text",
      label: 'Filter',
      width: 200,
      on: {
        onTimedKeyPress: function() {
          assignmentListToolbarCtlr.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

/*=====================================================================
Assignment List Toolbar Controller
=====================================================================*/
var assignmentListToolbarCtlr = {
  init: function() {},

  add: function() {
    webix.message('add assignment');
  },

  filter: function(value) {
    $$("assignmentList").filter(function(obj) {
        return obj.employee.toLowerCase().indexOf(value) == 0;
    })
  }
};

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
    assignmentListCtlr.init();
    assignmentListToolbarCtlr.init();
    assignmentFormCtlr.init();
    assignmentFormToolbarCtlr.init();
  },

  clear: function() {
    assignmentListCtlr.clear();
    assignmentFormCtlr.clear();
  }

};
