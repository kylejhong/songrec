import unittest
import server

class TestClass(unittest.TestCase):

    def test_get_recommendations(self):
        result = server.get_recommendations(1, 'testuser1')
        self.assertEqual(result[0]['username'], 'testuser1')


if __name__ == '__main__':
    unittest.main()
