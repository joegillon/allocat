/**
 * Created by Joe on 11/23/2017.
 */

/*=====================================================================
Employee Assignment List (Read Only)
=====================================================================*/
var employeeAssignmentListRO = {
  view: "list",
  id: "employeeAssignmentListRO",
  select: true,
  height: 500,
  width: 200,
  template: "#project#",
  click: function(id) {
    employeeAssignmentFormCtlrRO.load(this.getItem(id));
  }
};

/*=====================================================================
Employee Assignment List Controller (Read Only)
=====================================================================*/
var employeeAssignmentListCtlrRO = {
  list: null,
  filtrStr: "",
  filtrCtl: null,

  init: function() {
    this.list = $$("employeeAssignmentListRO");
    this.filtrCtl = $$("employeeAssignmentFilterRO");
  },

  clear: function() {
    this.list.clearAll();
    this.filtrCtl.setValue("");
    employeeAssignmentFormCtlrRO.clear();
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
Employee Assignment List Toolbar (Read Only)
=====================================================================*/
var employeeAssignmentListToolbarRO = {
  view: "toolbar",
  id: "employeeAssignmentListToolbarRO",
  height: 70,
  rows: [
    {
      cols: [
        {
          view: "label",
          label: "Assignments"
        }
      ]
    },
    {
      view: "text",
      id: "employeeAssignmentFilterRO",
      label: 'Filter',
      labelAlign: "right",
      width: 200,
      on: {
        onTimedKeyPress: function() {
          employeeAssignmentListCtlrRO.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

/*=====================================================================
Employee Assignment Form Elements (Read Only)
=====================================================================*/
var employeeAssignmentFormElementsRO = [
  {
    view: "text",
    label: "Employee",
    labelAlign: "right",
    name: "employee",
    width: 300,
    readonly: true
  },
  {
    view: "text",
    label: "Project",
    labelAlign: "right",
    name: "project",
    width: 300,
    readonly: true
  },
  {
    view: "text",
    label: "First Month",
    labelAlign: "right",
    name: "first_month",
    width: 300,
    readonly: true
  },
  {
    view: "text",
    label: "Last Month",
    labelAlign: "right",
    name: "last_month",
    width: 300,
    readonly: true
  },
  {
    view: "text",
    label: "Effort",
    labelAlign: "right",
    name: "effort",
    readonly: true
  },
  {
    view: "textarea",
    label: "Notes",
    labelAlign: "right",
    name: "notes",
    width: 300,
    height: 100,
    readonly: true
  },
  {view: "text", name: "id", hidden: true},
  {view: "text", name: "employee_id", hidden: true},
  {view: "text", name: "project_id", hidden: true}
];

/*=====================================================================
Employee Assignment Form (Read Only)
=====================================================================*/
var employeeAssignmentFormRO = {
  view: "form",
  id: "employeeAssignmentFormRO",
  elements: employeeAssignmentFormElementsRO
};

/*=====================================================================
Employee Assignment Form Controller (Read Only)
=====================================================================*/
var employeeAssignmentFormCtlrRO = {
  frm: null,

  init: function() {
    this.frm = $$("employeeAssignmentFormRO");
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
      project: asn.project,
      first_month: MonthLib.prettify(asn.first_month),
      last_month: MonthLib.prettify(asn.last_month),
      effort: asn.effort,
      notes: asn.notes,
      id: asn.id,
      project_id: asn.project_id,
      employee_id: selectedEmployee.id
    });
  }
};

/*=====================================================================
Employee Assignment Form Toolbar (Read Only)
=====================================================================*/
var employeeAssignmentFormToolbarRO = {
  view: "toolbar",
  id: "employeeAssignmentFormToolbarRO",
  height: 35,
  cols: [
    {view: "label", label: "Assignment Details"}
  ]
};

/*=====================================================================
Employee Assignment Panel (Read Only)
=====================================================================*/
var employeeAssignmentPanelRO = {
  type: "space",
  css: "panel_layout",
  cols: [
    {
      rows: [employeeAssignmentListToolbarRO, employeeAssignmentListRO]
    },
    {
      rows: [employeeAssignmentFormToolbarRO, employeeAssignmentFormRO]
    }
  ]
};

/*=====================================================================
Employee Assignment Panel Controller (Read Only)
=====================================================================*/
var employeeAssignmentPanelCtlrRO = {

  init: function() {
    employeeAssignmentListCtlrRO.init();
    employeeAssignmentFormCtlrRO.init();
  },

  clear: function() {
    employeeAssignmentListCtlrRO.clear();
    employeeAssignmentFormCtlrRO.clear();
  }

};
