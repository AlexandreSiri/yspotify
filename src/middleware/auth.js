const jwt = require('jsonwebtoken')

module.exports = (req,res,next) =>{
    try {
        const token = req.headers?.authorization?.split(' ').at(1);
        if (!token) return res.status(400).send("Unauthorized")
        const decodedToken = jwt.verify(token, process.env.SECRET);
        console.log(decodedToken)
        const userId = decodedToken.id;
        const userPseudo = decodedToken.pseudo;
        if (req.body.userId && req.body.userId !== userId) {
          res.status.send('Invalid user ID');
        } else {
            req.userId = userId
            req.userPseudo = userPseudo
            next();
        }
      } catch {
        res.status(401).json({
          error: new Error('Invalid request!')
        });
      }
}

