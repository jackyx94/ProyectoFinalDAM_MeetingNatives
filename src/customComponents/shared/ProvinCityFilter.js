import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import provincesData from "../../../assets/provincias.json";
import citiesData from "../../../assets/municipios.json";
import ModalFilterPicker from "react-native-modal-filter-picker";

export default function ProvinCityFilter({ handleState, previusData }) {
  const isFirstRender = useRef(true);
  const [cityDisabled, setCityDisabled] = useState(true);
  const [currentProvince, setCurrentProvince] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [provincePickerVisible, setProvincePickerVisible] = useState(false);
  const [cityPickerVisible, setCityPickerVisible] = useState(false);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    if (previusData) {
      setCurrentProvince({ label: previusData.province });
      setCurrentCity({ label: previusData.city });
    }
  }, []);
  useEffect(() => {
    returnState();
  }, [currentProvince, currentCity]);
  const selectedProvince = (province) => {
    setProvincePickerVisible(false);
    setCurrentProvince(province);
    setCurrentCity("");
    parseCities(province);
    setCityDisabled(false);
  };
  const selectedCity = (city) => {
    setCityPickerVisible(false);
    setCurrentCity(city);
  };
  function returnState() {
    handleState([currentProvince, currentCity]);
  }
  function parseProvinces() {
    var provinces = [];
    provinces.push(
      provincesData.map(function (item) {
        return { key: item.nm, label: item.nm, id: item.id };
      })
    );
    setProvinceOptions(provinces[0]);
  }

  function parseCities(province) {
    var cities = [];
    citiesData.map(function (city) {
      if (city.id.indexOf(province.id.toString()) === 0) {
        cities.push({ key: city.nm, label: city.nm, id: city.id });
      }
    });
    setCityOptions(cities);
    console.log(cities);
  }
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      parseProvinces();
    }
  });
  function isEnabled() {
    if (currentProvince === "") {
      return styles.pickerButtonDisabled;
    } else {
      return styles.pickerButton;
    }
  }
  return (
    <View style={styles.parentView}>
      <View style={styles.searchingContainer}>
        <View style={styles.pickersContainer}>
          <View style={styles.buttonsContainer}>
            <View style={[styles.pickerItem, { marginRight: 40 }]}>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setProvincePickerVisible(true)}
              >
                <Text style={styles.simpleText}>Provincia</Text>
              </TouchableOpacity>
              <Text style={[styles.simpleText, { fontWeight: "bold" }]}>
                {currentProvince.label}
              </Text>
            </View>
            <View style={styles.pickerItem}>
              <TouchableOpacity
                disabled={cityDisabled}
                style={isEnabled()}
                onPress={() => setCityPickerVisible(true)}
              >
                <Text style={styles.simpleText}>Municipio</Text>
              </TouchableOpacity>
              <Text style={[styles.simpleText, { fontWeight: "bold" }]}>
                {currentCity.label}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ModalFilterPicker
        cancelContainerStyle={{ flexDirection: "column" }}
        cancelButtonText="Cancelar"
        placeholderText="Elige una provincia"
        visible={provincePickerVisible}
        onCancel={() => setProvincePickerVisible(false)}
        onSelect={selectedProvince}
        options={provinceOptions}
      ></ModalFilterPicker>
      <ModalFilterPicker
        cancelContainerStyle={{ flexDirection: "column" }}
        cancelButtonText="Cancelar"
        placeholderText="Elige un municipio"
        visible={cityPickerVisible}
        onCancel={() => setCityPickerVisible(false)}
        onSelect={selectedCity}
        options={cityOptions}
      ></ModalFilterPicker>
    </View>
  );
}

const styles = StyleSheet.create({
  parentView: { flex: 1 },
  pickerButtonDisabled: {
    borderRadius: 6,
    padding: 10,
    flex: 1,
    borderColor: "#e3e3e3",
    borderWidth: 3,
    opacity: 0.6,
    marginBottom: 10,
  },
  pickerButton: {
    marginBottom: 10,
    minWidth: "40%",
    borderWidth: 2,
    borderRadius: 6,
    borderColor: "#0A75F2",
    padding: 10,
    flex: 1,
    backgroundColor: "#e3e3e3",
  },
  pickerItem: {
    flex: 1,
    alignItems: "center",
  },
  buttonsContainer: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  pickersContainer: {
    minWidth: "100%",
    flex: 1,
  },
  searchingContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
  },
  titles: {
    margin: 10,
    fontSize: 16,
    color: "#696969",
  },
  simpleText: {
    minHeight: 16,
    textAlign: "center",
    flex: 1,
    fontSize: 18,
    color: "#696969",
  },
});
