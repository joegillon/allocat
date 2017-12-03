from flask import Flask, render_template
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.security import Security, SQLAlchemyUserDatastore, \
    UserMixin, RoleMixin, user_registered, LoginForm, ResetPasswordForm
from flask_security.forms import LoginForm
from wtforms import StringField
from wtforms.validators import InputRequired
from flask_jsglue import JSGlue
from views.projects import prj
from views.employees import emp
from views.efforts import eff

app = Flask(__name__)
jsglue = JSGlue(app)

app.register_blueprint(prj)
app.register_blueprint(emp)
app.register_blueprint(eff)

app.config['DEBUG'] = False
app.config['SECRET_KEY'] = 'super-secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data/allocat.db'
app.config['SECURITY_REGISTERABLE'] = True
app.config['SECURITY_PASSWORD_HASH'] = 'sha512_crypt'
app.config['SECURITY_PASSWORD_SALT'] = 'fhasdgihwntlgy8f'
app.config['SECURITY_CHANGEABLE'] = True
app.config['SECURITY_USER_IDENTITY_ATTRIBUTES'] = 'username'
app.config['DB_FILE'] = 'c:/bench/allocat/data/allocat.db'

sdb = SQLAlchemy(app)

roles_users = sdb.Table('roles_users',
                        sdb.Column('user_id', sdb.Integer(), sdb.ForeignKey('user.id')),
                        sdb.Column('role_id', sdb.Integer(), sdb.ForeignKey('role.id')))


class Role(sdb.Model, RoleMixin):
    id = sdb.Column(sdb.Integer(), primary_key=True)
    name = sdb.Column(sdb.String(80), unique=True)
    description = sdb.Column(sdb.String(255))


class User(sdb.Model, UserMixin):
    id = sdb.Column(sdb.Integer, primary_key=True)
    username = sdb.Column(sdb.String(255), unique=True)
    password = sdb.Column(sdb.String(255))
    active = sdb.Column(sdb.Boolean(), default=False)
    confirmed_at = sdb.Column(sdb.DateTime())
    roles = sdb.relationship('Role', secondary=roles_users,
                             backref=sdb.backref('users', lazy='dynamic'))


class ExtendedLoginForm(LoginForm):
    email = StringField('username', [InputRequired()])


user_datastore = SQLAlchemyUserDatastore(sdb, User, Role)
security = Security(app, user_datastore)


# @app.before_first_request
# def create_user():
#     sdb.create_all()
#     user_datastore.create_user(username='jcolozzi', password='damnYankees!')
#     sdb.session.commit()


@app.route('/')
def homepage():
    return render_template('home.html', title='allocat')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
