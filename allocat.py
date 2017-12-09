from flask import Flask, render_template, session
from flask_jsglue import JSGlue
from views.projects import prj
from views.employees import emp
from views.efforts import eff
from views.users import usr

app = Flask(__name__)
jsglue = JSGlue(app)

app.register_blueprint(prj)
app.register_blueprint(emp)
app.register_blueprint(eff)
app.register_blueprint(usr)

app.config['DEBUG'] = False


@app.before_first_request
def set_user():
    session['is_authenticated'] = False
    session['is_admin'] = False


@app.route('/')
def homepage():
    return render_template('home.html', title='allocat')


if __name__ == '__main__':
    app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
    app.run(host='0.0.0.0', port=3000, debug=True)
