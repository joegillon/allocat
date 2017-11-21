from models.dao import Dao


class Project(object):

    def __str__(self):
        return self.nickname

    @staticmethod
    def get_all():
        sql = "SELECT * FROM projects ORDER BY nickname;"
        return Dao.execute(sql)

    @staticmethod
    def add(d):
        del d['id']
        sql = "INSERT INTO projects (%s) VALUES (%s);" % (
            ','.join(d.keys()), '?' + ',?' * (len(d) - 1)
        )
        vals = list(d.values())
        return Dao.execute(sql, vals)

    @staticmethod
    def update(d):
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
