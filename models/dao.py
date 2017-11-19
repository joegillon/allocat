import sqlite3

dbfile = 'c:/bench/allocat/data/allocat.db'


class Dao(object):

    @staticmethod
    def execute(sql, params=None):
        cxn = sqlite3.connect(dbfile)
        op = sql.split(' ', 1)[0].upper()
        if op == 'SELECT':
            return Dao.__query(cxn, sql, params)
        return Dao.__save(op, cxn, sql, params)

    @staticmethod
    def __query(cxn, sql, params=None):
        cursor = cxn.cursor()
        if params:
            rows = cursor.execute(sql, params).fetchall()
        else:
            rows = cursor.execute(sql).fetchall()
        flds = [f[0] for f in cursor.description]
        return [dict(zip(flds, row)) for row in rows] if rows else []

    @staticmethod
    def __save(op, cxn, sql, params):
        cursor = cxn.cursor()
        cursor.execute(sql, params)
        cxn.commit()
        if op == 'INSERT':
            return cursor.lastrowid
        else:
            return cursor.rowcount
