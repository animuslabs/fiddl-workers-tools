export function formatUptime(uptimeInSeconds: number): string {
    let remainingSeconds = uptimeInSeconds;
  
    const days = Math.floor(remainingSeconds / (24 * 3600));
    remainingSeconds %= 24 * 3600;
  
    const hours = Math.floor(remainingSeconds / 3600);
    remainingSeconds %= 3600;
  
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
  
    let uptimeString = '';
    if (days > 0) {
      uptimeString += `${days} day${days !== 1 ? 's' : ''} `;
    }
    if (hours > 0) {
      uptimeString += `${hours} hour${hours !== 1 ? 's' : ''} `;
    }
    if (minutes > 0) {
      uptimeString += `${minutes} minute${minutes !== 1 ? 's' : ''} `;
    }
    if (seconds > 0 || uptimeString === '') {
      uptimeString += `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
    return uptimeString.trim();
  }
  

  /**
 * Converts milliseconds to minutes.
 * @param ms - The time in milliseconds.
 * @returns The equivalent time in minutes, formatted to two decimal places.
 */
export function millisecondsToMinutes(ms: number): string {
  const minutes = ms / 60000;
  return minutes.toFixed(2); // Formats the number to two decimal places
}
