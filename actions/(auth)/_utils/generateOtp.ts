export function generateOtp() {
  const otpLength = 6;

  const otpDigits = Array.from({ length: otpLength }, () =>
    Math.floor(Math.random() * 10)
  );

  const otp = otpDigits.join("");

  return otp;
}
