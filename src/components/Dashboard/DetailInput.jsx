import { React, useState, useEffect } from "react";

import Details from "./Details/Details";
import Meteo from "./Details/Meteo";
import DouleurSeance from "./Details/DouleurSeance";
import Fatigue from "./Details/Fatigue";
import Preworkout from "./Details/Preworkout";
import DRUG from "./Details/DRUG";
import Psycho from "./Details/Psycho";
import Seul from "./Details/Seul";
import Environnement from "./Details/Environnement";
import Courbatures from "./Details/Courbatures";
import { customStyles, customStylesDark, customStylesDarkMini, customStylesMini } from "../../utils/customStyles";
import Select from "react-select";

function DetailInput(props) {
  const [detail, setDetail] = useState(props.detail);

  function handleChange(event) {
    if (event.target) {
      setDetail(oldDetail => {
        return ({
          ...oldDetail,
          [event.target.id]: event.target.value,
        })
      });
    }
    else {
      setDetail(oldDetail => {
        return ({
          ...oldDetail,
          [event.id]: event.value,
        })
      });
    }
  }

  useEffect(() => {
    props.changeDetail(detail, props.id)
  }, [detail])

  function handleClickPoubelle() {
    props.onDeleteDetail(props.id);

    event.preventDefault();
  }

  function divStyle(index, dark) {
    let fourColorsArray = []
    if (dark) {
      fourColorsArray = ['ffffff', 'ffc9c9', 'ff8282', 'ff0000']
    }
    else {
      fourColorsArray = ['ff0000', 'aa0000', '550000', '000000']
    }
    let numb = index % 4
    let color = '#' + fourColorsArray[numb]
    let font;

    if (index % 2 === 0) {
      font = 400;
    } else {
      font = 500;
    }

    return ({
      color: color,
      fontWeight: font
    })
  }

  useEffect(() => {
    if (props.click) {
      setDetail({ id: props.id })
    }
  }, [props.click])

  return (
    <div style={divStyle(props.index, props.modeSombre)}>
      {detail.name ?
        null
        :
        <div>
          {props.info === "false" ? null :
            <label>
              Detail {props.index + 1}
            </label>
          }

          {props.dashboard ? null : <div style={{ display: "inline-block" }}>
            <img className={props.modeSombre === true ? "poubelleDark" : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt={props.modeSombre === true ? "poubelleDark" : "poubelle"} />
          </div>}

          <div className={props.info === true ? "col-10" : props.info === "false" ? "col-12" : "col-12"}>
            <Select
              placeholder="Detail..."
              onChange={handleChange}
              options={Details}
              styles={
                props.dimensions.width <= 500 ?
                  props.modeSombre === true ?
                    customStylesDarkMini
                    :
                    customStylesMini
                  :
                  props.modeSombre === true ?
                    customStylesDark
                    :
                    customStyles
              }
              value={{ value: detail.name, label: detail.name }}
            />
          </div>


        </div>
      }

      {detail.name === "Aucun" ?
        <div className="form-group row">
          {props.info === "false" ? null :
            <label>
              Detail {props.dashboard ? props.index + 1 : null}
            </label>
          }

          <div className={props.info === true ? "col-10" : props.info === "false" ? "col-12" : "col-9"}>
            <Select
              placeholder="Detail..."
              onChange={handleChange}
              options={Details}
              styles={
                props.dimensions.width <= 500 ?
                  props.modeSombre === true ?
                    customStylesDarkMini
                    :
                    customStylesMini
                  :
                  props.modeSombre === true ?
                    customStylesDark
                    :
                    customStyles
              }
              value={{ value: detail.name, label: detail.name }}
            />
          </div>

          {props.dashboard ? null : <div className="col-1">
            <img className={props.modeSombre === true ? "poubelleDark" : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt={props.modeSombre === true ? "poubelleDark" : "poubelle"} />
          </div>}
        </div>
        : null}

      {detail.name === "Condition météorologique défavorable" ?
        props.info === "false" ?
          <Select
            placeholder="Detail..."
            onChange={handleChange}
            options={Meteo}
            styles={
              props.dimensions.width <= 500 ?
                props.modeSombre === true ?
                  customStylesDarkMini
                  :
                  customStylesMini
                :
                props.modeSombre === true ?
                  customStylesDark
                  :
                  customStyles
            }
            value={{ value: detail.input, label: detail.input }}
          />
          :
          <div className="form-group row">
            <label>
              {detail.name}
            </label>
            <div className={props.info === true ? "col-10" : "col-9"}>
              <Select
                placeholder="Detail..."
                onChange={handleChange}
                options={Meteo}
                styles={
                  props.dimensions.width <= 500 ?
                    props.modeSombre === true ?
                      customStylesDarkMini
                      :
                      customStylesMini
                    :
                    props.modeSombre === true ?
                      customStylesDark
                      :
                      customStyles
                }
                value={{ value: detail.input, label: detail.input }}
              />
            </div>

            {props.dashboard ? null : <div className="col-1">
              <img className={props.modeSombre === true ? "poubelleDark" : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt={props.modeSombre === true ? "poubelleDark" : "poubelle"} />
            </div>}
          </div>
        : null}
      {detail.name === "Gêne / douleur / blessure" ?
        props.info === "false" ?
          <Select
            placeholder="Detail..."
            onChange={handleChange}
            options={DouleurSeance}
            styles={
              props.dimensions.width <= 500 ?
                props.modeSombre === true ?
                  customStylesDarkMini
                  :
                  customStylesMini
                :
                props.modeSombre === true ?
                  customStylesDark
                  :
                  customStyles
            }
            value={{ value: detail.input, label: detail.input }}
          />
          :
          <div className="form-group row">
            <label>
              {detail.name}
            </label>
            <div className={props.info === true ? "col-10" : "col-9"}>
              <Select
                placeholder="Detail..."
                onChange={handleChange}
                options={DouleurSeance}
                styles={
                  props.dimensions.width <= 500 ?
                    props.modeSombre === true ?
                      customStylesDarkMini
                      :
                      customStylesMini
                    :
                    props.modeSombre === true ?
                      customStylesDark
                      :
                      customStyles
                }
                value={{ value: detail.input, label: detail.input }}
              />
            </div>

            {props.dashboard ? null : <div className="col-1">
              <img className={props.modeSombre === true ? "poubelleDark" : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt={props.modeSombre === true ? "poubelleDark" : "poubelle"} />
            </div>}
          </div>
        : null}
      {detail.name === "Fatigue" ?
        props.info === "false" ?
          <Select
            placeholder="Detail..."
            onChange={handleChange}
            options={Fatigue}
            styles={
              props.dimensions.width <= 500 ?
                props.modeSombre === true ?
                  customStylesDarkMini
                  :
                  customStylesMini
                :
                props.modeSombre === true ?
                  customStylesDark
                  :
                  customStyles
            }
            value={{ value: detail.input, label: detail.input }}
          />
          :
          <div className="form-group row">
            <label>
              {detail.name}
            </label>
            <div className={props.info === true ? "col-10" : "col-9"}>
              <Select
                placeholder="Detail..."
                onChange={handleChange}
                options={Fatigue}
                styles={
                  props.dimensions.width <= 500 ?
                    props.modeSombre === true ?
                      customStylesDarkMini
                      :
                      customStylesMini
                    :
                    props.modeSombre === true ?
                      customStylesDark
                      :
                      customStyles
                }
                value={{ value: detail.input, label: detail.input }}
              />
            </div>

            {props.dashboard ? null : <div className="col-1">
              <img className={props.modeSombre === true ? "poubelleDark" : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt={props.modeSombre === true ? "poubelleDark" : "poubelle"} />
            </div>}
          </div>
        : null}
      {detail.name === "Pre Workout, Café..." ?
        props.info === "false" ?
          <Select
            placeholder="Detail..."
            onChange={handleChange}
            options={Preworkout}
            styles={
              props.dimensions.width <= 500 ?
                props.modeSombre === true ?
                  customStylesDarkMini
                  :
                  customStylesMini
                :
                props.modeSombre === true ?
                  customStylesDark
                  :
                  customStyles
            }
            value={{ value: detail.input, label: detail.input }}
          />
          :
          <div className="form-group row">
            <label>
              {detail.name}
            </label>
            <div className={props.info === true ? "col-10" : "col-9"}>
              <Select
                placeholder="Detail..."
                onChange={handleChange}
                options={Preworkout}
                styles={
                  props.dimensions.width <= 500 ?
                    props.modeSombre === true ?
                      customStylesDarkMini
                      :
                      customStylesMini
                    :
                    props.modeSombre === true ?
                      customStylesDark
                      :
                      customStyles
                }
                value={{ value: detail.input, label: detail.input }}
              />
            </div>

            {props.dashboard ? null : <div className="col-1">
              <img className={props.modeSombre === true ? "poubelleDark" : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt={props.modeSombre === true ? "poubelleDark" : "poubelle"} />
            </div>}
          </div>
        : null}
      {detail.name === "Alcool, drogue, sexe..." ?
        props.info === "false" ?
          <Select
            placeholder="Detail..."
            onChange={handleChange}
            options={DRUG}
            styles={
              props.dimensions.width <= 500 ?
                props.modeSombre === true ?
                  customStylesDarkMini
                  :
                  customStylesMini
                :
                props.modeSombre === true ?
                  customStylesDark
                  :
                  customStyles
            }
            value={{ value: detail.input, label: detail.input }}
          />
          :
          <div className="form-group row">
            <label>
              {detail.name}
            </label>
            <div className={props.info === true ? "col-10" : "col-9"}>
              <Select
                placeholder="Detail..."
                onChange={handleChange}
                options={DRUG}
                styles={
                  props.dimensions.width <= 500 ?
                    props.modeSombre === true ?
                      customStylesDarkMini
                      :
                      customStylesMini
                    :
                    props.modeSombre === true ?
                      customStylesDark
                      :
                      customStyles
                }
                value={{ value: detail.input, label: detail.input }}
              />
            </div>

            {props.dashboard ? null : <div className="col-1">
              <img className={props.modeSombre === true ? "poubelleDark" : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt={props.modeSombre === true ? "poubelleDark" : "poubelle"} />
            </div>}
          </div>
        : null}
      {detail.name === "Etat psychologique" ?
        props.info === "false" ?
          <Select
            placeholder="Detail..."
            onChange={handleChange}
            options={Psycho}
            styles={
              props.dimensions.width <= 500 ?
                props.modeSombre === true ?
                  customStylesDarkMini
                  :
                  customStylesMini
                :
                props.modeSombre === true ?
                  customStylesDark
                  :
                  customStyles
            }
            value={{ value: detail.input, label: detail.input }}
          />
          :
          <div className="form-group row">
            <label>
              {detail.name}
            </label>
            <div className={props.info === true ? "col-10" : "col-9"}>
              <Select
                placeholder="Detail..."
                onChange={handleChange}
                options={Psycho}
                styles={
                  props.dimensions.width <= 500 ?
                    props.modeSombre === true ?
                      customStylesDarkMini
                      :
                      customStylesMini
                    :
                    props.modeSombre === true ?
                      customStylesDark
                      :
                      customStyles
                }
                value={{ value: detail.input, label: detail.input }}
              />
            </div>

            {props.dashboard ? null : <div className="col-1">
              <img className={props.modeSombre === true ? "poubelleDark" : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt={props.modeSombre === true ? "poubelleDark" : "poubelle"} />
            </div>}
          </div>
        : null}
      {detail.name === "Séance seul ou à plusieurs" ?
        props.info === "false" ?
          <Select
            placeholder="Detail..."
            onChange={handleChange}
            options={Seul}
            styles={
              props.dimensions.width <= 500 ?
                props.modeSombre === true ?
                  customStylesDarkMini
                  :
                  customStylesMini
                :
                props.modeSombre === true ?
                  customStylesDark
                  :
                  customStyles
            }
            value={{ value: detail.input, label: detail.input }}
          />
          :
          <div className="form-group row">
            <label>
              {detail.name}
            </label>
            <div className={props.info === true ? "col-10" : "col-9"}>
              <Select
                placeholder="Detail..."
                onChange={handleChange}
                options={Seul}
                styles={
                  props.dimensions.width <= 500 ?
                    props.modeSombre === true ?
                      customStylesDarkMini
                      :
                      customStylesMini
                    :
                    props.modeSombre === true ?
                      customStylesDark
                      :
                      customStyles
                }
                value={{ value: detail.input, label: detail.input }}
              />
            </div>

            {props.dashboard ? null : <div className="col-1">
              <img className={props.modeSombre === true ? "poubelleDark" : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt={props.modeSombre === true ? "poubelleDark" : "poubelle"} />
            </div>}
          </div>
        : null}
      {detail.name === "Environnement" ?
        props.info === "false" ?
          <Select
            placeholder="Detail..."
            onChange={handleChange}
            options={Environnement}
            styles={
              props.dimensions.width <= 500 ?
                props.modeSombre === true ?
                  customStylesDarkMini
                  :
                  customStylesMini
                :
                props.modeSombre === true ?
                  customStylesDark
                  :
                  customStyles
            }
            value={{ value: detail.input, label: detail.input }}
          />
          :
          <div className="form-group row">
            <label>
              {detail.name}
            </label>
            <div className={props.info === true ? "col-10" : "col-9"}>
              <Select
                placeholder="Detail..."
                onChange={handleChange}
                options={Environnement}
                styles={
                  props.dimensions.width <= 500 ?
                    props.modeSombre === true ?
                      customStylesDarkMini
                      :
                      customStylesMini
                    :
                    props.modeSombre === true ?
                      customStylesDark
                      :
                      customStyles
                }
                value={{ value: detail.input, label: detail.input }}
              />
            </div>

            {props.dashboard ? null : <div className="col-1">
              <img className={props.modeSombre === true ? "poubelleDark" : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt={props.modeSombre === true ? "poubelleDark" : "poubelle"} />
            </div>}
          </div>
        : null}
      {detail.name === "Courbatures / Congestion" ?
        props.info === "false" ?
          <Select
            placeholder="Detail..."
            onChange={handleChange}
            options={Courbatures}
            styles={
              props.dimensions.width <= 500 ?
                props.modeSombre === true ?
                  customStylesDarkMini
                  :
                  customStylesMini
                :
                props.modeSombre === true ?
                  customStylesDark
                  :
                  customStyles
            }
            value={{ value: detail.input, label: detail.input }}
          />
          :
          <div className="form-group row">
            <label>
              {detail.name}
            </label>
            <div className={props.info === true ? "col-10" : "col-9"}>
              <Select
                placeholder="Detail..."
                onChange={handleChange}
                options={Courbatures}
                styles={
                  props.dimensions.width <= 500 ?
                    props.modeSombre === true ?
                      customStylesDarkMini
                      :
                      customStylesMini
                    :
                    props.modeSombre === true ?
                      customStylesDark
                      :
                      customStyles
                }
                value={{ value: detail.input, label: detail.input }}
              />
            </div>

            {props.dashboard ? null : <div className="col-1">
              <img className={props.modeSombre === true ? "poubelleDark" : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt={props.modeSombre === true ? "poubelleDark" : "poubelle"} />
            </div>}
          </div>
        : null}
      {detail.name === "Notes" ?
        props.info === "false" ?
          <div className={props.info === "false" ? "" : "col-10"}>
            <textarea type="text"
              className="form-control"
              id="input"
              value={detail.input}
              placeHolder="Je n'ai pas su garder un léger flex"
              rows="5"
              onChange={handleChange}
            />
          </div>
          :
          <div className="form-group row">
            {props.info === "false" ?
              null
              :
              <label>
                {detail.name}
              </label>
            }
            <div className={props.info === "false" ? "" : "col-10"}>
              <textarea type="text"
                className="form-control"
                id="input"
                value={detail.input}
                placeHolder="Je n'ai pas su garder un léger flex"
                rows="5"
                onChange={handleChange}
              />
            </div>

            {props.dashboard ? null : <div className="col-1">
              <img className={props.modeSombre === true ? "poubelleDark" : "poubelle"} onClick={handleClickPoubelle} src={require('../../images/icons/icons8-trash-30.webp')} alt={props.modeSombre === true ? "poubelleDark" : "poubelle"} />
            </div>}
          </div>
        : null}
    </div>
  );
};

export default DetailInput;











