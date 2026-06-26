import DoctorProfile from "../doctorProfile/doctorProfile.model.js";
import DoctorAvailability from "../doctorAvailability/doctorAvailability.model.js"
import AvailabilityException from "../availabilityException/availabilityException.model.js";
import Appointment from "../appointment/appointment.model.js"
import { NotFoundError } from '../../utils/error.js'

export const searchDoctorsService = async (queryParams) => {
    const { specialization, minFee, maxFee, } = queryParams;
    const query = {};
    if(specialization)
    {
        query.specialization = {
            $regex: specialization,
            $options: "i",
        }
    }
    if (minFee || maxFee) {
        query.consultationFee = {};
        if (minFee) {
            query.consultationFee.$gte = Number(minFee);
        }
        if (maxFee) {
            query.consultationFee.$lte = Number(maxFee);
        }
    }
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    const allowedSortFields = [ "consultationFee", "experience", ];
    const sortBy = queryParams.sortBy;
    const order = queryParams.order;
    const sortQuery = {};
    if ( sortBy && allowedSortFields.includes(sortBy) ) {
        sortQuery[sortBy] = order === "asc" ? 1 : -1;
    }
    const search = queryParams.search;
    const requiredDoctors = await DoctorProfile.find(query).select("user specialization experience consultationFee profilePicture clinicAddress",).populate({
            path: "user",
            select: "name",
            match: search ? { name: { $regex: search, $options: "i", }, } : {}, }).sort(sortQuery).skip(skip).limit(limit).lean();
    const filteredDoctors = requiredDoctors.filter((doctor) => doctor.user,);

    // Pagination count becomes inaccurate when searching by user name
    // because populate().match() filters after the query.
    // Replace this implementation with an aggregation pipeline later.

    const totalDoctors = await DoctorProfile.countDocuments(query);
    return {
        doctors: filteredDoctors,
        pagination: {
            page,
            limit,
            total: totalDoctors,
            totalPages: Math.ceil(totalDoctors / limit),
        },
    };
};

export const getDoctorDetailsService = async (doctorId) => {
    const [doctorProfile, availability] = await Promise.all([
        DoctorProfile.findOne({ user: doctorId,}).select("user specialization experience consultationFee clinicAddress bio profilePicture").populate({ path: "user", select: "name", }).lean(),
        DoctorAvailability.findOne({ doctor: doctorId, }).select("availableDays slotDuration").lean(),]);
    if (!doctorProfile) {
        throw new NotFoundError("Doctor not found");
    }
    return {
        doctor: doctorProfile,
        availability,
    };
};

export const generateSlotsService = (startTime, endTime, slotDuration,) => {
    const slots = [];
    let [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    let current = new Date();
    current.setHours(startHour, startMinute, 0, 0);
    const end = new Date();
    end.setHours(endHour, endMinute, 0, 0);
    while (current < end) {
        const hours = current.getHours().toString().padStart(2, "0");
        const minutes = current.getMinutes().toString().padStart(2, "0");
        slots.push(`${hours}:${minutes}`);
        current.setMinutes(current.getMinutes() + slotDuration,);
    }
    return slots;
};

export const getAvailableSlotsService = async (doctorId, selectedDate) => {
    const doctorAvailability = await DoctorAvailability.findOne({ doctor: doctorId });
    if (!doctorAvailability) {
        throw new NotFoundError("Doctor availability not found",);
    }
    if (!doctorAvailability.isActive) {
        return {
            date: selectedDate,
            isBookable: false,
            reason: "Doctor is currently not accepting appointments",
            availableSlots: [],
        };
    }
    const weekday = new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", }).toLowerCase();
    if (!doctorAvailability.availableDays.includes(weekday)) {
        return {
            date: selectedDate,
            isBookable: false,
            reason: "Doctor unavailable on selected day",
            availableSlots: [],
        };
    }
    const blockedDate = await AvailabilityException.findOne( { doctor: doctorId, "blockedDates.blockedDate": selectedDate, }, { "blockedDates.$": 1, } );
    if (blockedDate) {
        return {
            date: selectedDate,
            isBookable: false,
            reason: blockedDate.blockedDates[0].reason,
            availableSlots: [],
        };
    }
    const slots = generateSlotsService(doctorAvailability.startTime, doctorAvailability.endTime, doctorAvailability.slotDuration,);
    const bookedAppointments = await Appointment.find({ doctor: doctorId, appointmentDate: selectedDate, status: { $ne: "cancelled" }, },).select("bookedSlot -_id").lean();;
    const bookedSlots = bookedAppointments.map((appointment) => appointment.bookedSlot,);
    const availableSlots = slots.filter((slot) => !bookedSlots.includes(slot),);
    return {
        date: selectedDate,
        isBookable: true,
        reason: null,
        availableSlots,
    };
};