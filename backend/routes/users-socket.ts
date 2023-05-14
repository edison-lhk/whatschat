import { loginUser, logoutUser, onlineNotification, offlineNotification } from "../controllers/users-socket";

const usersSocketRouter = (io: any, socket: any) => {
    socket.on('login', loginUser(socket));
    socket.on('online-notification', onlineNotification(socket));
    socket.on('disconnect', logoutUser(socket));
    socket.on('offline-notification', offlineNotification(socket));
};

export default usersSocketRouter;