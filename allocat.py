from flask import Flask, render_template
from flask_jsglue import JSGlue
from views.projects import prj
from views.employees import emp
from views.efforts import eff

app = Flask(__name__)
jsglue = JSGlue(app)

app.register_blueprint(prj)
app.register_blueprint(emp)
app.register_blueprint(eff)


@app.route('/')
def homepage():
    return render_template('home.html', title='allocat')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
