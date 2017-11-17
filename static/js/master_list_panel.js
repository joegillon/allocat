/**
 * Created by Joe on 11/15/2017.
 */

/*=====================================================================
Master List
=====================================================================*/
var masterList = {
  view: "list",
  id: "masterList",
  select: true,
  height: 500,
  width: 200
};

/*=====================================================================
Master List Controller
=====================================================================*/
var masterListCtlr = {
  init: function(template, detailFunc) {
    $$("masterList").define("template", template);
    $$("masterList").attachEvent("onItemClick", detailFunc);
  },

  clear: function() {
    $$("masterList").clearAll();
  },

  load: function(data) {
    $$("masterList").parse(data);
  }

};

/*=====================================================================
Master List Toolbar
=====================================================================*/
var masterListToolbar = {
  view: "toolbar",
  id: "masterListToolbar",
  height: 70,
  rows: [
    {
      cols: [
        {
          view: "label",
          id: "masterListLabel",
          label: ""
        },
        {
          view: "button",
          id: "addButton",
          value: "Add",
          click: function() {
            masterListToolbarCtlr.add();
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
          masterListToolbarCtlr.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

/*=====================================================================
Master List Toolbar Controller
=====================================================================*/
var masterListToolbarCtlr = {
  init: function(label) {
    $$("masterListLabel").setValue(label);
  },

  add: function() {

  },

  filter: function(value) {
    $$("masterList").filter(function(obj) {
        return obj.nickname.toLowerCase().indexOf(value) == 0;
    })
  }
};

/*=====================================================================
Master List Panel
=====================================================================*/
var masterListPanel = {
  rows: [masterListToolbar, masterList]
};

/*=====================================================================
Master List Panel Controller
=====================================================================*/
var masterListPanelCtlr = {
  init: function(label, template, detailFunc) {
    masterListToolbarCtlr.init(label);
    masterListCtlr.init(template, detailFunc);
  },

  load: function(data) {
    masterListCtlr.load(data);
  }
};
