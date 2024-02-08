import {
  authenticateUser,
  confirmEmail,
  getUserInfo,
  registerUser,
} from "../../models/authenticate";

export const handleRegisterUser = async (data: unknown) => {
  try {
    const user = await registerUser(data);
    return user;
  } catch (err) {
    throw err;
  }
};
export const handleAuthenticateUser = async (data: unknown) => {
  try {
    const user = await authenticateUser(data);
    return user;
  } catch (err) {
    throw err;
  }
};

export const handleAuthUserData = async (data: unknown) => {
  try {
    const user = await getUserInfo(data);
    return user;
  } catch (err) {
    throw err;
  }
};

export const handleConfirmEmail = async (data: unknown) => {
  try {
    const user = await confirmEmail(data);
    return user;
  } catch (err) {
    throw err;
  }
};
