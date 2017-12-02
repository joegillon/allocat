from flask import Blueprint, request, jsonify, render_template
from models.effort import EffortTable
from models.month import Month


eff = Blueprint('eff', __name__, url_prefix='/eff')


@eff.route('/table', methods=['GET', 'POST'])
def eff_table():
    if request.method == 'GET':
        first_month = Month.today()
        last_month = Month.plus(first_month, 12)
        months = Month.get_list(first_month, last_month)
        tbl = EffortTable(months)
        b = tbl.breakdowns()
        return render_template(
            'efforts.html',
            title='allocat efforts',
            months=months,
            tbl=tbl.serialize(),
            breakdowns=b
        )

    months = Month.get_list(request.form['first_month'], request.form['last_month'])
    tbl = EffortTable(months)
    return jsonify(tbl=tbl.serialize())
