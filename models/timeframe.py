from models.monkey import Monkey


class Timeframe(object):
    def __init__(self, first_month, last_month):
        self.first_month = Monkey(first_month) if type(first_month) is str else first_month
        self.last_month = Monkey(last_month) if type(last_month) is str else last_month

    def __str__(self):
        return '%s - %s' % (str(self.first_month), str(self.last_month))

    def __eq__(self, other):
        return str(self) == str(other)

    def old_str(self):
        return '%s - %s' % (self.first_month.old_str(), self.last_month.old_str())

    def span(self):
        first_month, first_year = self.first_month.split()
        last_month, last_year = self.last_month.split()
        years = (last_year - first_year)
        return (last_month + (years * 12)) - first_month + 1

    def monkey_list(self):
        return [self.first_month.plus(n).keyify() for n in range(1, self.span() + 1)]

    def contains(self, other):
        if type(other) is Timeframe:
            return self._contains_timeframe(other)
        if type(other) is Monkey:
            return self._contains_monkey(other)
        return self._contains_monkey(Monkey(other))

    def _contains_timeframe(self, other):
        return self.first_month.value <= other.first_month.value and \
            self.last_month.value >= other.last_month.value

    def _contains_monkey(self, other):
        return self.first_month.value <= other.value <= self.last_month.value

    def overlaps(self, other):
        if self.first_month.flip() > other.last_month.flip():
            return False
        if self.last_month.flip() < other.first_month.flip():
            return False
        return True
