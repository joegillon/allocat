from flask import Blueprint, request, jsonify, render_template
import json
from models.assignment import Assignment


asn = Blueprint('asn', __name__, url_prefix='/asn')


@asn.route('/drop')
def asn_drop():
    asnid = json.loads(request.args['asnid'])
    result = Assignment.delete(asnid)
    data = Project.get_all()
    return jsonify(projects=data)
