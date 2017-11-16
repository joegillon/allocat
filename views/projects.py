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
