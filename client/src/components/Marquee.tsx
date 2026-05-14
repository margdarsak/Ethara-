import React from 'react';
import { LayoutDashboard, CheckCircle2, Users, Zap, Rocket, Shield, BarChart2, Clock } from 'lucide-react';

const items = [
  { icon: <LayoutDashboard size={14} />, text: "Organized Projects", color: "var(--accent)" },
  { icon: <CheckCircle2 size={14} />, text: "Real-time Tracking", color: "#10b981" },
  { icon: <Users size={14} />, text: "Role-based Access", color: "#f59e0b" },
  { icon: <Zap size={14} />, text: "Team Collaboration", color: "#8b5cf6" },
  { icon: <Rocket size={14} />, text: "Seamless Workflow", color: "#3b82f6" },
  { icon: <Shield size={14} />, text: "Secure Data", color: "#ef4444" },
  { icon: <BarChart2 size={14} />, text: "Task Analytics", color: "#06b6d4" },
  { icon: <Clock size={14} />, text: "Smart Deadlines", color: "#ec4899" },
];

const Marquee = () => {
  const doubledItems = [...items, ...items, ...items, ...items];

  return (
    <div className="marquee-wrapper">
      <div className="marquee-container">
        <div className="marquee-content">
          {doubledItems.map((item, index) => (
            <div key={index} className="marquee-item">
              <span className="marquee-icon" style={{ color: item.color }}>{item.icon}</span>
              <span className="marquee-text">{item.text}</span>
              <span className="marquee-dot">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
