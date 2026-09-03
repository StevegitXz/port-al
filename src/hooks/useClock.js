import { useState, useEffect } from 'react';

export function useClock(timezone = 'America/Rio_Branco') {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    function update() {
      try {
        const now = new Date();
        const timeFormatted = new Intl.DateTimeFormat('pt-BR', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(now);

        const dateFormatted = new Intl.DateTimeFormat('pt-BR', {
          timeZone: timezone,
          weekday: 'short',
          day: '2-digit',
          month: 'short'
        }).format(now);

        setTimeStr(timeFormatted);
        setDateStr(dateFormatted);
      } catch (err) {
        // Fallback
        const now = new Date();
        setTimeStr(now.toLocaleTimeString());
      }
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return { timeStr, dateStr };
}
