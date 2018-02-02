/**
 * Created by Joe on 11/15/2017.
 */

/*=====================================================================
Project List (Read Only)
=====================================================================*/
var projectListRO = {
  view: "list",
  id: "projectListRO",
  select: true,
  height: 500,
  width: 200,
  template: "#nickname#",
  on: {
    onAfterSelect: function() {
      projectListCtlrRO.selected();
    }
  }
};

/*=====================================================================
Project List Controller (Read Only)
=====================================================================*/
var projectListCtlrRO = {
  list: null,
  filtrStr: "",
  filtrCtl: null,

  init: function () {
    this.list = $$("projectListRO");
    this.filtrCtl = $$("projectFilterRO");
    this.load(projects);
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
    selectedProject = this.list.getSelectedItem();
    projectFormCtlrRO.load(selectedProject);
    projectAssignmentListCtlrRO.loadFromDB(selectedProject.id);
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      return obj.nickname.toLowerCase().indexOf(value) != -1;
    })
  }
};

/*=====================================================================
Project List Toolbar (Read Only)
=====================================================================*/
var projectListToolbarRO = {
  view: "toolbar",
  id: "projectListToolbarRO",
  height: 85,
  rows: [
    {
      cols: [
        {
          view: "label",
          label: "Projects"
        }
      ]
    },
    {
      view: "text",
      id: "projectFilterRO",
      label: 'Filter',
      labelAlign: "right",
      width: 200,
      on: {
        onTimedKeyPress: function() {
          selectedProject = null;
          projectFormCtlrRO.clear();
          projectAssignmentPanelCtlrRO.clear();
          projectListCtlrRO.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

/*=====================================================================
Project Form (Read Only)
=====================================================================*/
var projectFormRO = {
  view: "form",
  id: "projectFormRO",
  elements: [
    {view: "text", name: "id", hidden: true},
    {
      view: "textarea",
      label: "Name",
      labelAlign: "right",
      name: "name",
      width: 300,
      height: 100,
      readonly: true
    },
    {
      view: "text",
      label: "Nickname",
      labelAlign: "right",
      name: "nickname",
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
      view: "textarea",
      label: "Notes",
      labelAlign: "right",
      name: "notes",
      width: 300,
      height: 100,
      readonly: true}
  ]
};

/*=====================================================================
Project Form Controller (Read Only)
=====================================================================*/
var projectFormCtlrRO = {
  frm: null,

  init: function() {
    this.frm = $$("projectFormRO");
  },

  clear: function() {
    this.frm.clear();
  },

  load: function(prj) {
    this.frm.setValues({
      id: prj.id,
      name: prj.name,
      nickname: prj.nickname,
      first_month: MonthLib.prettify(prj.first_month),
      last_month: MonthLib.prettify(prj.last_month),
      notes: prj.notes
    });
  }

};

/*=====================================================================
Project Form Toolbar (Read Only)
=====================================================================*/
var projectFormToolbarRO = {
  view: "toolbar",
  id: "projectFormToolbarRO",
  height: 35,
  cols: [
    {view: "label", label: "Project Details"}
  ]
};

/*=====================================================================
Project Panel (Read Only)
=====================================================================*/
var projectPanelRO = {
  type: "space",
  css: "panel_layout",
  cols: [
    {
      rows: [projectListToolbarRO, projectListRO]
    },
    {
      rows: [projectFormToolbarRO, projectFormRO]
    }
  ]
};

/*=====================================================================
Project Panel Controller (Read Only)
=====================================================================*/
var projectPanelCtlrRO = {

  init: function() {
    projectListCtlrRO.init();
    projectFormCtlrRO.init();
  }

};
