export const getTime = () => {
    const now = new Date();
    const options = {
        timeZone: 'Asia/Kolkata', // Timezone for IST
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // Use 24-hour format
    };
    const istTime = now.toLocaleTimeString('en-IN', options);
    return istTime;
}