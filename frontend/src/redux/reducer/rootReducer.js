import { combineReducers } from "redux";
import citiesReducer from "./citiesReducer";
import propertiesReducer from "./propertiesReducer";
import userReducer from "./userReducer"

const rootReducer = combineReducers({
  allCities: citiesReducer,
  properties: propertiesReducer,
  user: userReducer
});

export default rootReducer;
