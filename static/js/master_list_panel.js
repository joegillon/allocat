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
  autoheight: true,
  width: 300,
  on: {
    onItemClick: function(id) {

    }
  }
};

/*=====================================================================
Master List Controller
=====================================================================*/
var masterListCtlr = {
  init: function(template) {
    $$("masterList").define("template", template);
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
      width: 300,
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
  init: function(label, template) {
    masterListToolbarCtlr.init(label);
    masterListCtlr.init(template);
  },

  load: function(data) {
    masterListCtlr.load(data);
  }
};
