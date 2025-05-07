import { type RouteObject, useRoutes } from 'react-router-dom';
import Home from '../views/home';
import Login from '../views/Login';
import Registration from '../views/Registration';

/**
 * 公共路由
 */
export const constantRoutes: RouteObject[] = [
    {
        path: '/',
        id: 'Home',
        element: <Home />,
    },
    {
        path: '/Login',
        id: 'Login',
        element: <Login />,
    },
    {
        path: '/Regist',
        id: 'Regist',
        element: <Registration />,
    },
];

// 创建一个可以被 React 应用程序使用的路由实例
const router = () => {
    const routes = useRoutes(constantRoutes);
    return routes;
};

export default router;