import mongoose from "mongoose";
import "./config/env.js";
import Admin from "./models/Admin.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@jansathi.gov.in";
    const password = "Admin@123";
    const adminData = {
      name: "Test Admin",
      email,
      password,
      role: "National",
      phoneNumber: "9876543210",
      isActive: true,
      permissions: [
        "view_complaints",
        "assign_complaints",
        "manual_review",
        "update_status",
        "manage_admins",
        "view_analytics"
      ]
    };

    let admin = await Admin.findOne({ email });
    if (admin) {
      Object.assign(admin, adminData);
      await admin.save();
    } else {
      admin = await Admin.create(adminData);
    }

    console.log("Admin seed completed successfully!");
    console.log("Email:", admin.email);
    console.log("Password:", password);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

seedAdmin();