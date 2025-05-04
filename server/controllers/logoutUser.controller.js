
export const logoutUser = async (req, res) => {
    res
      .clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      })
      .status(200)
      .json({ message: 'Sesión cerrada correctamente' });
  };