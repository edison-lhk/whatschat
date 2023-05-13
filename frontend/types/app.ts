export interface UserType {
    _id: string | undefined;
    username: string | undefined;
    email: string | undefined;
    profilePic: string | undefined;
    bio: string | undefined;
    online: boolean | undefined;
};

export interface DirectChatRoomType {
    _id: string | undefined;
    users: UserType[] | undefined;
    wallpaper: string | undefined;
    createdAt: string | undefined;
};

export interface GroupChatRoomType {
    _id: string | undefined;
    name: string | undefined;
    admin: UserType | undefined;
    users: UserType[] | undefined;
    bio: string | undefined;
    groupPic: string | undefined;
    wallpaper: string | undefined;
    createdAt: string | undefined;
};

export interface DirectChatRoomMessageType {
    _id: string;
    roomId: string;
    sender: UserType;
    text: string;
    read: boolean;
    createdAt: string;
};

export interface GroupChatRoomMessageType {
    _id: string;
    roomId: string;
    sender: UserType;
    text: string;
    createdAt: string;
};

