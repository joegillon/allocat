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
  autowidth: true,
  autoheight: true,
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
    this.buildCols(months);
    this.load(tbl.rows);
  },

  clear: function() {
    this.grid.clearAll();
  },

  buildCols: function(months) {
    for (var i=0; i<months.length; i++) {
      effortGridCols.push(
        {
          id: months[i],
          header: MonthLib.prettify(months[i]),
          adjust: "header"
        }
      );
    }
    this.grid.config.columns = effortGridCols;
  },

  load: function(data) {
    this.grid.parse(data);
  },

  showBreakdown: function(row, col) {
    if (col == "name" || col == "fte") return;
    var breakdown = breakdowns[row + ":" + col];
    if (breakdown.length == 0) return;
    var employee = this.grid.getItem(id).name;
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
      placeholder: "MM/YY",
      invalidMessage: "Month format is numeric MM/YY!"
    },
    {
      view: "text",
      name: "last_month",
      label: "Thru",
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
    this.toolbar.setValues({
      first_month: MonthLib.prettify(months[0]),
      last_month: MonthLib.prettify(months[1])
    })
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

    var requestedMonths = MonthLib.getMonthList(values);
    if (requestedMonths.length == 0) return;

    var newMonths = MonthLib.getNewMonths(months, requestedMonths);
    if (newMonths.length == 0) return;


  },

  getMoreData: function() {

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
