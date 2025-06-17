export const isNotEmpty = str => str?.trim() !== '';

export const isValidEmail = email =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhoneNumber = phone =>
  /^\+237[6-9]\d{8}$/.test(phone);

export const isStrongPassword = password =>
  /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(password);

// Basic sanitization against SQL injection-like inputs
export const isSafeInput = input =>
  !/('|--|;|\/\*|\*\/)/.test(input);
