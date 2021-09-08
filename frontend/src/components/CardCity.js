import "../styles/CardCity.css"; //css contiene main y cardCity
import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import propertiesActions from "../redux/action/propertiesActions";

const CardCity = (props) => {
  const [numberProperties, setNumberPropierties] = useState();
  const { cityName, photoURL, _id } = props.city;
  useEffect(() => {
    const numberProperties = async () => {
      try {
        var res = await props.getNumberOfProperties(_id);
        if (!res.success) {
          throw res.data.response;
        } else {
          setNumberPropierties(res.response);
        }
      } catch (err) {
        console.log(err);
      }
    };
    numberProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="divCard">
      <Link to="/city">
        <div
          className="cardCity"
          style={{ backgroundImage: `url(${photoURL})` }}
        >
          <h1>{cityName}</h1>
          <p>({numberProperties} propiedades)</p>
        </div>
      </Link>
    </div>
  );
};
const mapDispatchToProps = {
  getNumberOfProperties: propertiesActions.getNumberOfProperties,
};

export default connect(null, mapDispatchToProps)(CardCity);
