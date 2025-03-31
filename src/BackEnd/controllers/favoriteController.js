
const { pool } = require('../Database/database');

// Save a favorite route
const saveFavoriteRoute = async (req, res) => {
  try {
    const { userId, name, startAddress, startLat, startLng, endAddress, endLat, endLng } = req.body;
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Save favorite route
    const now = new Date();
    const [result] = await pool.query(
      'INSERT INTO favorite_routes (userId, name, startAddress, startLat, startLng, endAddress, endLat, endLng, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, name, startAddress, startLat, startLng, endAddress, endLat, endLng, now]
    );
    
    return res.status(201).json({
      success: true,
      message: 'Favorite route saved successfully',
      data: {
        id: result.insertId,
        userId,
        name,
        startAddress,
        startLat,
        startLng,
        endAddress,
        endLat,
        endLng,
        createdAt: now
      }
    });
  } catch (error) {
    console.error('Error saving favorite route:', error);
    return res.status(500).json({ success: false, message: 'Failed to save favorite route' });
  }
};

// Get favorite routes for a user
const getFavoriteRoutes = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get favorite routes
    const [routes] = await pool.query('SELECT * FROM favorite_routes WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    
    return res.status(200).json({ success: true, data: routes });
  } catch (error) {
    console.error('Error fetching favorite routes:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch favorite routes' });
  }
};

// Delete a favorite route
const deleteFavoriteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if route exists
    const [routes] = await pool.query('SELECT * FROM favorite_routes WHERE id = ?', [id]);
    
    if (routes.length === 0) {
      return res.status(404).json({ success: false, message: 'Favorite route not found' });
    }
    
    // Delete route
    await pool.query('DELETE FROM favorite_routes WHERE id = ?', [id]);
    
    return res.status(200).json({
      success: true,
      message: 'Favorite route deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting favorite route:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete favorite route' });
  }
};

// Save a favorite driver
const saveFavoriteDriver = async (req, res) => {
  try {
    const { userId, driverId } = req.body;
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if driver is already a favorite
    const [existingFavorites] = await pool.query('SELECT * FROM favorite_drivers WHERE userId = ? AND driverId = ?', [userId, driverId]);
    
    if (existingFavorites.length > 0) {
      return res.status(400).json({ success: false, message: 'Driver is already a favorite' });
    }
    
    // Save favorite driver
    const now = new Date();
    const [result] = await pool.query(
      'INSERT INTO favorite_drivers (userId, driverId, createdAt) VALUES (?, ?, ?)',
      [userId, driverId, now]
    );
    
    return res.status(201).json({
      success: true,
      message: 'Favorite driver saved successfully',
      data: {
        id: result.insertId,
        userId,
        driverId,
        createdAt: now
      }
    });
  } catch (error) {
    console.error('Error saving favorite driver:', error);
    return res.status(500).json({ success: false, message: 'Failed to save favorite driver' });
  }
};

// Get favorite drivers for a user
const getFavoriteDrivers = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get favorite drivers
    const [drivers] = await pool.query('SELECT * FROM favorite_drivers WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    
    return res.status(200).json({ success: true, data: drivers });
  } catch (error) {
    console.error('Error fetching favorite drivers:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch favorite drivers' });
  }
};

// Delete a favorite driver
const deleteFavoriteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if driver exists
    const [drivers] = await pool.query('SELECT * FROM favorite_drivers WHERE id = ?', [id]);
    
    if (drivers.length === 0) {
      return res.status(404).json({ success: false, message: 'Favorite driver not found' });
    }
    
    // Delete driver
    await pool.query('DELETE FROM favorite_drivers WHERE id = ?', [id]);
    
    return res.status(200).json({
      success: true,
      message: 'Favorite driver deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting favorite driver:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete favorite driver' });
  }
};

module.exports = {
  saveFavoriteRoute,
  getFavoriteRoutes,
  deleteFavoriteRoute,
  saveFavoriteDriver,
  getFavoriteDrivers,
  deleteFavoriteDriver
};
