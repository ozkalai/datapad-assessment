import * as React from "react"

const DragIcon = (props) => (
  <svg
  className={props.className}
    width={12}
    height={12}
    xmlns="http://www.w3.org/2000/svg"
    fill={props.fill}
    viewBox="0 0 12 12"
    {...props}
  >
    <circle cx={10.5} cy={1.5} r={1.5} fill={props.fill} fillOpacity={0.1} />
    <circle cx={10.5} cy={6} r={1.5} fill={props.fill} fillOpacity={0.1} />
    <circle cx={6} cy={6} r={1.5} fill={props.fill} fillOpacity={0.1} />
    <circle cx={10.5} cy={10.5} r={1.5} fill={props.fill} fillOpacity={0.1} />
    <circle cx={6} cy={10.5} r={1.5} fill={props.fill} fillOpacity={0.1} />
    <circle cx={1.5} cy={10.5} r={1.5} fill={props.fill} fillOpacity={0.1} />
  </svg>
)

export default DragIcon