/**
 * Created by Joe on 11/21/2017.
 */

var MonthLib = {
  isValidInput: function(input) {
    return /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(input);
  },

  prettify: function(month) {
    return month.slice(2) + '/' + month.slice(0,2);
  },

  uglify: function(input) {
    var parts = input.split('/');
    return parts[1] + parts[0];
  },

  toMoYr: function(month) {
    return {
      mo: parseInt(month.substr(2)) + 1,
      yr: parseInt(month.substr(0, 2))
    };
  },

  stringify: function(mo, yr) {
    var month = (mo < 10) ? ("0" + mo.toString()) : mo.toString();
    year = (yr < 10) ? ("0" + yr.toString()) : yr.toString();
    return year + month;
  },

  isValidSpan: function(first, last) {
    return last >= first;
  },

  validMonths: function(inputs) {
    if (!this.isValidInput(inputs["first_month"])) {
      webix.alert({type: "alert-error", text: "First month must be MM/YY!"});
      return null;
    }

    if (!this.isValidInput(inputs["last_month"])) {
      webix.alert({type: "alert-error", text: "Last month must be MM/YY!"});
      return null;
    }

    var first_month = MonthLib.uglify(inputs["first_month"]);
    var last_month = MonthLib.uglify(inputs["last_month"]);

    if (!MonthLib.isValidSpan(first_month, last_month)) {
      webix.alert({type: "alert-error", text: "First month must precede last month!"});
      return null;
    }
    return {first_month: first_month, last_month: last_month};
  },

  isInProjectTimeframe: function(project, assignment) {
    if (assignment.first_month < project.first_month) return false;
    return assignment.last_month <= project.last_month;
  },

  buildProjectTimeframes: function() {
    projectTimeframes = {};
    for (var i=0; i<projects.length; i++) {
      projectTimeframes[projects[i].id] = {
        first_month: projects[i].first_month,
        last_month: projects[i].last_month
      }
    }
  },

  getMonthList: function(timeframe) {
    var list = [];
    var nextMonth = timeframe.first_month;
    while (nextMonth <= timeframe.last_month) {
      list.push(nextMonth);
      nextMonth = this.getNextMonth(nextMonth);
    }
    return list;
  },

  getNextMonth: function(month) {
    var moYr = this.toMoYr(month);
    var mo = parseInt(moYr.mo);
    var yr = parseInt(moYr.yr);
    mo = mo + 1;
    if (mo > 12) {
      mo = mo - 12;
      yr = yr + 1;
    }
    return this.stringify(mo, yr);
  },

  getNewMonths: function(currentList, newList) {
    return (_.xor(newList, currentList)).sort();
  }
};
