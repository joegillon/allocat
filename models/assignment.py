from models.monkey import Monkey
from models.timeframe import Timeframe
from models.dao import Dao


class Assignment(object):

    def __init__(self, d=None):
        self.id = None
        self.employee_id = None
        self.project_id = None
        self.first_month = None
        self.last_month = None
        self.timeframe = None
        self.effort = None
        if d:
            self.__from_dict(d)

    def __from_dict(self, d):
        self.id = d['id']
        self.employee_id = d['employee_id']
        self.project_id = d['project_id']
        self.first_month = Monkey(d['first_month'])
        self.last_month = Monkey(d['last_month'])
        self.timeframe = Timeframe(self.first_month, self.last_month)
        self.effort = d['effort']
        self.notes = d['notes']

    @staticmethod
    def get_for_project(prjid, month=None):
        sql = ("SELECT a.id AS id, "
               "a.employee_id AS empid, "
               "a.first_month AS first_month, "
               "a.last_month AS last_month, "
               "a.effort AS effort, "
               "a.notes AS notes, "
               "e.name AS employee "
               "FROM assignments AS a "
               "JOIN employees AS e "
               "ON a.employee_id= e.id "
               "WHERE a.project_id=? ")
        vals = [prjid]
        if month:
            sql += ("AND a.first_month <= ? "
                    "AND a.last_month >= ? ")
            vals += [month, month]
        sql += "ORDER BY e.name;"
        return Dao.execute(sql, vals)
