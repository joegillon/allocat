from models.dao import Dao
from models.monkey import Monkey
from models.timeframe import Timeframe


class Project(object):

    # def __init__(self, d=None):
    #     self.id = None
    #     self.name = None
    #     self.nickname = None
    #     self.first_month = None
    #     self.last_month = None
    #     self.timeframe = None
    #     self.notes = None
    #     self.assignments = None
    #     if d:
    #         self.__from_dict(d)

    def __str__(self):
        return self.nickname

    # def __from_dict(self, d):
    #     self.id = d['id']
    #     self.name = d['name']
    #     self.nickname = d['nickname']
    #     self.first_month = Monkey(d['first_month'])
    #     self.last_month = Monkey(d['last_month'])
    #     self.timeframe = Timeframe(self.first_month, self.last_month)
    #     self.notes = d['notes']

    @staticmethod
    def get_all():
        sql = "SELECT * FROM projects ORDER BY nickname;"
        return Dao.execute(sql)

    @staticmethod
    def save(values):
        if values['id']:
            return Project.__update(values)
        del values['id']
        return Project.__add(values)

    @staticmethod
    def __add(d):
        sql = "INSERT INTO projects (%s) VALUES (%s);" % (
            ','.join(d.keys()), '?' + ',?' * (len(d) - 1)
        )
        vals = list(d.values())
        return Dao.execute(sql, vals)

    @staticmethod
    def __update(d):
        prjid = d['id']
        del d['id']
        sql = ("UPDATE projects "
               "SET %s "
               "WHERE id=?;") % (
            ','.join(f + '=?' for f in d.keys()))
        vals = list(d.values()) + [prjid]
        return Dao.execute(sql, vals)

    @staticmethod
    def delete(id):
        sql = "DELETE FROM projects WHERE id=?;"
        vals = [id]
        return Dao.execute(sql, vals)

    # @staticmethod
    # def get_one(id):
    #     rec = crud.DataSet.get_one('Projects', id)
    #     return Project(rec)
    #
    # @staticmethod
    # def get_one_with_assignments(id):
    #     rec = Project.get_one(id)
    #     rec.get_assignments()
    #     return rec
    #
    # def get_assignments(self):
    #     if self.assignments:
    #         return
    #     from models import Assignment
    #     self.assignments = Assignment.get_all_for_prj(self.prjid)
    #
    # def save(self):
    #     if self.prjid:
    #         crud.DataSet.update(self)
    #     else:
    #         crud.DataSet.insert(self)
    #
    # def remove(self):
    #     sql = "DELETE FROM Assignments WHERE project_id=:id"
    #     cursor = crud.the_dataset.cxn.cursor()
    #     cursor.execute(sql, self.__dict__)
    #     crud.DataSet.remove(self)
    #
    # def assignments_in_timeframe(self, new_timeframe=None):
    #     the_timeframe = new_timeframe if new_timeframe else self.timeframe
    #     for asnid, asn in self.assignments.items():
    #         if not the_timeframe.contains(asn.timeframe):
    #             return False
    #     return True
    #
    # @staticmethod
    # def by_nickname(prj):
    #     return prj.nickname.lower()
