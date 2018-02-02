from models.employee import Employee
from models.assignment import Assignment


class PercentEffort(object):

    def __init__(self, project, percent):
        self.project = project
        self.percent = percent

    def serialize(self):
        return {
            'project': self.project,
            'percent': self.percent
        }


class EffortCell(object):

    def __init__(self, month):
        self.month = month
        self.total = 0
        self.percent_efforts = []

    def serialize(self):
        return {
            'total': self.total,
            'percents': [pe.serialize() for pe in self.percent_efforts]
        }


class EffortRow(object):

    def __init__(self, employee):
        self.employee = employee
        self.effort_cells = []

    def serialize(self):
        row = {
            'id': self.employee['id'],
            'name': self.employee['name'],
            'fte': self.employee['fte']
        }
        for cell in self.effort_cells:
            row[cell.month] = cell.total
        return row


class EffortTable(object):

    def __init__(self, months):
        self.effort_rows = []
        self.__load(months)

    def __load(self, months):
        employees = Employee.get_all()
        assignments = Assignment.get_for_timeframe(months[0], months[-1])
        employee_assignments = {}
        for assignment in assignments:
            if assignment['employee_id'] not in employee_assignments:
                employee_assignments[assignment['employee_id']] = []
            employee_assignments[assignment['employee_id']].append(assignment)
        for employee in employees:
            row = EffortRow(employee)
            for month in months:
                cell = EffortCell(month)
                if employee['id'] not in employee_assignments:
                    continue
                for emp_asn in employee_assignments[employee['id']]:
                    if int(month) < emp_asn['first_month'] or int(month) > emp_asn['last_month']:
                        continue
                    cell.total += emp_asn['effort']
                    cell.percent_efforts.append(
                        PercentEffort(emp_asn['project'], emp_asn['effort'])
                    )
                row.effort_cells.append(cell)
            if row.effort_cells:
                self.effort_rows.append(row)

    def serialize(self):
        return {
            'rows': [r.serialize() for r in self.effort_rows]
        }

    def breakdowns(self):
        d = {}
        for row in self.effort_rows:
            for cell in row.effort_cells:
                k = '%s:%s' % (row.employee['id'], cell.month)
                d[k] = [e.serialize() for e in cell.percent_efforts]
        return d
