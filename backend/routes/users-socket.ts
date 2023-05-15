import { loginUser, logoutUser, offlineNotification } from "../controllers/users-socket";

const usersSocketRouter = (io: any, socket: any) => {
    socket.on('login', loginUser(socket));
    socket.on('disconnecting', offlineNotification(socket));
    socket.on('disconnect', logoutUser(socket));
};

export default usersSocketRouter;