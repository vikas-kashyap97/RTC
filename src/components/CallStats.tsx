import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

interface CallStatsProps {
  connection: RTCPeerConnection | null;
}

export function CallStats({ connection }: CallStatsProps) {
  const [stats, setStats] = useState({
    bitrate: 0,
    packetsLost: 0,
    latency: 0,
  });

  useEffect(() => {
    if (!connection) return;

    const interval = setInterval(async () => {
      const stats = await connection.getStats();
      let bitrate = 0;
      let packetsLost = 0;
      let latency = 0;

      stats.forEach(report => {
        if (report.type === 'inbound-rtp' && report.kind === 'audio') {
          bitrate = report.bytesReceived * 8 / 1000; // kbps
          packetsLost = report.packetsLost || 0;
        }
        if (report.type === 'candidate-pair' && report.state === 'succeeded') {
          latency = report.currentRoundTripTime * 1000 || 0; // ms
        }
      });

      setStats({ bitrate, packetsLost, latency });
    }, 1000);

    return () => clearInterval(interval);
  }, [connection]);

  return (
    <div className="bg-gray-50 p-3 rounded-lg text-sm">
      <div className="flex items-center gap-2 text-purple-600 mb-2">
        <Activity size={16} />
        <span className="font-medium">Call Statistics</span>
      </div>
      <div className="space-y-1 text-gray-600">
        <p>Bitrate: {stats.bitrate.toFixed(1)} kbps</p>
        <p>Packets Lost: {stats.packetsLost}</p>
        <p>Latency: {stats.latency.toFixed(0)} ms</p>
      </div>
    </div>
  );
}