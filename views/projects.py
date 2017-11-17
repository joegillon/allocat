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
