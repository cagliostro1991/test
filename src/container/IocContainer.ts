import 'reflect-metadata';
import { Container } from 'inversify';
import SERVICES      from '../services/SERVICES';

// Interfaces
import Course from '../interfaces/Course';
import Lesson from '../interfaces/Lesson';
import Quiz   from '../interfaces/Quiz';
import Unit   from '../interfaces/Unit';
import Auth   from '../interfaces/Auth';
import User   from '../interfaces/User';

// Providers
import CoursesProvider from '../providers/CoursesProvider';
import LessonsProvider from '../providers/LessonsProvider';
import QuizzesProvider from '../providers/QuizzesProvider';
import UnitsProvider   from '../providers/UnitsProvider';
import AuthProvider    from '../providers/AuthProvider';
import UserProvider    from '../providers/UserProvider';

const iocContainer = new Container();

// Bind Providers to Interfaces
iocContainer.bind<Course>(SERVICES.COURSE).to(CoursesProvider);
iocContainer.bind<Lesson>(SERVICES.LESSON).to(LessonsProvider);
iocContainer.bind<Quiz>(SERVICES.QUIZ).to(QuizzesProvider);
iocContainer.bind<Unit>(SERVICES.UNIT).to(UnitsProvider);
iocContainer.bind<Auth>(SERVICES.AUTH).to(AuthProvider);
iocContainer.bind<User>(SERVICES.USER).to(UserProvider);

export default iocContainer;
