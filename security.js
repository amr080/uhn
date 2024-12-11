// security.js
class DDoSProtection {
    constructor() {
        this.requests = new Map();
        this.blockedIPs = new Set();
        this.limit = 100;  // Max requests per window
        this.timeWindow = 10000; // 10 second window
        this.banTime = 300000; // 5 minute ban
    }

    checkRequest(ip) {
        const now = Date.now();
        
        // Check if IP is banned
        if(this.blockedIPs.has(ip)) {
            return false;
        }

        // Get request history
        const history = this.requests.get(ip) || [];
        const recentRequests = history.filter(time => now - time < this.timeWindow);

        // Update request history
        this.requests.set(ip, [...recentRequests, now]);

        // Check if limit exceeded
        if(recentRequests.length >= this.limit) {
            this.blockedIPs.add(ip);
            setTimeout(() => this.blockedIPs.delete(ip), this.banTime);
            return false;
        }

        return true;
    }

    // Clean up old requests periodically
    cleanup() {
        const now = Date.now();
        for(const [ip, times] of this.requests) {
            const recentRequests = times.filter(time => now - time < this.timeWindow);
            if(recentRequests.length === 0) {
                this.requests.delete(ip);
            } else {
                this.requests.set(ip, recentRequests);
            }
        }
    }
}

// Initialize protection
const ddosProtection = new DDoSProtection();

// Cleanup every minute
setInterval(() => ddosProtection.cleanup(), 60000);

// Export for use
export { ddosProtection };