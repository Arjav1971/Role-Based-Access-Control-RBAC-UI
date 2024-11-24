import usersData from '../assests/DataAssets/mockUsers.json';

let users = [...usersData]; // In-memory data copy for simulation

export const getUsers = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(users);
    }, 500); // Simulate API delay
  });
};


export const addUser = async (newUser) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const id = Math.max(...users.map((user) => user.id), 0) + 1; // Generate a new unique ID
            const userWithId = { ...newUser, id };
            if (!users.some((user) => user.account === userWithId.account)) {
                // Ensure no duplicates
                users = [...users, userWithId]; // Safely update the array
            }
            resolve(userWithId);
        }, 500); // Simulated delay
    });
};

export const deleteUser = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      users = users.filter((user) => user.id !== userId);
      resolve(userId);
    }, 500);
  });
};

export const updateUser = async (userId, updatedFields) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      users = users.map((user) =>
        user.id === userId ? { ...user, ...updatedFields } : user
      );
      resolve(users.find((user) => user.id === userId));
    }, 500);
  });
};