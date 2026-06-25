import { UnauthorizedError } from "../utils/error.js";

const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError("Access denied");
        }
        next();
    };
};

export default requireRole;