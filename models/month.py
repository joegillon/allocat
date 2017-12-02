import datetime


class Month(object):

    @staticmethod
    def today():
        d = datetime.datetime.now()
        return '%02d%02d' % (d.year - 2000, d.month)

    @staticmethod
    def plus(month, increment):
        m = int(month[2:])
        y = int(month[0:2])
        m += increment
        if m > 12:
            m -= 12
            y += 1
        return '%02d%02d' % (y, m)

    @staticmethod
    def get_list(first_month, last_month):
        the_list = []
        next_month = first_month
        while next_month <= last_month:
            the_list.append(next_month)
            next_month = Month.plus(next_month, 1)
        return the_list
