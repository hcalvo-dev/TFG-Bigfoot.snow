import { Node_ENV } from '../config.js';


export const logoutUser = async (req, res) => {
    res
      .clearCookie('token', {
        httpOnly: true,
        secure: NODE_ENV === 'https_production',
        sameSite: 'strict'
      })
      .status(200)
      .json({ message: 'Sesión cerrada correctamente' });
  };