import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import JobsPage from "../pages/JobsPage";
import JobDetailPage from "../pages/JobDetailPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";
import MyApplicationsPage from "../pages/MyApplicationsPage";
import EmployerDashboardPage from "../pages/EmployerDashboardPage";
import EmployerStoreDetailPage from "../pages/EmployerStoreDetailPage";
import EmployerJobPostDetailPage from "../pages/EmployerJobPostDetailPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import HomeRedirect from "../components/common/HomeRedirect";
import MainLayout from "../components/layout/MainLayout";
import EmployerVerifyPage from "../pages/EmployerVerifyPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/jobs"
        element={
          <ProtectedRoute allowRoles={["USER", "ADMIN"]}>
            <MainLayout>
              <JobsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs/:id"
        element={
          <ProtectedRoute allowRoles={["USER", "ADMIN"]}>
            <MainLayout>
              <JobDetailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-applications"
        element={
          <ProtectedRoute allowRoles={["USER", "ADMIN"]}>
            <MainLayout>
              <MyApplicationsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowRoles={["USER", "ADMIN", "EMPLOYER"]}>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/employer"
        element={
          <ProtectedRoute allowRoles={["EMPLOYER", "ADMIN"]}>
            <MainLayout>
              <EmployerDashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/employer/stores/:storeId"
        element={
          <ProtectedRoute allowRoles={["EMPLOYER", "ADMIN"]}>
            <MainLayout>
              <EmployerStoreDetailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/employer/job-posts/:jobPostId"
        element={
          <ProtectedRoute allowRoles={["EMPLOYER", "ADMIN"]}>
            <MainLayout>
              <EmployerJobPostDetailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />

      <Route
        path="/employer-verify"
        element={
          <MainLayout>
            <EmployerVerifyPage />
          </MainLayout>
        }
      />
      
    </Routes>
  );
}

export default AppRoutes;