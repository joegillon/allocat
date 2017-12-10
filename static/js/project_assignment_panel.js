/**
 * Created by Joe on 11/23/2017.
 */

/*=====================================================================
Project Assignment List
=====================================================================*/
var projectAssignmentList = {
  view: "list",
  id: "projectAssignmentList",
  select: true,
  height: 500,
  width: 200,
  template: "#employee#",
  click: function(id) {
    projectAssignmentFormCtlr.load(this.getItem(id));
  }
};

/*=====================================================================
Project Assignment List Controller
=====================================================================*/
var projectAssignmentListCtlr = {
  list: null,
  filtrStr: "",
  filtrCtl: null,

  init: function() {
    this.list = $$("projectAssignmentList");
    this.filtrCtl = $$("projectAssignmentFilter");
  },

  clear: function() {
    this.list.clearAll();
    this.filtrCtl.setValue("");
    projectAssignmentFormCtlr.clear();
  },

  loadFromDB: function(prjid) {
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for('prj.prj_assignments', {prjid: prjid});
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
      return obj.employee.toLowerCase().indexOf(value) == 0;
    })
  }

};

/*=====================================================================
Project Assignment List Toolbar
=====================================================================*/
var projectAssignmentListToolbar = {
  view: "toolbar",
  id: "projectAssignmentListToolbar",
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
            projectAssignmentFormCtlr.clear();
          }
        }
      ]
    },
    {
      view: "text",
      id: "projectAssignmentFilter",
      label: 'Filter',
      labelAlign: "right",
      width: 200,
      on: {
        onTimedKeyPress: function() {
          projectAssignmentListCtlr.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

/*=====================================================================
Project Assignment Form Elements
=====================================================================*/
var projectAssignmentFormElements = [
  {
    view: "combo",
    label: "Employee",
    labelAlign: "right",
    name: "employee",
    width: 300,
    options: employees,
    invalidMessage: "Employee is required!"
  },
  {
    view: "text",
    label: "Project",
    labelAlign: "right",
    name: "project",
    width: 300,
    readonly: true,
    invalidMessage: "No project has been selected!"
  },
  {
    view: "text",
    label: "First Month",
    labelAlign: "right",
    name: "first_month",
    placeholder: "MM/YY",
    width: 300,
    invalidMessage: "Month format is numeric MM/YY!"
  },
  {
    view: "text",
    label: "Last Month",
    labelAlign: "right",
    name: "last_month",
    placeholder: "MM/YY",
    width: 300,
    invalidMessage: "Month format is numeric MM/YY!"
  },
  {
    view: "text",
    label: "Effort",
    labelAlign: "right",
    name: "effort",
    invalidMessage: "Percent Effort must be 0-100!"
  },
  {
    view: "textarea",
    label: "Notes",
    labelAlign: "right",
    name: "notes",
    width: 300,
    height: 100
  },
  {view: "text", name: "id", hidden: true},
  {view: "text", name: "employee_id", hidden: true},
  {view: "text", name: "project_id", hidden: true},
  {
    view: "button",
    value: "Save",
    type: "form",
    click: function() {
      projectAssignmentFormCtlr.save();
    }
  },
  {
    view: "button",
    value: "Remove",
    type: "danger",
    click: function() {
      projectAssignmentFormCtlr.remove(this.getParentView().getValues().id);
    }
  }
];

/*=====================================================================
Project Assignment Form
=====================================================================*/
var projectAssignmentForm = {
  view: "form",
  id: "projectAssignmentForm",
  elements: projectAssignmentFormElements,
  rules: {
    "project": webix.rules.isNotEmpty,
    "employee": webix.rules.isNotEmpty,
    "first_month": MonthLib.isValidInput,
    "last_month": MonthLib.isValidInput,
    "effort": function(value) {
      return projectAssignmentFormCtlr.isValidEffort(value);
    }
  }
};

/*=====================================================================
Project Assignment Form Controller
=====================================================================*/
var projectAssignmentFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("projectAssignmentForm");
  },

  clear: function() {
    this.frm.clear();
    if (selectedProject) {
      this.frm.setValues({project: selectedProject.nickname});
    }
  },

  load: function(asn) {
    this.frm.setValues({
      project: selectedProject.nickname,
      first_month: MonthLib.prettify(asn.first_month),
      last_month: MonthLib.prettify(asn.last_month),
      effort: asn.effort,
      notes: asn.notes,
      id: asn.id,
      employee_id: asn.employee_id,
      project_id: selectedProject.id
    });
    //noinspection JSUnresolvedVariable
    this.frm.getChildViews()[0].setValue(asn.employee_id);
  },

  save: function() {
    var values = this.validate();
    if (!values) return;

    var url = values["id"] ? "prj.prj_update_assignment": "prj.prj_add_assignment";

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for(url);

    ajaxDao.post(url, values, function(data) {
      projectAssignmentListCtlr.load(data["assignments"]);
      projectAssignmentListCtlr.select(data["asnid"]);
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
    values.first_month = MonthLib.uglify(values.first_month);
    values.last_month = MonthLib.uglify(values.last_month);
    if (!MonthLib.isValidSpan(values.first_month, values.last_month)) {
      webix.alert({type: "alert-error", text: "First month must precede last month!"});
      return null;
    }

    if (!MonthLib.isInProjectTimeframe(selectedProject, values)) {
      webix.alert({type: "alert-error", text: "Assignment time frame outside project time frame!"});
      return null;
    }

    values["employee_id"] = values["employee"];
    values["project_id"] = selectedProject["id"];

    delete values["employee"];
    delete values["project"];

    return values;
  },

  remove: function(id) {
    webix.confirm("Are you sure you want to remove this assignment?", "confirm-warning", function(yes) {
      if (yes) {
        var inputs = this.frm.getValues({hidden: true});
        var values = {
          id: inputs["id"],
          project_id: inputs["project_id"]
        };

        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        var url = Flask.url_for("prj.prj_drop_assignment");

        ajaxDao.post(url, values, function(data) {
          projectAssignmentListCtlr.load(data["assignments"]);
          webix.message("Assignment removed!");
        });
      }
    });
  }

};

/*=====================================================================
Project Assignment Form Toolbar
=====================================================================*/
var projectAssignmentFormToolbar = {
  view: "toolbar",
  id: "projectAssignmentFormToolbar",
  height: 35,
  cols: [
    {view: "label", label: "Assignment Details"}
  ]
};

/*=====================================================================
Project Assignment Panel
=====================================================================*/
var projectAssignmentPanel = {
  type: "space",
  css: "panel_layout",
  cols: [
    {
      rows: [projectAssignmentListToolbar, projectAssignmentList]
    },
    {
      rows: [projectAssignmentFormToolbar, projectAssignmentForm]
    }
  ]
};

/*=====================================================================
Project Assignment Panel Controller
=====================================================================*/
var projectAssignmentPanelCtlr = {

  init: function() {
    projectAssignmentListCtlr.init();
    projectAssignmentFormCtlr.init();
  },

  clear: function() {
    projectAssignmentListCtlr.clear();
    projectAssignmentFormCtlr.clear();
  }

};
