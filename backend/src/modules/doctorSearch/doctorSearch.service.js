import DoctorProfile from "../doctor/doctorProfile.model.js";

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
    const sortBy = queryParams.sortBy;
    const order = queryParams.order;
    const sortQuery = {};
    if (sortBy) {
        sortQuery[sortBy] = order === "asc" ? 1 : -1;
    }
    const search = queryParams.search;
    const requiredDoctors = await DoctorProfile.find(query).populate({
            path: "user",
            select: "name email",
            match: search ? { name: { $regex: search, $options: "i", }, } : {}, }).sort(sortQuery).skip(skip).limit(limit);
    const filteredDoctors = requiredDoctors.filter((doctor) => doctor.user,);

    return filteredDoctors;
};