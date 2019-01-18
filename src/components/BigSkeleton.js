import React from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, CardText } from 'reactstrap';

const BigSkeleton = () => (
  <Card className="prototype">
    <i className="arrow-back card-loading-animation" />
    <div className="card-loading-animation card-img" />
    <CardBody>
      <CardTitle className="card-loading-animation" />
      <CardSubtitle className="card-loading-animation" />
      <CardText className="card-loading-animation" />
      <CardText className="card-loading-animation" />
      <CardText className="card-loading-animation" />
      <CardText className="card-loading-animation" />
    </CardBody>
  </Card>
);

export default BigSkeleton;
