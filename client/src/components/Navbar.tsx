import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut, CheckCircle2 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div className="mb-4 flex-between">
        <h2 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={24} />
          EtharaTask
        </h2>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted">Welcome back,</p>
        <p style={{ fontWeight: 600 }}>{user?.name}</p>
        <span className={`status-badge ${user?.role === 'ADMIN' ? 'status-in-progress' : 'status-done'}`} style={{ marginTop: '0.5rem', display: 'inline-block' }}>
          {user?.role}
        </span>
      </div>

      <nav style={{ flex: 1 }}>
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FolderKanban size={20} />
          Projects
        </NavLink>
      </nav>

      <button onClick={logout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
};

export default Navbar;
