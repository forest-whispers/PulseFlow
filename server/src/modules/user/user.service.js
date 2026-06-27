import bcrypt from 'bcrypt'

import User from "./user.model.js";
import PatientProfile from '../patientProfile/patientProfile.model.js'
import DoctorProfile from '../doctorProfile/doctorProfile.model.js'
import DoctorAvailability from '../doctorAvailability/doctorAvailability.model.js';
import { ConflictError, UnauthorizedError, ForbiddenError } from '../../utils/error.js'

export const createUserService = async ({ name, email, password, role="patient", age, gender,}) =>
{
    const alreadyRegistered=await findUserByEmailService(email);
    if(alreadyRegistered)
    {
        throw new ConflictError("User already exists!")
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password : hashedPassword, role, age, gender,});
    if (role == "patient")
    {
        await PatientProfile.create({ user: user._id, });
    }
    else if (role == "doctor")
    {
        await DoctorProfile.create({ user: user._id, specialization: "doctor" });
        await DoctorAvailability.create({ doctor: user._id, startTime: "09:00", endTime: "20:00" })
    }
    return user;
};

export const loginUserService = async (email, password) =>
{
    const user = await findUserByEmailService(email);
    if (!user) {
        throw new UnauthorizedError("Invalid email or password");
    }
    const isPasswordMatched = await bcrypt.compare( password, user.password,);
    if (!isPasswordMatched) {
        throw new UnauthorizedError("Invalid email or password");
    }
    return user;
  };

export const findUserByEmailService = async (email) =>
{
    const user = await User.findOne({ email }).select('+password');
    return user;
};

export const getUserByIdService = async (id, currUser) =>
{
    if (currUser.role === "patient" && currUser.id !== id) {
        throw new ForbiddenError("Access Denied");
    }
    if (currUser.role === "doctor" && currUser.id !== id) {
        throw new ForbiddenError("Access Denied");
    }
    const user = await User.findById(id).select("-password");
    if (!user) {
        throw new NotFoundError("User not found");
    }
    let profile = null;
    if (user.role === "doctor") {
        profile = await DoctorProfile.findOne({ user: user._id, }.select("bio clinicAddress consultationFee experience specialization"));
    }
    if (user.role === "patient") {
        profile = await PatientProfile.findOne({ patient: user._id, }).select("bloodGroup allergies medicalHistory emergencyContact");
    }
    return {
        account: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            age: user.age,
            gender: user.gender
        },
        profile, };
};