from models.dao import Dao


class Employee(object):

    def __str__(self):
        return self.name

    @staticmethod
    def get_all():
        sql = "SELECT * FROM employees ORDER BY name;"
        return Dao.execute(sql)

    @staticmethod
    def add(d):
        del d['id']
        sql = "INSERT INTO employees (%s) VALUES (%s);" % (
            ','.join(d.keys()), '?' + ',?' * (len(d) - 1)
        )
        vals = list(d.values())
        return Dao.execute(sql, vals)

    @staticmethod
    def update(d):
        empid = d['id']
        del d['id']
        sql = ("UPDATE employees "
               "SET %s "
               "WHERE id=?;") % (
            ','.join(f + '=?' for f in d.keys()))
        vals = list(d.values()) + [empid]
        return Dao.execute(sql, vals)

    @staticmethod
    def delete(empid):
        sqls = [
            "DELETE FROM assignments WHERE employee_id=%s;" % (empid,),
            "DELETE FROM employees WHERE id=%s;" % (empid,)
        ]
        return Dao.transaction(sqls)
