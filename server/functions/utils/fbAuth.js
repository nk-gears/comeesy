const { admin, db } = require('./admin');

// Middleware func for protecting the route
// from un authorized access.
module.exports = (req, res, next) => {
  let idToken;
  // 1. get the token from the req header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('Error: No token found in the request');
    return res.status(403).json({ error: 'Unauthorized Request' });
  }
  // 2. check if the token is valid
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;

      return db
        .collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get();
    })
    .then(snapshot => {
      req.user.username = snapshot.docs[0].data().username;
      return next();
    })
    .catch(err => {
      console.error('Error while verifying token ', err);
      if (err.code === 'auth/id-token-expired') {
        return res.status(403).json({
          error: 'expired id-token provided',
        });
      } else if (err.code === 'auth/argument-error') {
        return res.status(403).json({
          error: 'invalid id-token provided',
        });
      }
      return res.status(500).json(err);
    });
};