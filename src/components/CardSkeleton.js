import React from "react"

const CardSkeleton = props => {
  const { gen } = props
  return (
    <div className={`card-skeleton gen-${gen}`}>
      <span className="top-icon card-loading-animation" />
      <p className="card-img card-loading-animation" />
      <span className="bottom-icon card-loading-animation" />
    </div>
  )
}

export default CardSkeleton
