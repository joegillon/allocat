/**
 * Created by Joe on 12/1/2017.
 */

/*=====================================================================
Breakdown Popup
=====================================================================*/
var breakdownPopup = {
  view: "window",
  id: "breakdownPopup",
  width: 300,
  height: 200,
  move: true,
  position: "center",
  head: {
    css: "popup_header",
    cols: [
      {
        view: "label",
        id: "breakdownLabel",
        css: "popup_header",
        label: ""
      },
      {
        view: "button",
        label: "Close",
        width: 70,
        align: "right",
        click: "breakdownPopupCtlr.hide();"
      }
    ]
  },
  body: {
    rows: [
      {
        view: "datatable",
        id: "breakdownGrid",
        columns: [
          {id: "project", header: "Project", adjust: "data", readonly: true},
          {id: "percent", header: "% Effort", adjust: "header", readonly: true}
        ]
      }
    ]
  }
};

/*=====================================================================
Breakdown Popup Controller
=====================================================================*/
var breakdownPopupCtlr = {
  grid: null,
  popup: null,
  lbl: null,

  init: function() {
    this.grid = $$("breakdownGrid");
    this.popup = $$("breakdownPopup");
    this.lbl = $$("breakdownLabel");
  },

  show: function(employee, month, breakdown) {
    this.grid.clearAll();
    this.lbl.setValue(employee + " @ " + month);
    this.grid.parse(breakdown);
    this.grid.refresh();
    this.popup.show();
  },

  hide: function() {
    this.popup.hide();
  }

};
