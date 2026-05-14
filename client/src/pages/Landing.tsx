import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Users, LayoutDashboard, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Navbar for Landing Page */}
      <header className="landing-header" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', background: 'var(--bg-glass)', backdropFilter: 'blur(16px)', sticky: 'top', zIndex: 100 }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent), #ffb199)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
            <CheckCircle2 size={20} />
          </div>
          <span className="logo-text">EtharaTask</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Login</Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Sign Up</Link>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background Glows */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '400px', height: '400px', background: 'rgba(255, 8, 68, 0.15)', filter: 'blur(100px)', borderRadius: '50%', zIndex: -1 }}></div>
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '300px', height: '300px', background: 'rgba(255, 177, 153, 0.1)', filter: 'blur(80px)', borderRadius: '50%', zIndex: -1 }}></div>

        <h1 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: '800px' }}>
          Manage your team's tasks <br/>
          <span className="text-gradient">with ease.</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>
          A powerful, intuitive platform to assign tasks, track progress, and collaborate seamlessly across your entire organization.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Get Started Free <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Login
          </Link>
        </div>

        {/* Features Preview */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '5rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '1000px' }}>
          <div className="glass-panel sliding-border" style={{ flex: '1 1 300px', padding: '2rem', textAlign: 'left' }}>
            <div style={{ background: 'rgba(255, 8, 68, 0.1)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginBottom: '1.5rem' }}>
              <LayoutDashboard size={24} />
            </div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Organized Projects</h3>
            <p className="text-muted" style={{ lineHeight: 1.6 }}>Create distinct projects and keep all related tasks neatly organized in one central location.</p>
          </div>
          <div className="glass-panel sliding-border" style={{ flex: '1 1 300px', padding: '2rem', textAlign: 'left' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', marginBottom: '1.5rem' }}>
              <CheckCircle2 size={24} />
            </div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Real-time Tracking</h3>
            <p className="text-muted" style={{ lineHeight: 1.6 }}>Monitor task statuses (Todo, In Progress, Done) and ensure your team hits every deadline.</p>
          </div>
          <div className="glass-panel sliding-border" style={{ flex: '1 1 300px', padding: '2rem', textAlign: 'left' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)', marginBottom: '1.5rem' }}>
              <Users size={24} />
            </div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Role-based Access</h3>
            <p className="text-muted" style={{ lineHeight: 1.6 }}>Assign Admin and Member roles to securely manage who can view, edit, or assign tasks.</p>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
        <p>&copy; {new Date().getFullYear()} Team Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
