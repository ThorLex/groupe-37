import axios from '@/lib/axios';

const apiService = {
  preEnroll: (formData: FormData) => axios.post('/api/preenroll', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

export default apiService;
