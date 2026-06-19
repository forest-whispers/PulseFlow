import DoctorAvailability from "./doctorAvailability.model.js"
import { ConflictError, NotFoundError, } from '../../utils/error.js'

export const createAvailabilityService=async (currUser, availableDays, startTime, endTime, slotDuration)=>
{
    const existingSchedule=await DoctorAvailability.findOne({doctor: currUser.id });
    if(existingSchedule)
    {
        throw new ConflictError("Schedule already exists");
    }
    const schedule = await DoctorAvailability.create({ doctor: currUser.id, availableDays, startTime, endTime, slotDuration });
    return schedule;
}

export const updateAvailabilityService=async (currUser, updatePayload)=>
{
    const updatedSchedule = await DoctorAvailability.findOneAndUpdate({ doctor: currUser.id }, updatePayload, { new: true, runValidators: true });
    if(!updatedSchedule)
    {
        throw new NotFoundError("No schedule available");
    }
    return updatedSchedule;
}

export const getAvailabilityService=async (currUser)=>
{
    const schedule=await DoctorAvailability.findOne({doctor: currUser.id });
    if(!schedule)
    {
        throw new NotFoundError("No schedule available");
    }
    return schedule;
}