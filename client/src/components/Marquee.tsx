import { LayoutDashboard, CheckCircle2, Users, Zap, Rocket } from 'lucide-react';

const Marquee = () => {
  const items = [
    { icon: <LayoutDashboard size={14} />, text: "Organized Projects" },
    { icon: <CheckCircle2 size={14} />, text: "Real-time Tracking" },
    { icon: <Users size={14} />, text: "Role-based Access" },
    { icon: <Zap size={14} />, text: "Team Collaboration" },
    { icon: <Rocket size={14} />, text: "Seamless Workflow" },
  ];

  // Double the items to ensure seamless loop
  const doubledItems = [...items, ...items, ...items, ...items];

  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {doubledItems.map((item, index) => (
          <div key={index} className="marquee-item">
            {item.icon}
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
