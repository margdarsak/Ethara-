import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut, CheckCircle2 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div className="logo-container">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent), #ffb199)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(255, 8, 68, 0.2)', flexShrink: 0 }}>
            <CheckCircle2 size={20} />
          </div>
          <span className="logo-text" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>EtharaTask</span>
        </Link>
      </div>

      <div className="user-info mb-4">
        <p className="text-sm text-muted">Welcome back,</p>
        <p style={{ fontWeight: 600 }}>{user?.name}</p>
        <span className={`status-badge ${user?.role === 'ADMIN' ? 'status-in-progress' : 'status-done'}`} style={{ marginTop: '0.5rem', display: 'inline-block' }}>
          {user?.role}
        </span>
      </div>

      <nav style={{ flex: 1 }}>
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FolderKanban size={20} />
          <span>Projects</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
