from models.monkey import Monkey
from models.timeframe import Timeframe
from models.dao import Dao


class Assignment(object):

    @staticmethod
    def get_for_project(prjid, month=None):
        sql = ("SELECT a.id AS id, "
               "a.employee_id AS employee_id, "
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
            sql += "AND a.last_month >= ? "
            vals += [month]
        sql += "ORDER BY e.name;"
        return Dao.execute(sql, vals)

    @staticmethod
    def get_for_employee(empid, month=None):
        sql = ("SELECT a.id AS id, "
               "a.project_id AS project_id, "
               "a.first_month AS first_month, "
               "a.last_month AS last_month, "
               "a.effort AS effort, "
               "a.notes AS notes, "
               "p.nickname AS project "
               "FROM assignments AS a "
               "JOIN projects AS p "
               "ON a.project_id= p.id "
               "WHERE a.employee_id=? ")
        vals = [empid]
        if month:
            sql += ("AND a.first_month <= ? "
                    "AND a.last_month >= ? ")
            vals += [month, month]
        sql += "ORDER BY p.nickname;"
        return Dao.execute(sql, vals)

    @staticmethod
    def add(d):
        del d['id']
        sql = "INSERT INTO assignments (%s) VALUES (%s);" % (
            ','.join(d.keys()), '?' + ',?' * (len(d) - 1)
        )
        vals = list(d.values())
        return Dao.execute(sql, vals)

    @staticmethod
    def update(d):
        asnid = d['id']
        del d['id']
        sql = ("UPDATE assignments "
               "SET %s "
               "WHERE id=?;") % (
            ','.join(f + '=?' for f in d.keys()))
        vals = list(d.values()) + [asnid]
        return Dao.execute(sql, vals)

    @staticmethod
    def delete(asnid):
        sql = "DELETE FROM assignments WHERE id=?;"
        vals = [asnid]
        return Dao.execute(sql, vals)
