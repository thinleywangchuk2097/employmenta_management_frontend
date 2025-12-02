import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import IndexEmployee from './employee/IndexEmployee';
import CreateEmployee from './employee/CreateEmployee';
import EditEmployee from './employee/EditEmployee';
import Layout from './layout/Layout';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/employees" replace />} />
        <Route element={<Layout />}>
          <Route path="/employees" element={<IndexEmployee />} />
          <Route path="/employees/new" element={<CreateEmployee />} />
          <Route path="/employees/:id/edit" element={<EditEmployee />} />
        </Route>
        <Route path="*" element={<Navigate to="/employees" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
