/**
 * Created by Joe on 11/15/2017.
 */

/*=====================================================================
Employee List (Read Only)
=====================================================================*/
var employeeListRO = {
  view: "list",
  id: "employeeListRO",
  select: true,
  height: 500,
  width: 200,
  template: "#name#",
  on: {
    onAfterSelect: function() {
      employeeListCtlrRO.selected();
    }
  }
};

/*=====================================================================
Employee List Controller (Read Only)
=====================================================================*/
var employeeListCtlrRO = {
  list: null,
  filtrStr: "",
  filtrCtl: null,
  investigators: null,

  init: function () {
    this.list = $$("employeeListRO");
    this.filtrCtl = $$("employeeFilterRO");
    this.load(employees);
  },

  clear: function () {
    this.list.clearAll();
    this.filtrCtl.setValue("");
  },

  load: function (data) {
    this.filtrStr = this.filtrCtl.getValue();
    this.clear();
    this.list.parse(data);
    this.filtrCtl.setValue(this.filtrStr);
    this.filter(this.filtrStr);
  },

  select: function (id) {
    this.list.select(id);
    this.list.showItem(id);
  },

  selected: function () {
    selectedEmployee = this.list.getSelectedItem();
    employeeFormCtlrRO.load(selectedEmployee);
    employeeAssignmentListCtlrRO.loadFromDB(selectedEmployee.id);
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      return obj.name.toLowerCase().indexOf(value) == 0;
    })
  },

  toggle: function(newv, oldv) {
    if (newv) {
      if (!this.investigators) {
        this.investigators = [];
        for (var i=0; i<employees.length; i++) {
          if (employees[i].investigator) {
            this.investigators.push(employees[i]);
          }
        }
      }
      this.load(this.investigators);
    }
    else {
      this.load(employees);
    }
  }
};

/*=====================================================================
Employee List Toolbar (Read Only)
=====================================================================*/
var employeeListToolbarRO = {
  view: "toolbar",
  id: "employeeListToolbarRO",
  height: 105,
  rows: [
    {
      cols: [
        {
          view: "label",
          label: "Employees"
        }
      ]
    },
    {
      view: "text",
      id: "employeeFilterRO",
      label: 'Filter',
      labelAlign: "right",
      width: 200,
      on: {
        onTimedKeyPress: function() {
          selectedEmployee = null;
          employeeFormCtlrRO.clear();
          employeeAssignmentPanelCtlrRO.clear();
          employeeListCtlrRO.filter(this.getValue().toLowerCase());
        }
      }
    },
    {
      view: "toggle",
      id: "investigatorToggleRO",
      offLabel: "Investigators",
      onLabel: "All Employees",
      on: {
        onChange: function(newv, oldv) {
          employeeListCtlrRO.toggle(newv, oldv);
        }
      }
    }
  ]
};

/*=====================================================================
Employee Form (Read Only)
=====================================================================*/
var employeeFormRO = {
  view: "form",
  id: "employeeFormRO",
  elements: [
    {view: "text", name: "id", hidden: true},
    {
      view: "text",
      label: "Name",
      labelAlign: "right",
      name: "name",
      width: 300,
      readonly: true
    },
    {
      view: "text",
      label: "Grade",
      labelAlign: "right",
      name: "grade",
      width: 300,
      readonly: true
    },
    {
      view: "text",
      label: "Step",
      labelAlign: "right",
      name: "step",
      width: 300,
      readonly: true
    },
    {
      view: "text",
      label: "FTE",
      labelAlign: "right",
      name: "fte",
      width: 300,
      readonly: true
    },
    {
      view: "checkbox",
      label: "Investigator",
      labelAlign: "right",
      name: "investigator",
      width: 300,
      disabled: true
    },
    {
      view: "textarea",
      label: "Notes",
      labelAlign: "right",
      name: "notes",
      width: 300,
      height: 100,
      readonly: true
    }
  ]
};

/*=====================================================================
Employee Form Controller (Read Only)
=====================================================================*/
var employeeFormCtlrRO = {
  frm: null,

  init: function() {
    this.frm = $$("employeeFormRO");
  },

  clear: function() {
    this.frm.clear();
  },

  load: function(emp) {
    this.frm.setValues({
      id: emp.id,
      name: emp.name,
      grade: emp.grade,
      step: emp.step,
      fte: emp.fte,
      investigator: emp.investigator,
      notes: emp.notes
    });
  }
};

/*=====================================================================
Employee Form Toolbar (Read Only)
=====================================================================*/
var employeeFormToolbarRO = {
  view: "toolbar",
  id: "employeeFormToolbarRO",
  height: 35,
  cols: [
    {view: "label", label: "Employee Details"}
  ]
};

/*=====================================================================
Employee Panel (Read Only)
=====================================================================*/
var employeePanelRO = {
  type: "space",
  css: "panel_layout",
  cols: [
    {
      rows: [employeeListToolbarRO, employeeListRO]
    },
    {
      rows: [employeeFormToolbarRO, employeeFormRO]
    }
  ]
};

/*=====================================================================
Employee Panel Controller (Read Only)
=====================================================================*/
var employeePanelCtlrRO = {

  init: function() {
    employeeListCtlrRO.init();
    employeeFormCtlrRO.init();
  }

};
