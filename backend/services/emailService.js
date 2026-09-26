class EmailService {
  async sendOTP(email, otp) {
    console.log(`OTP for ${email}: ${otp}`);

    return {
      success: true,
      message: 'OTP service disabled temporarily'
    };
  }

  async sendComplaintConfirmation() {
    return {
      success: true
    };
  }

  async sendStatusUpdate() {
    return {
      success: true
    };
  }
}

export default new EmailService();