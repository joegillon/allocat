from flask import Flask, render_template
from flask_jsglue import JSGlue
from views.projects import prj

app = Flask(__name__)
jsglue = JSGlue(app)

app.register_blueprint(prj)


@app.route('/')
def homepage():
    return render_template('home.html', title='allocat')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
