import mongoose from 'mongoose';

const DiagnosisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    symptoms: {
        type: String,
        required: true,
    },
    aiAnalysis: {
        summary: String,
        differential_diagnoses: [{
            disease_name: String,
            confidence_percent: Number,
            key_supporting_symptoms: [String],
            suggested_tests: [String],
        }],
        severity: {
            type: String,
            enum: ['Normal', 'Moderate', 'Severe', 'Emergency'],
        },
        reason_for_classification: String,
        patient_advice: {
            steps: [String],
            monitoring: [String],
            home_care: [String],
            warning_signs: [String],
        },
        doctor_report: {
            clinical_summary: String,
            differential_diagnoses_reasoning: String,
            recommended_tests: [String],
            urgency_level: String,
            treatment_direction: String,
            red_flags: [String],
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Diagnosis || mongoose.model('Diagnosis', DiagnosisSchema);
