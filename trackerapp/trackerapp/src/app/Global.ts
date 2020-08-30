export class Global {
    public static BASE_URL = (<any>window)._env.API_URL;
    public static SIGNUP_URL = Global.BASE_URL + '/user/signup';
    public static LOGIN_URL = Global.BASE_URL + '/user/login';
    public static TASK_OUT_URL = Global.BASE_URL + '/task/out';
    public static TASK_LOG_URL = Global.BASE_URL + '/task/log';
}