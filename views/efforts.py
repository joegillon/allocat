from flask import Blueprint, request, jsonify, render_template
from models.effort import EffortTable
from models.month import Month


eff = Blueprint('eff', __name__, url_prefix='/eff')


@eff.route('/efforts', methods=['GET'])
def eff_page():
    return render_template(
        'efforts.html',
        title='allocat efforts'
    )


@eff.route('/data', methods=['GET'])
def eff_data():
    months = Month.get_list(request.args['first_month'], request.args['last_month'])
    tbl = EffortTable(months)
    b = tbl.breakdowns()
    return jsonify(months=months, tbl=tbl.serialize(), breakdowns=b)
