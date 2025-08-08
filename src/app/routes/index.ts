import { Router } from 'express';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { StudentRoutes } from '../modules/Student/student.route';
import { UserRoutes } from '../modules/User/user.route';
import { SupervisorRoutes } from '../modules/Supervisor/supervisor.route';
import { QuestionRoutes } from '../modules/question/question.routes';
import { ExamRoutes } from '../modules/exam/exm.routes';
import { CertificateRoutes } from '../modules/certificate/cretificate.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },

  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/supervisor',
    route: SupervisorRoutes,
  },
  {
    path: '/question',
    route: QuestionRoutes,
  },
  {
    path: '/exam',
    route: ExamRoutes,
  },
  {
    path: '/certificate',
    route: CertificateRoutes,
  },

  {
    path: '/auth',
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
