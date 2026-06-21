import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import { Fragment } from 'react';
import type { Tracking } from '@/types/tracking';
import AnimatedMarker from './AnimatedMarker';

interface Props {
  tracking: Tracking[] | undefined;
}

const DashboardMap = ({ tracking }: Props) => {
  const colors = ['red', 'blue', 'green', 'orange', 'purple'];
  // console.log(tracking);
  return (
    <div>
      <div className="flex gap-2">
        {tracking?.map((el) => (
          <div key={el.pengiriman_id} className="bg-amber-200 p-2">
            <p>{el.tujuan_nama}</p>
            <p>{el.latitude}</p>
            <p>{el.longitude}</p>
          </div>
        ))}
      </div>
      <div style={{ height: 'calc(100vh - 280px)', width: '100%' }}>
        <MapContainer center={[0.12174351770078276, 110.59555590575488]} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {tracking?.map((el) => (
            <Fragment key={el.pengiriman_id}>
              <AnimatedMarker color={colors[el.pengiriman_id % colors.length]} tracking={el} />

              <Marker position={[el.tujuan_lat, el.tujuan_lng]}>
                <Tooltip permanent direction="top" offset={[-15, -13]}>
                  {el.tujuan_nama}
                </Tooltip>
              </Marker>
            </Fragment>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default DashboardMap;
