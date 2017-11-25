/**
 * Created by Joe on 11/15/2017.
 */

/*=====================================================================
Project List
=====================================================================*/
var projectList = {
  view: "list",
  id: "projectList",
  select: true,
  height: 500,
  width: 200,
  template: "#nickname#",
  on: {
    onAfterSelect: function() {
      projectListCtlr.selected();
    }
  }
};

/*=====================================================================
Project List Controller
=====================================================================*/
var projectListCtlr = {
  list: null,
  filtrStr: "",
  filtrCtl: null,

  init: function () {
    this.list = $$("projectList");
    this.filtrCtl = $$("projectFilter");
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
    projectFormCtlr.load(selectedProject);
    projectAssignmentListCtlr.loadFromDB(selectedProject.id);
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      return obj.nickname.toLowerCase().indexOf(value) == 0;
    })
  },

  add: function() {
    projectFormCtlr.clear();
    projectAssignmentPanelCtlr.clear();
  }
};

/*=====================================================================
Project List Toolbar
=====================================================================*/
var projectListToolbar = {
  view: "toolbar",
  id: "projectListToolbar",
  height: 85,
  rows: [
    {
      cols: [
        {
          view: "label",
          label: "Projects"
        },
        {
          view: "button",
          value: "Add",
          css: "add_button",
          click: function() {
            projectListCtlr.add();
          }
        }
      ]
    },
    {
      view: "text",
      id: "projectFilter",
      label: 'Filter',
      width: 200,
      on: {
        onTimedKeyPress: function() {
          selectedProject = null;
          projectFormCtlr.clear();
          projectAssignmentPanelCtlr.clear();
          projectListCtlr.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

/*=====================================================================
Project Form
=====================================================================*/
var projectForm = {
  view: "form",
  id: "projectForm",
  elements: [
    {view: "text", name: "id", hidden: true},
    {
      view: "textarea",
      label: "Name",
      name: "name",
      width: 300,
      height: 100,
      invalidMessage: "Project name is required!"
    },
    {
      view: "text",
      label: "Nickname",
      name: "nickname",
      width: 300,
      invalidMessage: "Project nickname is required!"
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
    {view: "textarea", label: "Notes", name: "notes", width: 300, height: 100},
    {
      view: "button",
      value: "Save",
      type: "form",
      click: function() {
        projectFormCtlr.save();
      }
    },
    {
      view: "button",
      value: "Remove",
      type: "danger",
      click: function() {
        projectFormCtlr.remove(this.getParentView().getValues().id);
      }
    }
  ],
  rules: {
    "name": webix.rules.isNotEmpty,
    "nickname": webix.rules.isNotEmpty,
    "first_month": MonKey.isValidInput,
    "last_month": MonKey.isValidInput
  }
};

/*=====================================================================
Project Form Controller
=====================================================================*/
var projectFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("projectForm");
  },

  clear: function() {
    this.frm.clear();
  },

  load: function(prj) {
    this.frm.setValues({
      id: prj.id,
      name: prj.name,
      nickname: prj.nickname,
      first_month: MonKey.prettify(prj.first_month),
      last_month: MonKey.prettify(prj.last_month),
      notes: prj.notes
    });
  },

  save: function() {
    var values = this.validate();
    if (!values) return;

    var url = values["id"] ? "prj.prj_update" : "prj.prj_add";

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    url = Flask.url_for(url);

    ajaxDao.post(url, values, function(data) {
      projectListCtlr.load(data["projects"]);
      projectListCtlr.select(data["prjid"]);
      webix.message("Project saved!");
    });

  },

  validate: function() {
    if (!this.frm.validate()) {
      return null;
    }
    var values = this.frm.getValues({hidden: true});
    values.first_month = MonKey.uglify(values.first_month);
    values.last_month = MonKey.uglify(values.last_month);
    if (!MonKey.isValidSpan(values.first_month, values.last_month)) {
      webix.alert({type: "alert-error", text: "First month must precede last month!"});
      return null;
    }
    return values;
  },

  remove: function(id) {
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("prj.prj_drop", {prjid: id});

    ajaxDao.get(url, function(data) {
      projectListCtlr.load(data["projects"]);
      projectFormCtlr.clear();
      projectAssignmentPanelCtlr.clear();
      webix.message("Project removed!");
    });
  }
};

/*=====================================================================
Project Form Toolbar
=====================================================================*/
var projectFormToolbar = {
  view: "toolbar",
  id: "projectFormToolbar",
  height: 35,
  cols: [
    {view: "label", label: "Project Details"}
  ]
};

/*=====================================================================
Project Panel
=====================================================================*/
var projectPanel = {
  type: "space",
  css: "panel_layout",
  cols: [
    {
      rows: [projectListToolbar, projectList]
    },
    {
      rows: [projectFormToolbar, projectForm]
    }
  ]
};

/*=====================================================================
Project Panel Controller
=====================================================================*/
var projectPanelCtlr = {

  init: function() {
    projectListCtlr.init();
    projectFormCtlr.init();
  }

};
