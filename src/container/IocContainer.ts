import 'reflect-metadata';
import { Container } from 'inversify';
import SERVICES      from '../services/services';

// Interfaces
import Cookie                       from '../interfaces/Cookie';

// Providers
import CookiesProvider     from '../providers/cookies-provider/CookiesProvider';

let IocContainer = new Container();

// Bind Providers to Interfaces
IocContainer.bind<Cookie>(SERVICES.COOKIE).to(CookiesProvider);

export default IocContainer;
