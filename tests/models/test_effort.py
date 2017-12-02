import unittest
from models.effort import EffortTable


class TestEffort(unittest.TestCase):

    def test_init(self):
        months = {'first_month': '1701', 'last_month': '1707'}
        tbl = EffortTable(months)
        lst = [
            '1701', '1702', '1703', '1704', '1705', '1706', '1707'
        ]
        self.assertEqual(lst, tbl.months)
        self.assertEqual(21, len(tbl.effort_rows))
