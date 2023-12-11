/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

function CityList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message
        message={"Add your first city by clicking on a city on the map!"}
      />
    );
  return (
    <ul className={styles.cityList}>
      {cities.map((city, index) => {
        return <CityItem city={city} key={index} />;
      })}
    </ul>
  );
}

export default CityList;
