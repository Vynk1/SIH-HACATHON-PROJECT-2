// middleware/permissions.js
module.exports = {
  isOwnerOrAdmin: (model, field = 'user_id') => {
    return async (req, res, next) => {
      try {
        const doc = await model.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Not found' });

        const userId = req.user.id || req.user._id;
        if (String(doc[field]) !== String(userId) && req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Forbidden' });
        }
        req.doc = doc; // pass doc to next
        next();
      } catch (err) {
        console.error('PERMISSION_ERR', err);
        res.status(500).json({ message: 'Server error' });
      }
    };
  }
};

