from functools import wraps
from passlib.apps import custom_app_context as pw_ctx
from models.dao import Dao


class User(object):

    def __init__(self, username=None, password=None):
        self.is_authenticated = False
        self.is_admin = False
        self.user_id = None
        self.username = username if username else None
        self.password = password if password else None
        self.__pw_hash = None
        self.role_id = None

    def login(self):
        sql = "SELECT * FROM users WHERE username=?;"
        vals = (self.username, )
        rex = Dao.execute(sql, vals)
        if not rex or len(rex) != 1:
            raise Exception('Invalid login!')
        if not self.verify_pw(rex[0]['password']):
            raise Exception('Invalid login!')
        self.user_id = rex[0]['id']
        self.role_id = rex[0]['role_id']
        self.is_admin = self.role_id == 1
        self.is_authenticated = True

    @staticmethod
    def hash_pw(pw):
        return pw_ctx.encrypt(pw)

    def verify_pw(self, pw_hash):
        return pw_ctx.verify(self.password, pw_hash)

    def serialize(self):
        return {
            'id': self.user_id,
            'username': self.username,
            'password': self.password,
            'role_id': self.role_id,
            'is_authenticated': self.is_authenticated,
            'is_admin': self.is_admin
        }

    @staticmethod
    def get_users():
        sql = "SELECT * FROM users;"
        return Dao.execute(sql)

    @staticmethod
    def add_user(d):
        sql = ("INSERT INTO users "
               "(username, password, role_id) "
               "VALUES (?,?,?);")
        vals = (d['username'], User.hash_pw(d['password']), d['role_id'])
        return Dao.execute(sql, vals)

    @staticmethod
    def update_user(d):
        sql = ("UPDATE users "
               "SET username=?, password=?, role_id=? "
               "WHERE id=?;")
        vals = (d['username'], User.hash_pw(d['password']), d['role_id'], d['id'])
        return Dao.execute(sql, vals)

    @staticmethod
    def delete_user(user_id):
        sql = "DELETE FROM users WHERE id=?;"
        vals = (user_id,)
        return Dao.execute(sql, vals)

    @staticmethod
    def get_roles():
        sql = 'SELECT id, name AS value, description FROM roles;'
        return Dao.execute(sql)

    @staticmethod
    def add_role(d):
        sql = ("INSERT INTO roles "
               "(name, description) "
               "VALUES (?,?);")
        vals = (d['name'], d['description'])
        return Dao.execute(sql, vals)

    @staticmethod
    def update_role(d):
        sql = ("UPDATE roles "
               "SET name=?, description=? "
               "WHERE id=?;")
        vals = (d['name'], d['description'], d['id'])
        return Dao.execute(sql, vals)

    @staticmethod
    def delete_role(role_id):
        sql = "DELETE FROM roles WHERE id=?;"
        vals = (role_id,)
        return Dao.execute(sql, vals)


def admin_only(f):
    @wraps(f)
    def admin_view(*args, **kwargs):
        from flask import session, abort
        is_admin = session['is_admin']
        if is_admin:
            return f(*args, **kwargs)
        abort(401)
    return admin_view
