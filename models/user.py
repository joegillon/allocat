from models.dao import Dao


class Usr(object):

    @staticmethod
    def get_tbl():
        sql = 'SELECT u.username AS username, ' \
              'u.password AS password, ' \
              'r.name AS role, ' \
              'r.description AS description,' \
              'u.id AS user_id, ' \
              'r.id AS role_id ' \
              'FROM roles_users AS ru ' \
              'JOIN user AS u ON ru.user_id=u.id ' \
              'JOIN role AS r ON ru.role_id=r.id;'
        return Dao.execute(sql)

    @staticmethod
    def get_roles():
        sql = 'SELECT id, name AS value, description FROM role;'
        return Dao.execute(sql)
