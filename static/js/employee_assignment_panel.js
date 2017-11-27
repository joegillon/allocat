/**
 * Created by Joe on 11/23/2017.
 */

/*=====================================================================
Employee Assignment List
=====================================================================*/
var employeeAssignmentList = {
  view: "list",
  id: "employeeAssignmentList",
  select: true,
  height: 500,
  width: 200,
  template: "#project#",
  click: function(id) {
    employeeAssignmentFormCtlr.load(this.getItem(id));
  }
};

/*=====================================================================
Employee Assignment List Controller
=====================================================================*/
var employeeAssignmentListCtlr = {
  list: null,
  filtrStr: "",
  filtrCtl: null,

  init: function() {
    this.list = $$("employeeAssignmentList");
    this.filtrCtl = $$("employeeAssignmentFilter");
  },

  clear: function() {
    this.list.clearAll();
    this.filtrCtl.setValue("");
    employeeAssignmentFormCtlr.clear();
  },

  loadFromDB: function(empid) {
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for('emp.emp_assignments', {empid: empid});
    var me = this;

    ajaxDao.get(url, function(data) {
      me.load(data['assignments']);
    });
  },

  load: function(assignments) {
    this.filtrStr = this.filtrCtl.getValue();
    this.clear();
    this.list.parse(assignments);
    this.filtrCtl.setValue(this.filtrStr);
    this.filter(this.filtrStr);
},

  select: function (id) {
    this.list.select(id);
    this.list.showItem(id);
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      //noinspection JSUnresolvedVariable
      return obj.project.toLowerCase().indexOf(value) == 0;
    })
  }

};

/*=====================================================================
Employee Assignment List Toolbar
=====================================================================*/
var employeeAssignmentListToolbar = {
  view: "toolbar",
  id: "employeeAssignmentListToolbar",
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
            employeeAssignmentFormCtlr.clear();
          }
        }
      ]
    },
    {
      view: "text",
      id: "employeeAssignmentFilter",
      label: 'Filter',
      width: 200,
      on: {
        onTimedKeyPress: function() {
          employeeAssignmentListCtlr.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

/*=====================================================================
Employee Assignment Form Elements
=====================================================================*/
var employeeAssignmentFormElements = [
  {
    view: "text",
    label: "Employee",
    name: "employee",
    width: 300,
    readonly: true,
    invalidMessage: "No employee has been selected!!"
  },
  {
    view: "combo",
    label: "Project",
    name: "project",
    width: 300,
    options: projects,
    invalidMessage: "Project is required!"
  },
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
      employeeAssignmentFormCtlr.save();
    }
  },
  {
    view: "button",
    value: "Remove",
    type: "danger",
    click: function() {
      employeeAssignmentFormCtlr.remove(this.getParentView().getValues().id);
    }
  }
];

/*=====================================================================
Employee Assignment Form
=====================================================================*/
var employeeAssignmentForm = {
  view: "form",
  id: "employeeAssignmentForm",
  elements: employeeAssignmentFormElements,
  rules: {
    "employee": webix.rules.isNotEmpty,
    "project": webix.rules.isNotEmpty,
    "first_month": MonKey.isValidInput,
    "last_month": MonKey.isValidInput,
    "effort": function(value) {
      return employeeAssignmentFormCtlr.isValidEffort(value);
    }
  }
};

/*=====================================================================
Employee Assignment Form Controller
=====================================================================*/
var employeeAssignmentFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("employeeAssignmentForm");
  },

  clear: function() {
    this.frm.clear();
    if (selectedEmployee) {
      this.frm.setValues({employee: selectedEmployee.name});
    }
  },

  load: function(asn) {
    this.frm.setValues({
      employee: selectedEmployee.name,
      first_month: MonKey.prettify(asn.first_month),
      last_month: MonKey.prettify(asn.last_month),
      effort: asn.effort,
      notes: asn.notes,
      id: asn.id,
      project_id: asn.project_id,
      employee_id: selectedEmployee.id
    });
    //noinspection JSUnresolvedVariable
    this.frm.getChildViews()[1].setValue(asn.project_id);
  },

  save: function() {
    var values = this.validate();
    if (!values) return;

    var url = values["id"] ? "emp.emp_update_assignment": "emp.emp_add_assignment";

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    url = Flask.url_for(url);

    ajaxDao.post(url, values, function(data) {
      employeeAssignmentListCtlr.load(data["assignments"]);
      employeeAssignmentListCtlr.select(data["asnid"]);
      webix.message("Assignment saved!");
    });

  },

  isValidEffort: function(value) {
    var x = parseInt(value);
      return x >= 0 && x <= 100;
  },

  validate: function() {
    if (!this.frm.validate()) {
      return null;
    }
    var values = this.frm.getValues({hidden: true});
    values.first_month = MonKey.uglify(values.first_month);
    values.last_month = MonKey.uglify(values.last_month);
    if (!MonKey.isValidSpan(values.first_month, values.last_month)) {
      webix.alert({type: "alert-error", text: "First month must precede last month!"});
      return null;
    }

    if (!projectTimeframes) {
      MonKey.buildProjectTimeframes();
    }

    if (!MonKey.isInProjectTimeframe(projectTimeframes[values.project], values)) {
      webix.alert({type: "alert-error", text: "Assignment time frame outside project time frame!"});
      return null;
    }

    values["project_id"] = values["project"];
    values["employee_id"] = selectedEmployee["id"];

    delete values["employee"];
    delete values["project"];

    return values;
  },

  remove: function(id) {
    var inputs = this.frm.getValues({hidden: true});
    var values = {
      id: inputs["id"],
      employee_id: inputs["employee_id"]
    };

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("emp.emp_drop_assignment");

    ajaxDao.post(url, values, function(data) {
      employeeAssignmentListCtlr.load(data["assignments"]);
      webix.message("Assignment removed!");
    });
  }

};

/*=====================================================================
Employee Assignment Form Toolbar
=====================================================================*/
var employeeAssignmentFormToolbar = {
  view: "toolbar",
  id: "employeeAssignmentFormToolbar",
  height: 35,
  cols: [
    {view: "label", label: "Assignment Details"}
  ]
};

/*=====================================================================
Employee Assignment Panel
=====================================================================*/
var employeeAssignmentPanel = {
  type: "space",
  css: "panel_layout",
  cols: [
    {
      rows: [employeeAssignmentListToolbar, employeeAssignmentList]
    },
    {
      rows: [employeeAssignmentFormToolbar, employeeAssignmentForm]
    }
  ]
};

/*=====================================================================
Employee Assignment Panel Controller
=====================================================================*/
var employeeAssignmentPanelCtlr = {

  init: function() {
    employeeAssignmentListCtlr.init();
    employeeAssignmentFormCtlr.init();
  },

  clear: function() {
    employeeAssignmentListCtlr.clear();
    employeeAssignmentFormCtlr.clear();
  }

};
