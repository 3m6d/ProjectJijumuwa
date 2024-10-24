# This is for testing

import unittest
from src.training import train

class TestTraining(unittest.TestCase):
    def test_training_runs(self):
        """Test if the training function runs without errors."""
        try:
            train()
            self.assertTrue(True)
        except Exception as e:
            self.fail(f"Training failed: {e}")

if __name__ == '__main__':
    unittest.main()
