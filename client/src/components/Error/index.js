import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const PageNotFound = () => (
  <div className="justify-content-center text-center">
    <div className="row pt-5 mt-5 d-flex justify-content-center">
    </div>
    <Link className="btn mt-5 btn-primary text-center" to={ROUTES.LANDING}>
      Go to dashboard
    </Link>
  </div>
);
export default PageNotFound;
