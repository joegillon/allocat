from flask import Blueprint, request, jsonify, render_template
import json
from flask_security import current_user
from models.user import Usr


usr = Blueprint('usr', __name__, url_prefix='/usr')


@usr.route('/mgt', methods=['GET', 'POST'])
def usr_mgt():
    if request.method == 'GET':
        users = Usr.get_tbl()
        roles = Usr.get_roles()
        return render_template(
            'user_mgt.html',
            title='allocat users',
            users=users,
            roles=roles
        )
