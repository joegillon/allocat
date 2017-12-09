from flask import Blueprint, request, jsonify, render_template, session, redirect, url_for
import json
from models.user import User, admin_only


usr = Blueprint('usr', __name__, url_prefix='/usr')


@usr.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template(
            'login.html',
            title='allocat login'
        )

    values = json.loads(request.form['params'])
    user = User(values['username'], values['password'])
    try:
        user.login()
        session['is_authenticated'] = True
        session['is_admin'] = user.is_admin
        if 'target' in values:
            return redirect(url_for(values['target']))
        return jsonify(msg='Successful login!')
    except Exception as ex:
        return jsonify(error=str(ex))


@usr.route('/mgt', methods=['GET'])
@admin_only
def user_mgt():
    users = User.get_users()
    roles = User.get_roles()
    return render_template(
        'users.html',
        title='allocat users',
        users=users,
        roles=roles
    )


@usr.route('/add_user', methods=['POST'])
def user_add():
    values = json.loads(request.form['params'])
    try:
        user = User.add_user(values)
    except Exception as ex:
        return jsonify(error=str(ex))
    return jsonify(id=id, users=User.get_users())


@usr.route('/update_user', methods=['POST'])
def user_update():
    values = json.loads(request.form['params'])
    try:
        numrows = User.update_user(values)
        if numrows != 1:
            msg = 'Record not updated for unknown reason. Contact admin.'
            return jsonify(error=msg)
    except Exception as ex:
        return jsonify(error=str(ex))
    return jsonify(id=values['id'], users=User.get_users())


@usr.route('/remove_user', methods=['GET'])
def usr_drop():
    id = json.loads(request.args['id'])
    success = User.delete_user(id)
    if not success:
        msg = 'Record not deleted for unknown reason. Contact admin.'
        return jsonify(error=msg)
    users = User.get_users()
    return jsonify(users=users)


@usr.route('/add_role', methods=['POST'])
def role_add():
    values = json.loads(request.form['params'])
    try:
        id = User.add_role(values)
    except Exception as ex:
        return jsonify(error=str(ex))
    return jsonify(id=id, roles=User.get_roles())


@usr.route('/update_role', methods=['POST'])
def role_update():
    values = json.loads(request.form['params'])
    try:
        numrows = User.update_role(values)
        if numrows != 1:
            msg = 'Record not updated for unknown reason. Contact admin.'
            return jsonify(error=msg)
    except Exception as ex:
        return jsonify(error=str(ex))
    return jsonify(id=values['id'], roles=User.get_roles())


@usr.route('/remove_role', methods=['GET'])
def role_drop():
    id = json.loads(request.args['id'])
    success = User.delete_role(id)
    if not success:
        msg = 'Record not deleted for unknown reason. Contact admin.'
        return jsonify(error=msg)
    roles = User.get_roles()
    return jsonify(roles=roles)
