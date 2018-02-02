/**
 * Created by Joe on 11/28/2017.
 */

/*=====================================================================
Effort Grid Columns
=====================================================================*/
var effortGridCols = [
  {id: "id", hidden: true},
  {id: "name", header: "Employee", adjust: "data", sort: "string"},
  {id: "fte", header: "FTE", adjust: "data"}
];

/*=====================================================================
Effort Grid
=====================================================================*/
var effortGrid = {
  view: "datatable",
  id: "effortGrid",
  width: 600,
  height: 200,
  columns: effortGridCols,  // Don't know why this has to be here but...
  on: {
    onItemClick: function(id) {
      effortGridCtlr.showBreakdown(id.row, id.column);
    }
  }
};

/*=====================================================================
Effort Grid Controller
=====================================================================*/
var effortGridCtlr = {
  grid: null,

  init: function() {
    this.grid = $$("effortGrid");
  },

  clear: function() {
    this.grid.clearAll();
  },

  buildCols: function() {
    var columns = effortGridCols.slice();
    for (var i=0; i<months.length; i++) {
      columns.push(
        {
          id: months[i],
          header: MonthLib.prettify(months[i]),
          adjust: "header"
        }
      );
    }
    this.grid.config.columns = columns;
    this.grid.refreshColumns();
  },

  load: function() {
    this.buildCols();
    this.grid.clearAll();
    this.grid.parse(tbl);
  },

  showBreakdown: function(row, col) {
    if (col == "name" || col == "fte") return;
    var breakdown = breakdowns[row + ":" + col];
    if (breakdown.length == 0) return;
    var employee = this.grid.getItem(row).name;
    var month = MonthLib.prettify(col);
    breakdownPopupCtlr.show(employee, month, breakdown);
  }
};

/*=====================================================================
Effort Grid Toolbar
=====================================================================*/
var effortGridToolbar = {
  view: "toolbar",
  id: "effortGridToolbar",
  cols: [
    {
      view: "text",
      name: "first_month",
      label: "Start",
      labelAlign: "right",
      width: 150,
      placeholder: "MM/YY",
      invalidMessage: "Month format is numeric MM/YY!"
    },
    {
      view: "text",
      name: "last_month",
      label: "Thru",
      labelAlign: "right",
      width: 150,
      placeholder: "MM/YY",
      invalidMessage: "Month format is numeric MM/YY!"
    },
    {
      view: "button",
      value: "Run Query",
      click: function() {
        effortGridToolbarCtlr.runQuery();
      }
    },
    {
      view: "label",
      label: "Click cell for breakdown"
    }
  ]
};

/*=====================================================================
Effort Grid Toolbar Controller
=====================================================================*/
var effortGridToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("effortGridToolbar");
    this.defaultTimeframe();
    this.runQuery();
  },

  defaultTimeframe: function() {
    var today = new Date();
    var firstMo = today.getMonth() + 1;
    var firstYr = today.getFullYear() - 2000;
    var lastMo = firstMo + 12;
    var lastYr = firstYr;
    if (lastMo > 12) {
      lastMo -= 12;
      lastYr += 1;
    }
    this.toolbar.setValues({
      first_month: MonthLib.prettify(firstYr.toString() + firstMo.toString()),
      last_month: MonthLib.prettify(lastYr.toString() + lastMo.toString())
    });
  },

  validate: function() {
    if (!this.toolbar.validate()) {
      return null;
    }
    return MonthLib.validMonths(this.toolbar.getValues());
  },

  runQuery: function() {
    var values = this.validate();
    if (!values) return;

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("eff.eff_data", values);
    ajaxDao.get(url, function(data) {
      months = data["months"];
      tbl = data["tbl"].rows;
      breakdowns = data["breakdowns"];
      effortGridCtlr.load();
    });
  }

};

/*=====================================================================
Effort Panel
=====================================================================*/
var effortPanel = {
  type: "space",
  css: "panel_layout",
  rows: [effortGridToolbar, effortGrid]
};

/*=====================================================================
Effort Panel Controller
=====================================================================*/
var effortPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("effortPanel");
    effortGridCtlr.init();
    effortGridToolbarCtlr.init();
  }
};
