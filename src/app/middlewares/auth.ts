// import { NextFunction, Request, Response } from 'express';
// import { JwtPayload } from 'jsonwebtoken';
// import catchAsync from '../utils/catchAsync';
// import status from 'http-status';
// import ApppError from '../error/AppError';
// import jwt from 'jsonwebtoken';
// import config from '../config';

// const auth = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const authorizationToken = req?.headers?.authorization;
//     if (!authorizationToken) {
//       throw new ApppError(
//         status.UNAUTHORIZED,
//         'Unauthorized User: Missing Authorization Token',
//       );
//     }

//     const decoded = jwt.verify(
//       authorizationToken,
//       config.access_token_secret as string,
//     );

//     if (!decoded) {
//       throw new ApppError(
//         status.UNAUTHORIZED,
//         'Unauthorized User: Invalid Authorization Token',
//       );
//     }

//     req.user = decoded as JwtPayload;
//     next();
//   },
// );

// export default auth;

import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
// import authUtill from '../modules/auth/auth.utill';
// import catchAsync from '../util/catchAsync';
// import { TUserRole } from '../constents';
// import idConverter from '../util/idConvirter';
import ApppError from '../error/AppError';
import { TUserRole } from '../constant';
import catchAsync from '../utils/catchAsync';
import status from 'http-status';
import config from '../config';
import User from '../modules/user/user.model';
import { decodeToken } from '../utils/generateToken';
// import { StatusCodes } from 'http-status-codes';

const auth = (...requeredUserRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorizationToken = req?.headers?.authorization;
    console.log({ requeredUserRole, authorizationToken });
    if (!authorizationToken) {
      throw new ApppError(
        status.UNAUTHORIZED,
        'Unauthorized User: Missing Authorization Token',
      );
    }

    const decoded = decodeToken(
      authorizationToken,
      config.access_token_secret as string,
    );
    if (!decoded) {
      throw new ApppError(
        status.UNAUTHORIZED,
        'Unauthorized User: Invalid Authorization Token',
      );
    }

    const { id, role } = decoded as JwtPayload;

    // Check if the user's role is allowed
    if (requeredUserRole.length && !requeredUserRole.includes(role)) {
      throw new ApppError(
        status.FORBIDDEN,
        'Unauthorized User: Role not permitted',
      );
    }

    const isUserExist = await User.findById(id)
      .select('-password')
      .select('-passwordChangedAt');

    

    if (!isUserExist) {
      throw new ApppError(
        status.NOT_FOUND,
        'Unauthorized User: Forbidden Access',
      );
    }

    if (isUserExist.isBlocked || isUserExist.isDeleted) {
      throw new ApppError(status.FORBIDDEN, 'This user is blocked');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
