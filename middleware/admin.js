const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyAdmin = (req, res, next) => 
    {
        const token = req.headers.authorization;
    
        if (!token) return res.status(401).json({ msg: 'No token, access denied' });
    
        try 
        {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (!decoded.isAdmin) return res.status(403).json({ msg: 'Access denied' });
    
          req.user = decoded;
          next();
          // console.log("got the access!");
          
        } 
        catch (err) 
        {
          res.status(401).json({ msg: 'Invalid token' });
        }
};

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};


module.exports = {
  verifyAdmin ,
  userAuth
};