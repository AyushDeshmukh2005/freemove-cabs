
const { pool } = require('../../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, type = 'rider' } = req.body;
    
    // Check if email already exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert new user
    const [result] = await pool.execute(
      `INSERT INTO users (name, email, phone, password, type, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, email, phone, hashedPassword, type]
    );
    
    const userId = result.insertId;
    
    // Generate JWT token
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user data (without password) and token
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, type, createdAt, updatedAt FROM users WHERE id = ?',
      [userId]
    );
    
    res.status(201).json({
      user: rows[0],
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Get user by email
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const user = rows[0];
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user data (without password) and token
    delete user.password;
    
    res.json({
      user,
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user from database
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, type, createdAt, updatedAt FROM users WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user's quiet hours
    const [quietHoursRows] = await pool.execute(
      'SELECT * FROM quiet_hours WHERE userId = ?',
      [id]
    );
    
    const quietHours = quietHoursRows.length > 0 ? quietHoursRows[0] : null;
    
    const user = {
      ...rows[0],
      quietHours
    };
    
    res.json({ user });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;
    
    // Update user in database
    const [result] = await pool.execute(
      `UPDATE users SET name = ?, phone = ?, updatedAt = NOW() WHERE id = ?`,
      [name, phone, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get updated user
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, type, createdAt, updatedAt FROM users WHERE id = ?',
      [id]
    );
    
    res.json({ user: rows[0] });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};

// Update quiet hours
const updateQuietHours = async (req, res) => {
  try {
    const { id } = req.params;
    const { enabled, startTime, endTime, daysOfWeek } = req.body;
    
    // Check if quiet hours already exist for this user
    const [existingRows] = await pool.execute(
      'SELECT * FROM quiet_hours WHERE userId = ?',
      [id]
    );
    
    if (existingRows.length > 0) {
      // Update existing quiet hours
      await pool.execute(
        `UPDATE quiet_hours SET 
          enabled = ?, 
          startTime = ?, 
          endTime = ?, 
          daysOfWeek = ?, 
          updatedAt = NOW() 
        WHERE userId = ?`,
        [enabled ? 1 : 0, startTime, endTime, JSON.stringify(daysOfWeek), id]
      );
    } else {
      // Create new quiet hours
      await pool.execute(
        `INSERT INTO quiet_hours (userId, enabled, startTime, endTime, daysOfWeek, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [id, enabled ? 1 : 0, startTime, endTime, JSON.stringify(daysOfWeek)]
      );
    }
    
    // Get updated quiet hours
    const [rows] = await pool.execute(
      'SELECT * FROM quiet_hours WHERE userId = ?',
      [id]
    );
    
    res.json({ quietHours: rows[0] });
  } catch (error) {
    console.error('Error updating quiet hours:', error);
    res.status(500).json({ error: 'Failed to update quiet hours' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateQuietHours
};
