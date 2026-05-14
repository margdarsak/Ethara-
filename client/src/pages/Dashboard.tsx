import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, Clock, CalendarDays, UserMinus } from 'lucide-react';
import Marquee from '../components/Marquee';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  project: { name: string };
  assignee?: { name: string };
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (taskId: string, newStatus: string) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const unassignTask = async (taskId: string) => {
    try {
      await api.put(`/tasks/${taskId}/unassign`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusClass = (status: string) => {
    if (status === 'TODO') return 'status-todo';
    if (status === 'IN_PROGRESS') return 'status-in-progress';
    if (status === 'DONE') return 'status-done';
    return '';
  };

  const pendingCount = tasks.filter(t => t.status !== 'DONE').length;

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card sliding-border" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(255, 8, 68, 0.1)', padding: '0.75rem', borderRadius: '50%', color: 'var(--accent)', flexShrink: 0 }}>
            <CalendarDays size={22} />
          </div>
          <div>
            <h3 className="text-muted text-sm">Total Tasks</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{tasks.length}</p>
          </div>
        </div>
        <div className="stat-card sliding-border" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '50%', color: 'var(--warning)', flexShrink: 0 }}>
            <Clock size={22} />
          </div>
          <div>
            <h3 className="text-muted text-sm">Pending</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{pendingCount}</p>
          </div>
        </div>
        <div className="stat-card sliding-border" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '50%', color: 'var(--success)', flexShrink: 0 }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <h3 className="text-muted text-sm">Completed</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{tasks.length - pendingCount}</p>
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <h2 className="mb-4">Your Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-muted text-center" style={{ padding: '2rem' }}>No tasks assigned to you yet.</p>
        ) : (
          <div className="dashboard-grid">
            {tasks.map(task => (
              <div key={task.id} className="card sliding-border">
                <div className="flex-between mb-2">
                  <span className="text-sm text-muted">{task.project.name}</span>
                  <select 
                    className={`status-badge ${getStatusClass(task.status)}`}
                    style={{ border: 'none', outline: 'none', cursor: 'pointer', appearance: 'none', paddingRight: '0.5rem' }}
                    value={task.status}
                    onChange={(e) => updateStatus(task.id, e.target.value)}
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>
                <h3 className="mb-2" style={{ fontSize: '1.1rem' }}>{task.title}</h3>
                {task.description && <p className="text-muted text-sm mb-4">{task.description}</p>}
                
                <div className="flex-between text-sm mt-4">
                  <span style={{ color: 'var(--warning)' }}>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'}
                  </span>
                  {user?.role === 'ADMIN' && task.assignee && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span className="text-muted">Assigned to: {task.assignee.name}</span>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.2rem', border: 'none', background: 'transparent', color: 'var(--danger)', height: 'auto' }} 
                        onClick={() => unassignTask(task.id)}
                        title="Remove Assignee"
                      >
                        <UserMinus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ marginTop: '4rem' }}>
        <Marquee />
      </div>
    </div>
  );
};

export default Dashboard;
