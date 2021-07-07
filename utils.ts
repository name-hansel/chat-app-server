export interface RoomUser {
  id: string;
  username: string;
  room: string;
}

export interface Room {
  name: string;
  numberOfUsers: number;
}

const users: RoomUser[] = [];
const rooms: Room[] = [];

export const addUserToRoom = (id: string, username: string, room: string) => {
  // Check if room does not exist
  const index = rooms.findIndex((r) => r.name === room);
  if (index === -1) {
    // Room does not exist
    const newRoom: Room = {
      name: room,
      numberOfUsers: 1,
    };
    rooms.push(newRoom);
  } else {
    // Room exists, increment number of users
    rooms[index].numberOfUsers += 1;
  }

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

  if (user) {
    const index = rooms.findIndex((room) => room.name === user.room);
    rooms[index].numberOfUsers -= 1;
    if (rooms[index].numberOfUsers === 0) rooms.splice(index, 1);
  }

  users.splice(
    users.findIndex((user) => user.id === id),
    1
  );

  return user;
};

export const canUserJoin = (username: string, room: string) => {
  const foundUsers = users.filter(
    (user) => user.room === room && username === user.username
  );
  return foundUsers.length > 0 ? false : true;
};

export const getCurrentRooms = () => {
  return rooms;
};
