from flask import Blueprint, request, jsonify, render_template
import json
from models.project import Project


prj = Blueprint('prj', __name__, url_prefix='/prj')


@prj.route('/list', methods=['GET'])
def prj_list():
    data = Project.get_all()
    return render_template(
        'projects.html',
        title='allocat projects',
        data=data
    )


@prj.route('/assignments', methods=['GET'])
def prj_assignments():
    from models.assignment import Assignment
    from models.monkey import Monkey

    prjid = int(request.args['prjid'])
    monkey = Monkey.today()
    data = Assignment.get_for_project(prjid, monkey)
    return jsonify(assignments=data)


@prj.route('/save', methods=['POST'])
def prj_save():
    values = json.loads(request.form['params'])
    if values['id']:
        numrows = Project.update(values)
        return jsonify(numrows=numrows)
    prjid = Project.add(values)
    projects = Project.get_all()
    return jsonify(
        prjid=prjid,
        projects=projects
    )


@prj.route('/remove', methods=['GET'])
def prj_drop():
    prjid = json.loads(request.args['prjid'])
    result = Project.delete(prjid)
    data = Project.get_all()
    return jsonify(projects=data)

