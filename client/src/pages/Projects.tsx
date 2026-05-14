import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { FolderPlus, Users, Edit, Trash2 } from 'lucide-react';
import Marquee from '../components/Marquee';

interface Project {
  id: string;
  name: string;
  description: string;
  _count: { tasks: number; members: number };
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  // Project form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskProjectId, setTaskProjectId] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
    if (user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProjectId) {
        await api.put(`/projects/${editingProjectId}`, { name, description, memberIds });
      } else {
        await api.post('/projects', { name, description, memberIds });
      }
      closeProjectModal();
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const closeProjectModal = () => {
    setShowModal(false);
    setEditingProjectId(null);
    setName('');
    setDescription('');
    setMemberIds([]);
  };

  const handleEditClick = async (projectId: string) => {
    try {
      const res = await api.get(`/projects/${projectId}`);
      const projectDetails = res.data;
      setEditingProjectId(projectId);
      setName(projectDetails.name);
      setDescription(projectDetails.description || '');
      setMemberIds(projectDetails.members.map((m: any) => m.userId));
      setShowModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks. This action cannot be undone.')) return;
    try {
      await api.delete(`/projects/${projectId}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { 
        title: taskTitle, 
        description: taskDesc, 
        projectId: taskProjectId, 
        assigneeId: taskAssigneeId || null,
        dueDate: taskDueDate || null 
      });
      setShowTaskModal(false);
      setTaskTitle('');
      setTaskDesc('');
      setTaskProjectId('');
      setTaskAssigneeId('');
      setTaskDueDate('');
      // Optionally fetch tasks if tasks are displayed here, but this is projects page.
      fetchProjects(); // to update task counts
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex-between mb-4 flex-responsive">
        <h1>Projects</h1>
        {user?.role === 'ADMIN' && (
          <div className="flex-responsive" style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => setShowTaskModal(true)}>
              New Task
            </button>
            <button className="btn btn-primary" onClick={() => { closeProjectModal(); setShowModal(true); }}>
              <FolderPlus size={20} /> New Project
            </button>
          </div>
        )}
      </div>

      <div className="dashboard-grid">
        {projects.map(project => (
          <div key={project.id} className="card sliding-border">
            <div className="flex-between mb-2">
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{project.name}</h3>
              {user?.role === 'ADMIN' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleEditClick(project.id)} title="Edit Project">
                    <Edit size={16} />
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', color: 'var(--danger)' }} onClick={() => handleDeleteProject(project.id)} title="Delete Project">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-muted text-sm mb-4">{project.description || 'No description provided.'}</p>
            
            <div className="flex-between text-sm" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Users size={16} /> {project._count.members} Members
              </div>
              <div style={{ color: 'var(--accent)' }}>
                {project._count.tasks} Tasks
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div style={{ gridColumn: '1 / -1' }} className="glass-panel text-center text-muted">
            <p>No projects found.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-panel modal-panel" style={{ width: "100%", maxWidth: "500px" }}>
            <h2 className="mb-4">{editingProjectId ? 'Edit Project' : 'Create New Project'}</h2>
            <form onSubmit={handleSubmitProject}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} rows={3}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Members</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto', padding: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  {users.length > 0 ? users.map(u => (
                    <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input 
                        type="checkbox" 
                        checked={memberIds.includes(u.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMemberIds([...memberIds, u.id]);
                          } else {
                            setMemberIds(memberIds.filter(id => id !== u.id));
                          }
                        }}
                        style={{ cursor: 'pointer', accentColor: 'var(--accent)', width: '16px', height: '16px' }}
                      />
                      <span>{u.name} <span className="text-muted">({u.email})</span></span>
                    </label>
                  )) : (
                    <div className="text-muted text-sm text-center py-2">No users found to add.</div>
                  )}
                </div>
              </div>
              <div className="flex-between mt-4">
                <button type="button" className="btn btn-secondary" onClick={closeProjectModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingProjectId ? 'Update Project' : 'Create Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-panel modal-panel" style={{ width: "100%", maxWidth: "500px" }}>
            <h2 className="mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input type="text" className="form-input" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} rows={2}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Project</label>
                <select className="form-select" value={taskProjectId} onChange={e => setTaskProjectId(e.target.value)} required>
                  <option value="">Select Project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assignee</label>
                <select className="form-select" value={taskAssigneeId} onChange={e => setTaskAssigneeId(e.target.value)}>
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input type="date" className="form-input" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} />
              </div>
              <div className="flex-between mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div style={{ marginTop: '4rem' }}>
        <Marquee />
      </div>
    </div>
  );
};

export default Projects;
