from flask import Blueprint, request, jsonify, render_template
import json
from models.project import Project
from models.employee import Employee
from models.assignment import Assignment


prj = Blueprint('prj', __name__, url_prefix='/prj')


@prj.route('/list', methods=['GET'])
def prj_list():
    projects = Project.get_all()
    emp_rex = Employee.get_all()
    employees = [{'id': employee['id'], 'value': employee['name']} for employee in emp_rex]
    return render_template(
        'projects.html',
        title='allocat projects',
        projects=projects,
        employees=employees
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


@prj.route('/save_assignment', methods=['POST'])
def prj_save_assignment():
    values = json.loads(request.form['params'])
    if values['id']:
        numrows = Assignment.update(values)
        return jsonify(numrows=numrows)
    asnid = Assignment.add(values)
    assignments = Assignment.get_for_project(values['project_id'])
    return jsonify(
        asnid=asnid,
        assignments=assignments
    )


@prj.route('/drop_assignment', methods=['POST'])
def prj_drop_assignment():
    asn = json.loads(request.form['params'])
    numrows = Assignment.delete(asn['id'])
    assignments = Assignment.get_for_project(asn['project_id'])
    return jsonify(
        assignments=assignments
    )
