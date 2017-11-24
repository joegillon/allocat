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
  template: "#employee#: #effort#",
  click: function(id) {
    projectAssignmentFormCtlr.load(this.getItem(id));
  }
};

/*=====================================================================
Project Assignment List Controller
=====================================================================*/
var projectAssignmentListCtlr = {
  list: null,

  init: function() {
    this.list = $$("projectAssignmentList");
  },

  clear: function() {
    this.list.clearAll();
    projectAssignmentFormCtlr.clear();
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      //noinspection JSUnresolvedVariable
      return obj.employee.toLowerCase().indexOf(value) == 0;
    })
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
    this.clear();
    this.list.parse(assignments);
  },

  select: function (id) {
    this.list.select(id);
    this.list.showItem(id);
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
      label: 'Filter',
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
    "first_month": MonKey.isValidInput,
    "last_month": MonKey.isValidInput,
    "effort": function(value) {
      return value >= 0 && value <= 100;
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
      first_month: MonKey.prettify(asn.first_month),
      last_month: MonKey.prettify(asn.last_month),
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
    if (!this.frm.validate()) {
      return;
    }
    var values = this.frm.getValues({hidden: true});
    values.first_month = MonKey.uglify(values.first_month);
    values.last_month = MonKey.uglify(values.last_month);
    if (!MonKey.isValidSpan(values.first_month, values.last_month)) {
      webix.message({error: "First month must precede last month!"});
      return;
    }

    // Timeframe must be inside project Timeframe

    values["employee_id"] = values["employee"];
    values["project_id"] = selectedProject["id"];

    delete values["employee"];
    delete values["project"];

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("prj.prj_save_assignment");

    ajaxDao.post(url, values, function(data) {
      if (data["numrows"]) {
        webix.message("Assignment updated!");
        return;
      }
      projectAssignmentListCtlr.load(data["assignments"]);
      projectAssignmentListCtlr.select(data["asnid"]);
      webix.message("Assignment added!");
    });

  },

  remove: function(id) {
    var inputs = this.frm.getValues({hidden: true});
    var values = {
      id: inputs["id"],
      project_id: inputs["project_id"]
    }

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("prj.prj_drop_assignment");

    ajaxDao.post(url, values, function(data) {
      projectAssignmentListCtlr.load(data["assignments"]);
      webix.message("Assignment removed!");
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
