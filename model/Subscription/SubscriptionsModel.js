const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    startDate: { type: Date, required: true, default: Date.now }, // Subscription start
    endDate: { type: Date, required: true }, // Expiration date
    status: { type: String, enum: ['Active', 'Expired'], default: 'Active' },
}, { timestamps: true });

// Automatically set endDate based on the package validity
subscriptionSchema.pre("save", async function (next) {
    if (!this.endDate) {
        const packageData = await mongoose.model("Package").findById(this.package);
        if (packageData) {
            this.endDate = new Date(this.startDate);
            this.endDate.setDate(this.startDate.getDate() + packageData.validity);
        }
    }
    next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);  

module.exports = Subscription;