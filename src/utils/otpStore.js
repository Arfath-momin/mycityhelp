// In-memory store for development
// In production, use Redis or a database
const store = {
  otps: new Map(),
  set: function(email, data) {
    this.otps.set(email, data);
  },
  get: function(email) {
    return this.otps.get(email);
  },
  delete: function(email) {
    return this.otps.delete(email);
  },
  // Clean up expired OTPs periodically
  cleanup: function() {
    const now = Date.now();
    for (const [email, data] of this.otps.entries()) {
      if (now > data.expiresAt) {
        this.otps.delete(email);
      }
    }
  }
};

// Run cleanup every minute
setInterval(() => store.cleanup(), 60 * 1000);

export default store; 