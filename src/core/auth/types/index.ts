export type JwtPayloadUser = {
  data: any;
  username: string;
  exp: number;
  iat: number;
  email: string;
};
