const validateSignupDetails = (name, address, email, password) => {
  const errors = [];

  // Min 20 characters, Max 60 characters
  if (!name || name.length < 20) {
    errors.push("Name must be at least 20 characters long.");
  }
  if (name && name.length > 60) {
    errors.push("Name must not exceed 60 characters.");
  }
  if (!address) {
    errors.push("Address is required.");
  }
  // Max 400 characters
  if (address && address.length > 400) {
    errors.push("Address must not exceed 400 characters.");
  }

  // Standard email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Email must be a valid email address.");
  }

  // 8-16 characters, at least one uppercase letter and one special character
  if (!password || password.length < 8 || password.length > 16) {
    errors.push("Password must be between 8 and 16 characters long.");
  }
  if (password && !/[A-Z]/.test(password)) {
    errors.push("Password must include at least one uppercase letter.");
  }
  if (password && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must include at least one special character.");
  }

  return errors;
};

export { validateSignupDetails };
