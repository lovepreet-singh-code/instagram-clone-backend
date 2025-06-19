import { Request, Response } from 'express';
import { IUser, User } from '../models/user.model';
import { generateToken } from '../utils/generateJWT';
import { asyncHandler } from '../utils/asyncHandler';;
import { STATUS } from '../constants/statusCodes';
import { MSG } from '../constants/messages';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(STATUS.BAD_REQUEST);
    throw new Error(MSG.USER_ALREADY_EXISTS);
  }

  // const newUser = await User.create({ username, email, password });
  // const token = generateToken(newUser._id.toString());
const newUser = await User.create({ username, email, password }) as IUser & { _id: import('mongoose').Types.ObjectId };
const token = generateToken(newUser._id.toString());


  // Remove password before sending user
  const userToReturn = {
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
  };

  res.status(STATUS.CREATED).json({
    message: MSG.REGISTER_SUCCESS,
    token,
    user: userToReturn,
  });
});


export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }) as (import('mongoose').Document & {
    _id: import('mongoose').Types.ObjectId;
    username: string;
    email: string;
    password: string;
    comparePassword: (password: string) => Promise<boolean>;
  }) | null;
  if (!user || !(await user.comparePassword(password))) {
    res.status(STATUS.UNAUTHORIZED);
    throw new Error(MSG.INVALID_CREDENTIALS);
  }


  res.status(STATUS.CREATED).json({
  message: MSG.LOGIN_SUCCESS,
  token: generateToken(user._id.toString()), 
});

});
