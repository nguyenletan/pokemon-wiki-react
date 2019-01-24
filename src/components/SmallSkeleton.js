import React from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, CardText } from 'reactstrap';

const SmallSkeleton = () => (
  <Card className="small-skeleton">
    <div className="card-img card-loading-animation" />
    <CardBody>
      <CardTitle className="card-loading-animation" />
      <CardSubtitle className="card-loading-animation" />
      <CardText className="card-loading-animation" />
      <div className="card-button card-loading-animation" />
    </CardBody>
  </Card>
);

export default SmallSkeleton;
