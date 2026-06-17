import DoctorAvailability from "./doctorAvailability.model.js"
import Appointment from "../appointment/appointment.model.js"
import { NotFoundError } from '../../utils/error.js'

export const generateSlotsService = ( startTime, endTime, slotDuration,) =>
{
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
        current.setMinutes( current.getMinutes() + slotDuration, );
    }
    return slots;
};

export const getAvailableSlotsService = async ( doctor, selectedDate ) => {
    const doctorAvailability = await DoctorAvailability.findOne({ doctor });
    if (!doctorAvailability) {
        throw new NotFoundError( "Doctor availability not found", );
    }
    const weekday = new Date(selectedDate) .toLocaleDateString("en-US", { weekday: "long", }) .toLowerCase();
    if ( !doctorAvailability.availableDays.includes( weekday, ) ) {
        throw new NotFoundError("Doctor unavailable on selected day",);
    }
    const slots = generateSlotsService( doctorAvailability.startTime, doctorAvailability.endTime, doctorAvailability.slotDuration, );
    const bookedAppointments = await Appointment.find( { doctor, appointmentDate: selectedDate, status: { $ne: "cancelled" }, }, { bookedSlot: 1, _id: 0, }, );
    const bookedSlots = bookedAppointments.map( (appointment) => appointment.bookedSlot, );
    const availableSlots = slots.filter( (slot) => !bookedSlots.includes(slot), );
    return availableSlots;
  };