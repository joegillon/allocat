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

  loadForProject: function(prjid) {
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
Project Assignment Form Elements
=====================================================================*/
var projectAssignmentFormElements = [
  {
    view: "combo",
    label: "Employee",
    name: "employee",
    width: 300,
    options: employees
  },
  {
    view: "text",
    label: "Project",
    name: "project",
    width: 300,
    readonly: true
  }
];

/*=====================================================================
Employee Assignment Form Elements
=====================================================================*/
var employeeAssignmentFormElements = [
  {
    view: "text",
    label: "Employee",
    name: "employee",
    width: 300,
    readonly: true
  },
  {
    view: "combo",
    label: "Project",
    name: "project",
    width: 300,
    options: projects
  }
];

/*=====================================================================
Assignment Form Elements
=====================================================================*/
var assignmentFormElements = [
    {
      view: "text",
      label: "First Month",
      name: "first_month",
      width: 300,
      invalidMessage: "Month format is numeric MM/YY!"
    },
    {
      view: "text",
      label: "Last Month",
      name: "last_month",
      width: 300,
      invalidMessage: "Month format is numeric MM/YY!"
    },
    {
      view: "text",
      label: "Effort",
      name: "effort",
      invalidMessage: "Percent Effort must be 0-100!"
    },
    {view: "textarea", label: "Notes", name: "notes", width: 300, height: 100},
    {view: "button", value: "Save", type: "form"},
    {view: "button", value: "Remove"}
];

/*=====================================================================
Assignment Form
=====================================================================*/
var assignmentForm = {
  view: "form",
  id: "assignmentForm",
  elements: assignmentFormElements,
  rules: {
    "first_month": MonKey.isValidInput,
    "last_month": MonKey.isValidInput,
    "effort": function(value) {
      return value >= 0 && value <= 100;
    }
  }
};

/*=====================================================================
Assignment Form Controller
=====================================================================*/
var assignmentFormCtlr = {
  initForProject: function() {
    for (var i=0; i<projectAssignmentFormElements.length; i++) {
      $$("assignmentForm").addView(projectAssignmentFormElements[i], i);
    }
    $$("assignmentForm").refresh();
  },

  initForEmployee: function() {
    for (var i=0; i<employeeAssignmentFormElements.length; i++) {
      $$("assignmentForm").addView(employeeAssignmentFormElements[i], i);
    }
    $$("assignmentForm").refresh();
  },

  clear: function() {
    $$("assignmentForm").clear();
  },

  load: function(asn) {
    $$("assignmentForm").setValues({
      project: selectedProject.nickname,
      first_month: MonKey.prettify(asn.first_month),
      last_month: MonKey.prettify(asn.last_month),
      effort: asn.effort,
      notes: asn.notes
    });
    $$("assignmentForm").getChildViews()[0].setValue(asn.empid);
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

  initForProject: function() {
    this.init();
    assignmentListCtlr.load = assignmentListCtlr.loadForProject;
    assignmentFormCtlr.initForProject();
  },

  initForEmployee: function() {
    this.init();
    assignmentFormCtlr.initForEmployee();
  },

  init: function() {
    assignmentListCtlr.init();
    assignmentListToolbarCtlr.init();
    assignmentFormToolbarCtlr.init();
  },

  clear: function() {
    assignmentListCtlr.clear();
    assignmentFormCtlr.clear();
  }

};
