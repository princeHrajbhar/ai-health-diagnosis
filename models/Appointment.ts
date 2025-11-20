import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    diagnosisId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Diagnosis',
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending',
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
