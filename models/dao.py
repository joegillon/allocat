import sqlite3

dbfile = 'c:/bench/allocat/data/allocat.db'


class Dao(object):

    @staticmethod
    def execute(sql, params=None):
        cxn = sqlite3.connect(dbfile)
        cursor = cxn.cursor()
        op = sql.split(' ', 1)[0].upper()
        if op == 'SELECT':
            result = Dao.__query(cursor, sql, params)
        return result

    @staticmethod
    def __query(cursor, sql, params=None):
        if params:
            rows = cursor.execute(sql, params).fetchall()
        else:
            rows = cursor.execute(sql).fetchall()
        flds = [f[0] for f in cursor.description]
        return [dict(zip(flds, row)) for row in rows] if rows else []

