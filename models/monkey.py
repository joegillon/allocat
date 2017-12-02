import datetime


class Monkey(object):

    def __init__(self, display_value):
        self.value = display_value.replace('/', '')
        if len(self.value) == 4:
            self.value = '20' + self.value[2:] + self.value[:2]
        if self.is_valid():
            self.month, self.year = self.split()
            self.error = ''

    def new__str__(self):
        return self.value[:2] + '/' + self.value[2:]

    def __str__(self):
        return self.value[4:] + '/' + self.value[:4]

    def __eq__(self, other):
        return str(self) == str(other)

    def keyify(self):
        x = self.value[2:]
        return x[2:] + x[:2]

    def is_valid(self):
        self.error = ''
        if not self.value:
            self.error = 'is required!'
        elif len(self.value) != 6:
            self.error = 'is invalid!'
        elif not self.value.isdigit():
            self.error = 'is non-numeric!'
        elif int(self.value[4:]) not in range(1, 13):
            self.error = 'has invalid month!'
        return self.error == ''

    def flip(self):
        return self.value[4:] + self.value[:4]

    def split(self):
        return int(self.value[4:]), int(self.value[:4])

    def precedes(self, month):
        return self.flip() <= month.flip()

    def plus(self, span):
        from dateutil.relativedelta import relativedelta

        m, y = self.split()
        if span > 0:
            d = datetime.date(y, m, 1) + relativedelta(months=span - 1)
        else:
            d = datetime.date(y, m, 1) - relativedelta(months=abs(span))
        return Monkey('%04d%02d' % (d.year, d.month))

    @staticmethod
    def from_date(d):
        return Monkey('%02d%02d' % (d.year - 2000, d.month))

    @staticmethod
    def today():
        d = datetime.datetime.now()
        return '%02d%02d' % (d.year - 2000, d.month)

    @staticmethod
    def plus_six(month):
        m = int(month[2:])
        y = int(month[0:2])
        m += 1
        if m > 12:
            m -= 12
            y += 1
        return '%02d%02d' % (y, m)
