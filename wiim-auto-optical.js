const timersPromises = require('timers/promises');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const WIIM_IP = '192.168.0.130';

const log = (...args) => {
  console.log(`[${new Date().toISOString()}]`, ...args)
}

const checker = async () => {
  try {
    log('Cheking wiim...');
    const response = await fetch(`https://${WIIM_IP}/httpapi.asp?command=getPlayerStatus`, {
      signal: AbortSignal.timeout(5 * 1000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    log(`Wiim mode: ${data.mode}`);

    // 49 - HDMI
    // 43 - OPTICAL

    if (String(data.mode) === '49') {
      log(`HDMI detected, switching to OPTICAL`);

      await timersPromises.setTimeout(1000);

      await fetch(`https://${WIIM_IP}/httpapi.asp?command=setPlayerCmd:switchmode:optical`);
    }
  } catch (error) {
    log(`Error in checker: ${error.message} (${error?.cause?.code || '-'})`);
  } finally {
    setTimeout(checker, 10 * 1000);
  }
};

checker();
