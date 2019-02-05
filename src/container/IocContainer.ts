import 'reflect-metadata';
import { Container } from 'inversify';
import SERVICES      from '../services/SERVICES';

// Interfaces
import Course from '../interfaces/Course';
import Lesson from '../interfaces/Lesson';
import Quiz   from '../interfaces/Quiz';
import Unit   from '../interfaces/Unit';

// Providers
import CoursesProvider from '../providers/CoursesProvider';
import LessonsProvider from '../providers/LessonsProvider';
import QuizzesProvider from '../providers/QuizzesProvider';
import UnitsProvider   from '../providers/UnitsProvider';

const iocContainer = new Container();

// Bind Providers to Interfaces
iocContainer.bind<Course>(SERVICES.COURSE).to(CoursesProvider);
iocContainer.bind<Lesson>(SERVICES.LESSON).to(LessonsProvider);
iocContainer.bind<Quiz>(SERVICES.QUIZ).to(QuizzesProvider);
iocContainer.bind<Unit>(SERVICES.UNIT).to(UnitsProvider);

export default iocContainer;
