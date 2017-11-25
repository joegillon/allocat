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


@prj.route('/add', methods=['POST'])
def prj_add():
    values = json.loads(request.form['params'])
    try:
        prjid = Project.add(values)
    except Exception as ex:
        return ex.message
    return jsonify(prjid=prjid, projects=Project.get_all())


@prj.route('/update', methods=['POST'])
def prj_update():
    values = json.loads(request.form['params'])
    prjid = values['id']
    try:
        numrows = Project.update(values)
        if numrows != 1:
            msg = 'Record not updated for unknown reason. Contact admin.'
            return jsonify(error=msg)
    except Exception as ex:
        return jsonify(error=str(ex))
    return jsonify(prjid=prjid, projects=Project.get_all())


@prj.route('/remove', methods=['GET'])
def prj_drop():
    prjid = json.loads(request.args['prjid'])
    success = Project.delete(prjid)
    if not success:
        msg = 'Record not deleted for unknown reason. Contact admin.'
        return jsonify(error=msg)
    data = Project.get_all()
    return jsonify(projects=data)


@prj.route('/assignments', methods=['GET'])
def prj_assignments():
    from models.assignment import Assignment
    from models.monkey import Monkey

    prjid = int(request.args['prjid'])
    monkey = Monkey.today()
    data = Assignment.get_for_project(prjid, monkey)
    return jsonify(assignments=data)


@prj.route('/add_assignment', methods=['POST'])
def prj_add_assignment():
    values = json.loads(request.form['params'])
    try:
        asnid = Assignment.add(values)
    except Exception as ex:
        return jsonify(error=str(ex))
    assignments = Assignment.get_for_project(values['project_id'])
    return jsonify(asnid=asnid, assignments=assignments)


@prj.route('/update_assignment', methods=['POST'])
def prj_update_assignment():
    values = json.loads(request.form['params'])
    asnid = values['id']
    try:
        asnid = Assignment.update(values)
    except Exception as ex:
        return jsonify(error=str(ex))
    assignments = Assignment.get_for_project(values['project_id'])
    return jsonify(asnid=asnid, assignments=assignments)


@prj.route('/drop_assignment', methods=['POST'])
def prj_drop_assignment():
    asn = json.loads(request.form['params'])
    numrows = Assignment.delete(asn['id'])
    assignments = Assignment.get_for_project(asn['project_id'])
    return jsonify(
        assignments=assignments
    )
