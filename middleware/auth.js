import jwt from 'jsonwebtoken';
export const validateToken = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Access Denied" })
    try {
        const decoded = jwt.verify(token, "url user")
        req.body.userId = decoded.id
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" })
    }
};
