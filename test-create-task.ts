import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function test() {
  try {
    // 1. Login to get token
    console.log('Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'ravir@example.com', // I'll assume this is the admin email based on context
      password: 'password' // I hope this is the password
    });
    const token = loginRes.data.token;
    console.log('Logged in!');

    // 2. Get projects
    const projectsRes = await axios.get(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const project = projectsRes.data.find((p: any) => p.name === 'Leads Management');
    
    if (!project) {
      console.error('Leads Management project not found');
      return;
    }

    // 3. Create task
    console.log('Creating task for Leads Management...');
    const taskRes = await axios.post(`${API_URL}/tasks`, {
      title: 'Test Task from Script',
      description: 'Test description',
      projectId: project.id,
      assigneeId: null,
      dueDate: null
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Task created!', taskRes.data);
  } catch (err: any) {
    console.error('Error:', err.response?.data || err.message);
  }
}

test();
