import crypto from 'crypto';
export function verifyGithubSignature(secret, payload, signature){
    // starting the signature hash generating machine with the given secret
    const hmac = crypto.createHmac('sha256', secret);
    // feeding the data to the machine and getting the final output in hexadecimal format
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    // using timeSafeEqual method to avoid timing based guesses of password length by attackers
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
};