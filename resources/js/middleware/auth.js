import axios from '@/utils/axios';

export default function auth({ next }) {
    // ตรวจสอบและตั้งค่า token ทุกครั้งที่มีการเปลี่ยนหน้า
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return next();
}
