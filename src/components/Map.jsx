/* eslint-disable no-unused-vars */
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  // CITYITEM KOMPONENTINDE LINK ICERISINDE BELIRTILEN VERILERE BURADAN ERISILEBILIR(HERHANGI BIR KOMPONENT ICERISINDEN DE ERISILEBILIRDI, BU DEGERLER GLOBAL DEGERLER OLARAK DUSUNULEBILIR)
  // SEARCH PARAMETRESI YA DA QUERY STRING, URL'DE ?'DEN SONRA GELEN VERILERDIR
  // USESEARCHPARAM HOOK'U USESTATE'E BENZER SEKILDE KULLANILIR, ANCAK VERIYE ERISILIRKEN GET METODUNDAN YARARLANILIR VE ISTENILEN DEGERIN TAM OLARAK ISMI GIRILMELIDIR
  // SETSEARCHPARAMS ILE QUERY STRING DEGISTIRILEBILIR, BU ISLEM SONUNDA DEGISEN DEGERLER UYGULAMADA BASKA YERDE KULLANILIYORSA ORADA DA DEGISIR, URL UZERINDE DE DEGISIR!

  const [mapPosition, setMapPosition] = useState([38.85, 37.68]);

  const { cities } = useCities();

  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geolocationPosition)
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
  }, [geolocationPosition]);

  return (
    <div className={styles.mapContainer}>
      <Button type={"position"} onClick={getPosition}>
        {isLoadingPosition ? "Loading..." : "Use your position"}
      </Button>
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={10}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  // USEMAP İLE ŞU ANDA KULLANILAN MAP'İN(YANİ EKRANDA GÖSTERİLEN MAP) BİR INSTANCE'I ALINIR
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    // URL İLE HARİTADA TIKLANILAN YERE AİT KOORDİNAT VERİLERİ TAŞINIYOR
    // URL ÜZERİNDEKİ VERİ DEĞİŞTİKÇE YUKARIDA EFFECT İÇERİSİNDEKİ SETMAPPOSITION FONKSİYONU ÇALIŞIYOR VE HARİTA İLGİLİ YERE KAYDIRILIYOR
    // LATLNG, EĞER E PARAMETRESİ CONSOL EKRANINA YAZDIRILIRSA LEAFLET'İN TIKLANAN YERE AİT VERİLERİ DÖNDÜRDÜĞÜ GÖRÜLÜR
    // LATLNG DE BU BİLGİLERİ İÇERMEKTEDİR, BİR OBJEDİR VE "." İLE İÇERİSİNDEKİ LAT VE LNG VERİLERİNE ERİŞİLİR
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
