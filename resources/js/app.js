import axios from '@/utils/axios';

// ตรวจสอบ token ใน localStorage และตั้งค่า header ถ้ามี
const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// คุณสามารถเพิ่มโค้ดที่จำเป็นอื่นๆ ที่นี่
