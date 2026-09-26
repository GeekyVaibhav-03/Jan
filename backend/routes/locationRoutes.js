import express from 'express';
import { getStates, getDistricts } from '../utils/helpers.js';

const router = express.Router();

/**
 * Get all Indian states
 */
router.get('/states', (req, res) => {
  try {
    const states = getStates();
    return res.status(200).json({
      success: true,
      states
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching states'
    });
  }
});

/**
 * Get districts for a state
 */
router.get('/districts/:state', (req, res) => {
  try {
    const { state } = req.params;
    const districts = getDistricts(state);

    if (!districts || districts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'State not found or no districts available'
      });
    }

    return res.status(200).json({
      success: true,
      districts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching districts'
    });
  }
});

export default router;
