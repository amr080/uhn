// security.js
class DDoSProtection {
    constructor() {
        this.requests = new Map();
        this.blockedIPs = new Set();
        this.limit = 100;  
        this.timeWindow = 10000;
        this.banTime = 300000;
    }

    checkRequest(ip) {
        const now = Date.now();
        if(this.blockedIPs.has(ip)) return false;
        
        const history = this.requests.get(ip) || [];
        const recentRequests = history.filter(time => now - time < this.timeWindow);
        this.requests.set(ip, [...recentRequests, now]);
        
        if(recentRequests.length >= this.limit) {
            this.blockedIPs.add(ip);
            setTimeout(() => this.blockedIPs.delete(ip), this.banTime);
            return false;
        }
        return true;
    }

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
setInterval(() => ddosProtection.cleanup(), 60000);