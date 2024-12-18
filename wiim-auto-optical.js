process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const WIIM_IP = '192.168.0.130';

const checker = async () => {
    const response = await fetch(`https://${WIIM_IP}/httpapi.asp?command=getPlayerStatus`);
    const data = await response.json();

    if (String(data.mode) === '49') {
      console.log('HDMI detected, switching to OPTICAL');

      await fetch(`https://${WIIM_IP}/httpapi.asp?command=setPlayerCmd:switchmode:optical`);
    }

    setTimeout(checker, 15*1000);
}

checker();
