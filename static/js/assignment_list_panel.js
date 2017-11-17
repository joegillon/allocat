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
  template: "#employee#: #effort#"
};

/*=====================================================================
Assignment List Controller
=====================================================================*/
var assignmentListCtlr = {
  init: function() {
    $$("assignmentList").attachEvent("onItemClick", this.detailFunc);
  },

  clear: function() {
    $$("assignmentList").clearAll();
    assignmentFormCtlr.clear();
  },

  load: function(prjid) {
    this.clear();
    var url = Flask.url_for('prj.prj_assignments', {prjid: prjid});
    webix.ajax(url, {
      error: function(text, data, XmlHttpRequest) {
        var msg = "Error " + XmlHttpRequest.status + ": " + XmlHttpRequest.statusText;
        webix.message(msg);
      },
      success: function(text, data, XmlHttpRequest) {
        $$("assignmentList").parse(data.json()["assignments"]);
      }
    })
  },

  detailFunc: function(id) {
    var assignment = $$("assignmentList").getItem(id);
    $$("assignmentForm").setValues({
      employee: assignment.employee,
      project: 'boo',
      first_month: assignment.first_month,
      last_month: assignment.last_month,
      effort: assignment.effort,
      notes: assignment.notes
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
      id: "fltr",
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

  },

  filter: function(value) {
    $$("assignmentList").filter(function(obj) {
        return obj.employee.toLowerCase().indexOf(value) == 0;
    })
  }
};

/*=====================================================================
Assignment List Panel
=====================================================================*/
var assignmentListPanel = {
  rows: [assignmentListToolbar, assignmentList]
};

/*=====================================================================
Assignment List Panel Controller
=====================================================================*/
var assignmentListPanelCtlr = {
  init: function() {
    assignmentListCtlr.init();
  },

  load: function(data) {
    assignmentListCtlr.load(data);
  }
};
