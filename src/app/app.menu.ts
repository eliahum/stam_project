import { MenuItem } from '../spa/services/menu.service';
export const AppMenuItems: Array<MenuItem> = [
    {
        text: 'Cars1',
        icon: 'src/imgs/car.png',
        route: null,
        submenu:
            [
                {
                    text: 'Select',
                    icon: 'src/imgs/car.png',
                    route: null,
                    submenu: [
                        {
                            text: 'Ferrary',
                            icon: 'src/imgs/car.png',
                            route: '/car-detail/Ferrary',
                            submenu: null
                        },
                        {
                            text: 'Bugatti',
                            icon: 'src/imgs/car.png',
                            route: '/car-detail/Bugatti',
                            submenu: null
                        },
                        {
                            text: 'Lamborghini',
                            icon: 'src/imgs/car.png',
                            route: '/car-detail/Lamborghini',
                            submenu: null
                        },
                        {
                            text: 'Mazeratti',
                            icon: 'src/imgs/car.png',
                            route: '/car-detail/Mazeratti',
                            submenu: null
                        },
                    ]
                },
                {
                    text: 'Price top',
                    icon: 'src/imgs/car.png',
                    route: '/car-list/1',
                    submenu: null
                },
                {
                    text: 'Top 3',
                    icon: 'src/imgs/car.png',
                    route: '/car-list/3',
                    submenu: null
                },
                {
                    text: 'Top 5',
                    icon: 'src/imgs/car.png',
                    route: '/car-list/5',
                    submenu: null
                }
            ]
    },
    {
        text: 'Maintenance',
        icon: 'src/imgs/settings.png',
        route: null,
        submenu: [
            {
                text: 'Car maint',
                icon: 'src/imgs/settings.png',
                route: '/car-maint',
                submenu: null
            },
            {
                text: 'Settings',
                icon: 'src/imgs/settings.png',
                route: '/settings',
                submenu: null
            }
        ]
    },
    {
        text: 'Home',
        icon: 'src/imgs/home.png',
        route: '/home',
        submenu: null
    },
];