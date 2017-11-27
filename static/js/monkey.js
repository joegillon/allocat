/**
 * Created by Joe on 11/21/2017.
 */

var MonKey = {
  isValidInput: function(input) {
    return /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(input);
  },

  prettify: function(monKey) {
    return monKey.slice(2) + '/' + monKey.slice(0,2);
  },

  uglify: function(input) {
    var parts = input.split('/');
    return parts[1] + parts[0];
  },

  isValidSpan: function(first, last) {
    return last >= first;
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
  }
};
