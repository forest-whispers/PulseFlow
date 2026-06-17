import DoctorAvailability from "./doctorAvailability.model.js"
import { ConflictError, NotFoundError, } from '../../utils/error.js'

export const createAvailabilityService=async (doctor, availableDays, startTime, endTime, slotDuration)=>
{
    const existingSchedule=await DoctorAvailability.findOne({doctor });
    if(existingSchedule)
    {
        throw new ConflictError("Schedule already exists");
    }
    const schedule = await DoctorAvailability.create({ doctor, availableDays, startTime, endTime, slotDuration });
    return schedule;
}

export const updateAvailabilityService=async (doctor, updatePayload)=>
{
    const updatedSchedule = await DoctorAvailability.findOneAndUpdate({ doctor }, updatePayload, { new: true, runValidators: true });
    if(!updatedSchedule)
    {
        throw new NotFoundError("No schedule available");
    }
    return updatedSchedule;
}

export const getAvailabilityService=async (doctor)=>
{
    const schedule=await DoctorAvailability.findOne({doctor });
    if(!schedule)
    {
        throw new NotFoundError("No schedule available");
    }
    return schedule;
}