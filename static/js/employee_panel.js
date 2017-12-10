/**
 * Created by Joe on 11/15/2017.
 */

/*=====================================================================
Employee List
=====================================================================*/
var employeeList = {
  view: "list",
  id: "employeeList",
  select: true,
  height: 500,
  width: 200,
  template: "#name#",
  on: {
    onAfterSelect: function() {
      employeeListCtlr.selected();
    }
  }
};

/*=====================================================================
Employee List Controller
=====================================================================*/
var employeeListCtlr = {
  list: null,
  filtrStr: "",
  filtrCtl: null,
  investigators: null,

  init: function () {
    this.list = $$("employeeList");
    this.filtrCtl = $$("employeeFilter");
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
    employeeFormCtlr.load(selectedEmployee);
    employeeAssignmentListCtlr.loadFromDB(selectedEmployee.id);
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
  },

  add: function() {
    employeeFormCtlr.clear();
    employeeAssignmentPanelCtlr.clear();
  }
};

/*=====================================================================
Employee List Toolbar
=====================================================================*/
var employeeListToolbar = {
  view: "toolbar",
  id: "employeeListToolbar",
  height: 105,
  rows: [
    {
      cols: [
        {
          view: "label",
          label: "Employees"
        },
        {
          view: "button",
          value: "Add",
          css: "add_button",
          click: function() {
            employeeListCtlr.add();
          }
        }
      ]
    },
    {
      view: "text",
      id: "employeeFilter",
      label: 'Filter',
      labelAlign: "right",
      width: 200,
      on: {
        onTimedKeyPress: function() {
          selectedEmployee = null;
          employeeFormCtlr.clear();
          employeeAssignmentPanelCtlr.clear();
          employeeListCtlr.filter(this.getValue().toLowerCase());
        }
      }
    },
    {
      view: "toggle",
      id: "investigatorToggle",
      offLabel: "Investigators",
      onLabel: "All Employees",
      on: {
        onChange: function(newv, oldv) {
          employeeListCtlr.toggle(newv, oldv);
        }
      }
    }
  ]
};

/*=====================================================================
Employee Form
=====================================================================*/
var employeeForm = {
  view: "form",
  id: "employeeForm",
  elements: [
    {view: "text", name: "id", hidden: true},
    {
      view: "text",
      label: "Name",
      labelAlign: "right",
      name: "name",
      width: 300,
      placeholder: "Last,First Middle",
      invalidMessage: "Last name, first name is required!",
      on: {
        onTimedKeyPress: function() {
          this.setValue(this.getValue().toUpperCase());
        }
      }
    },
    {
      view: "text",
      label: "Grade",
      labelAlign: "right",
      name: "grade",
      width: 300,
      invalidMessage: "Employee grade must be 0-15!",
      on: {
        onBlur: function() {
          employeeFormCtlr.setInvestigator(this.getValue());
        }
      }

    },
    {
      view: "text",
      label: "Step",
      labelAlign: "right",
      name: "step",
      width: 300,
      invalidMessage: "Employee step must be 0-15!"
    },
    {
      view: "text",
      label: "FTE",
      labelAlign: "right",
      name: "fte",
      width: 300,
      invalidMessage: "Employee FTE must be 0-100!"
    },
    {
      view: "checkbox",
      label: "Investigator",
      labelAlign: "right",
      name: "investigator",
      width: 300
    },
    {
      view: "textarea",
      label: "Notes",
      labelAlign: "right",
      name: "notes",
      width: 300,
      height: 100
    },
    {
      view: "button",
      value: "Save",
      type: "form",
      click: function() {
        employeeFormCtlr.save();
      }
    },
    {
      view: "button",
      value: "Remove",
      type: "danger",
      click: function() {
        employeeFormCtlr.remove(this.getParentView().getValues().id);
      }
    }
  ],
  rules: {
    "name": function(value) {
      return employeeFormCtlr.isValidName(value);
    },
    "grade":  function(value) {
      return employeeFormCtlr.isValidGradeOrStep(value);
    },
    "step":  function(value) {
      return employeeFormCtlr.isValidGradeOrStep(value);
    },
    "fte": function(value) {
      return employeeFormCtlr.isValidFte(value);
    }
  }
};

/*=====================================================================
Employee Form Controller
=====================================================================*/
var employeeFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("employeeForm");
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
  },

  save: function() {
    var values = this.validate();
    if (!values) return;

    var url = values["id"] ? "emp.emp_update" : "emp.emp_add";

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    url = Flask.url_for(url);

    ajaxDao.post(url, values, function(data) {
      employeeListCtlr.load(data["employees"]);
      employeeListCtlr.select(data["empid"]);
      webix.message("Employee saved! Hallelujah!");
    });

  },

  isValidName: function(value) {
    return /^[A-Z,'-]+, *[A-Z,\.]+$/.test(value);
  },

  isValidGradeOrStep: function(value) {
    var x = parseInt(value);
      return x >= 0 && x <= 15;
  },

  isValidFte: function(value) {
    var x = parseInt(value);
      return x >= 0 && x <= 100;
  },

  setInvestigator: function(value) {
    if (this.isValidGradeOrStep(value)) {
      this.frm.setValues({
        "investigator": parseInt(value) > 12
      }, true);
    }
  },

  validate: function() {
    if (!this.frm.validate()) {
      return null;
    }
    var values = this.frm.getValues({hidden: true});
    return values;
  },

  remove: function(id) {
    webix.confirm("Are you sure you want to remove this employee?", "confirm-warning", function(yes) {
      if (yes) {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        var url = Flask.url_for("emp.emp_drop", {empid: id});

        ajaxDao.get(url, function(data) {
          selectedEmployee = null;
          employeeListCtlr.load(data["employees"]);
          employeeFormCtlr.clear();
          employeeAssignmentPanelCtlr.clear();
          webix.message("Employee removed!");
        });
      }
    });
  }
};

/*=====================================================================
Employee Form Toolbar
=====================================================================*/
var employeeFormToolbar = {
  view: "toolbar",
  id: "employeeFormToolbar",
  height: 35,
  cols: [
    {view: "label", label: "Employee Details"}
  ]
};

/*=====================================================================
Employee Panel
=====================================================================*/
var employeePanel = {
  type: "space",
  css: "panel_layout",
  cols: [
    {
      rows: [employeeListToolbar, employeeList]
    },
    {
      rows: [employeeFormToolbar, employeeForm]
    }
  ]
};

/*=====================================================================
Employee Panel Controller
=====================================================================*/
var employeePanelCtlr = {

  init: function() {
    employeeListCtlr.init();
    employeeFormCtlr.init();
  }

};
