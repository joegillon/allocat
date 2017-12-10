/**
 * Created by Joe on 11/23/2017.
 */

/*=====================================================================
Project Assignment List (Read Only)
=====================================================================*/
var projectAssignmentListRO = {
  view: "list",
  id: "projectAssignmentListRO",
  select: true,
  height: 500,
  width: 200,
  template: "#employee#",
  click: function(id) {
    projectAssignmentFormCtlrRO.load(this.getItem(id));
  }
};

/*=====================================================================
Project Assignment List Controller (Read Only)
=====================================================================*/
var projectAssignmentListCtlrRO = {
  list: null,
  filtrStr: "",
  filtrCtl: null,

  init: function() {
    this.list = $$("projectAssignmentListRO");
    this.filtrCtl = $$("projectAssignmentFilterRO");
  },

  clear: function() {
    this.list.clearAll();
    this.filtrCtl.setValue("");
    projectAssignmentFormCtlrRO.clear();
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
Project Assignment List Toolbar (Read Only)
=====================================================================*/
var projectAssignmentListToolbarRO = {
  view: "toolbar",
  id: "projectAssignmentListToolbarRO",
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
      id: "projectAssignmentFilterRO",
      label: 'Filter',
      labelAlign: "right",
      width: 200,
      on: {
        onTimedKeyPress: function() {
          projectAssignmentListCtlrRO.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

/*=====================================================================
Project Assignment Form Elements (Read Only)
=====================================================================*/
var projectAssignmentFormElementsRO = [
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
Project Assignment Form (Read Only)
=====================================================================*/
var projectAssignmentFormRO = {
  view: "form",
  id: "projectAssignmentFormRO",
  elements: projectAssignmentFormElementsRO
};

/*=====================================================================
Project Assignment Form Controller (Read Only)
=====================================================================*/
var projectAssignmentFormCtlrRO = {
  frm: null,

  init: function() {
    this.frm = $$("projectAssignmentFormRO");
  },

  clear: function() {
    this.frm.clear();
    if (selectedProject) {
      this.frm.setValues({project: selectedProject.nickname});
    }
  },

  load: function(asn) {
    this.frm.setValues({
      employee: asn.employee,
      project: selectedProject.nickname,
      first_month: MonthLib.prettify(asn.first_month),
      last_month: MonthLib.prettify(asn.last_month),
      effort: asn.effort,
      notes: asn.notes,
      id: asn.id,
      employee_id: asn.employee_id,
      project_id: selectedProject.id
    });
  }
};

/*=====================================================================
Project Assignment Form Toolbar (Read Only)
=====================================================================*/
var projectAssignmentFormToolbarRO = {
  view: "toolbar",
  id: "projectAssignmentFormToolbarRO",
  height: 35,
  cols: [
    {view: "label", label: "Assignment Details"}
  ]
};

/*=====================================================================
Project Assignment Panel (Read Only)
=====================================================================*/
var projectAssignmentPanelRO = {
  type: "space",
  css: "panel_layout",
  cols: [
    {
      rows: [projectAssignmentListToolbarRO, projectAssignmentListRO]
    },
    {
      rows: [projectAssignmentFormToolbarRO, projectAssignmentFormRO]
    }
  ]
};

/*=====================================================================
Project Assignment Panel Controller (Read Only)
=====================================================================*/
var projectAssignmentPanelCtlrRO = {

  init: function() {
    projectAssignmentListCtlrRO.init();
    projectAssignmentFormCtlrRO.init();
  },

  clear: function() {
    projectAssignmentListCtlrRO.clear();
    projectAssignmentFormCtlrRO.clear();
  }

};
