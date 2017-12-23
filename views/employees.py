from flask import Blueprint, request, jsonify, render_template, session
import json
from models.project import Project
from models.employee import Employee
from models.assignment import Assignment


emp = Blueprint('emp', __name__, url_prefix='/emp')


@emp.route('/list', methods=['GET'])
def emp_list():
    employees = Employee.get_all()
    prj_rex = Project.get_all()
    projects = [
        {
            'id': project['id'],
            'value': project['nickname'],
            'first_month': project['first_month'],
            'last_month': project['last_month']
        } for project in prj_rex]

    is_authenticated = session['is_authenticated'] if 'is_authenticated' in session else False
    page = 'employees.html' if is_authenticated else 'employees_ro.html'

    return render_template(
        page,
        title='allocat employees',
        projects=projects,
        employees=employees
    )


@emp.route('/add', methods=['POST'])
def emp_add():
    values = json.loads(request.form['params'])
    try:
        empid = Employee.add(values)
    except Exception as ex:
        return jsonify(error=str(ex))
    return jsonify(empid=empid, employees=Employee.get_all())


@emp.route('/update', methods=['POST'])
def emp_update():
    values = json.loads(request.form['params'])
    empid = values['id']
    try:
        numrows = Employee.update(values)
        if numrows != 1:
            msg = 'Record not updated for unknown reason. Contact admin.'
            return jsonify(error=msg)
    except Exception as ex:
        return jsonify(error=str(ex))
    return jsonify(empid=empid, employees=Employee.get_all())


@emp.route('/remove', methods=['GET'])
def emp_drop():
    empid = json.loads(request.args['empid'])
    success = Employee.delete(empid)
    if not success:
        msg = 'Record not deleted for unknown reason. Contact admin.'
        return jsonify(error=msg)
    data = Employee.get_all()
    return jsonify(employees=data)


@emp.route('/assignments', methods=['GET'])
def emp_assignments():
    from models.assignment import Assignment
    from models.month import Month

    empid = int(request.args['empid'])
    month = Month.today()
    data = Assignment.get_for_employee(empid, month)
    return jsonify(assignments=data)


@emp.route('/add_assignment', methods=['POST'])
def emp_add_assignment():
    values = json.loads(request.form['params'])
    try:
        asnid = Assignment.add(values)
    except Exception as ex:
        return jsonify(error=str(ex))
    assignments = Assignment.get_for_employee(values['employee_id'])
    return jsonify(asnid=asnid, assignments=assignments)


@emp.route('/update_assignment', methods=['POST'])
def emp_update_assignment():
    values = json.loads(request.form['params'])
    asnid = values['id']
    try:
        asnid = Assignment.update(values)
    except Exception as ex:
        return jsonify(error=str(ex))
    assignments = Assignment.get_for_employee(values['employee_id'])
    return jsonify(asnid=asnid, assignments=assignments)


@emp.route('/drop_assignment', methods=['POST'])
def emp_drop_assignment():
    asn = json.loads(request.form['params'])
    numrows = Assignment.delete(asn['id'])
    assignments = Assignment.get_for_employee(asn['employee_id'])
    return jsonify(
        assignments=assignments
    )
