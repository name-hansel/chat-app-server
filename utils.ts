export interface RoomUser {
  id: string;
  username: string;
  room: string;
}

const users: RoomUser[] = [];

export const addUserToRoom = (id: string, username: string, room: string) => {
  const user: RoomUser = { id, username, room };
  users.push(user);
  return user;
};

export const getCurrentUsers = (room: string) => {
  return users.filter((user) => user.room === room);
};

export const getCurrentUser = (id: string) => {
  const user = users.find((user) => user.id === id);
  if (user === undefined) return undefined;
  return user;
};

export const removeCurrentUser = (id: string) => {
  const user = getCurrentUser(id);
  users.splice(
    users.findIndex((user) => user.id === id),
    1
  );

  return user;
};
