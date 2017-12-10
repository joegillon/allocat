from flask import Flask, render_template, session, request, json, jsonify
from flask_jsglue import JSGlue
from views.projects import prj
from views.employees import emp
from views.efforts import eff
from views.users import usr
from models.user import admin_only

app = Flask(__name__)
jsglue = JSGlue(app)

app.register_blueprint(prj)
app.register_blueprint(emp)
app.register_blueprint(eff)
app.register_blueprint(usr)


@app.before_first_request
def set_user():
    session['is_authenticated'] = False
    session['is_admin'] = False
    session['user_id'] = None
    session['target'] = None


@app.route('/')
def homepage():
    return render_template('home.html', title='allocat')


@app.errorhandler(401)
def unauthorized_access(e):
    return render_template('401.html'), 401


@app.route('/backup', methods=['GET', 'POST'])
@admin_only
def backup():
    from subprocess import getoutput

    if request.method == 'GET':
        return render_template(
            'backup.html',
            title='allocat backup',
            default=app.config['BACKUP_PATH']
        )

    params = json.loads(request.form['params'])
    dest = params['destination'] + 'allocat.db'
    cpy = 'copy %s %s' % (app.config['DB_PATH'], dest)
    result = getoutput(cpy.replace('/', '\\'))
    return jsonify({'result': result.strip()})

if __name__ == '__main__':
    import configparser
    import os

    app_path = os.path.dirname(__file__)

    config = configparser.ConfigParser()
    config.read(app_path + '/config.ini')
    app.secret_key = config['USER_MGT']['key']
    fDebug = config['PHASE']['development'] == 'True'
    app.config['DB_PATH'] = config['DATABASE']['db_path'][1:-1]
    app.config['BACKUP_PATH'] = config['DATABASE']['backup_path'][1:-1]

    app.run(host='0.0.0.0', port=3000, debug=fDebug)
