import DoctorAvailability from "./doctorAvailability.model.js"
import { NotFoundError, } from '../../utils/error.js'

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
    const schedule = await DoctorAvailability.findOne({ doctor: currUser.id, }).select("availableDays startTime endTime slotDuration isActive" ).lean();
    if(!schedule)
    {
        throw new NotFoundError("No schedule available");
    }
    return schedule;
}