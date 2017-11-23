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
  },

  loadAssignments: function(assignments) {
    this.clear();
    $$("assignmentList").parse(assignments);
  },

  select: function (id) {
    $$("assignmentList").select(id);
    $$("assignmentList").showItem(id);
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
    assignmentFormCtlr.clear();
  },

  filter: function(value) {
    $$("assignmentList").filter(function(obj) {
      //noinspection JSUnresolvedVariable
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
    placeholder: "MM/YY",
    width: 300,
    invalidMessage: "Month format is numeric MM/YY!"
  },
  {
    view: "text",
    label: "Last Month",
    name: "last_month",
    placeholder: "MM/YY",
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
  {view: "text", name: "id", hidden: true},
  {view: "text", name: "employee_id", hidden: true},
  {view: "text", name: "project_id", hidden: true},
  {
    view: "button",
    value: "Save",
    type: "form",
    click: function() {
      assignmentFormCtlr.save();
    }
  },
  {
    view: "button",
    value: "Remove",
    type: "danger",
    click: function() {
      assignmentFormCtlr.remove(this.getParentView().getValues().id);
    }
  }
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
    if (selectedProject) {
      $$("assignmentForm").setValues({project: selectedProject.nickname});
    }
  },

  load: function(asn) {
    $$("assignmentForm").setValues({
      project: selectedProject.nickname,
      first_month: MonKey.prettify(asn.first_month),
      last_month: MonKey.prettify(asn.last_month),
      effort: asn.effort,
      notes: asn.notes,
      id: asn.id,
      employee_id: asn.employee_id,
      project_id: asn.project_id
    });
    //noinspection JSUnresolvedVariable
    $$("assignmentForm").getChildViews()[0].setValue(asn.empid);
  },

  save: function() {
    var frm = $$("assignmentForm");
    if (!frm.validate()) {
      return;
    }
    var values = frm.getValues({hidden: true});
    values.first_month = MonKey.uglify(values.first_month);
    values.last_month = MonKey.uglify(values.last_month);
    if (!MonKey.isValidSpan(values.first_month, values.last_month)) {
      webix.message({error: "First month must precede last month!"});
      return;
    }

    // Timeframe must be inside project Timeframe

    var route = "";
    if (selectedProject) {
      route = "prj.prj_";
      values["employee_id"] = values["employee"];
      values["project_id"] = selectedProject["id"];
    } else {
      route = "emp.emp_";
      values["employee_id"] = selectedEmployee["id"];
      values["project_id"] = values["project"];
    }

    delete values["employee"];
    delete values["project"];

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for(route + "save_assignment");

    ajaxDao.post(url, values, function(data) {
      if (data["numrows"]) {
        webix.message("Assignment updated!");
        return;
      }
      assignmentListCtlr.load(data["assignments"]);
      assignmentListCtlr.select(data["asnid"]);
      webix.message("Assignment added!");
    });

  },

  remove: function(id) {
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for(route + "drop_assignment");

    ajaxDao.post(url, values, function(data) {
      assignmentListCtlr.load(data["assignments"]);
      webix.message("Assignment removed!");
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
  css: "panel_layout",
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
