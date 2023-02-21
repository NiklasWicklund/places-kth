import BaseMarkerCluster from '@changey/react-leaflet-markercluster'
import { divIcon, point } from 'leaflet'

const clusterIcon = {  
    backgroundColor: "lightblue",
    opacity: "50%",
    color: "black",
    borderRadius: "50%",
    borderWidth: "2px",
    border: "#FFFFFF",
}
const createClusterCustomIcon = (cluster) => {
  return divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: {clusterIcon},
    iconSize: point(80, 80, true),
  })
}

export const MarkerCluster = ({ children }) => {
  return (
    <BaseMarkerCluster
      iconCreateFunction={createClusterCustomIcon}
      showCoverageOnHover={false}
    >
      {children}
    </BaseMarkerCluster>
  )
}