export const pharmacyOnly = (req, res, next) => {
    if (req.user && (req.user.role === "pharmacy" || req.user.role === "pharmacyAdmin")) {
        next();
    } else {
        res.status(403).json({ message: "Access denied: Not a pharmacy admin" });
    }
};
