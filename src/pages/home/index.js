import React, { Component } from "react";
import { Helmet } from "react-helmet-async";
import {
  Alert,
  Button,
  ButtonGroup,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
  Table
} from "reactstrap";
import { assign, set, isFunction, cloneDeep, remove, orderBy } from "lodash";
import store from "store";
import uuidv4 from "uuid/v4";

const INITIAL_STATE = {
  name: "",
  alcohol: "",
  alcohol_unit: "APV",
  volume: "",
  volume_unit: "Oz",
  price: "",
  stored: [],
  calculation: null,
  apv_calculation: null,
  ppv_calculation: null
};

export class Home extends Component {
  state = cloneDeep(INITIAL_STATE);

  componentDidMount = () => {
    const state = store.get("beermiser-state") || cloneDeep(INITIAL_STATE);
    this.setState(state);
  };

  persistState = (state, callback) => {
    this.setState(state, () => {
      store.set("beermiser-state", this.state);
      if (isFunction(callback)) {
        callback();
      }
    });
  };

  handleChange = event => {
    this.persistState(
      set({}, event.target.name, event.target.value),
      this.updateCalculation
    );
  };

  saveCurrent = () => {
    console.log("Save Current", this.state);
    const {
      alcohol,
      alcohol_unit,
      volume,
      volume_unit,
      name,
      price,
      apv_calculation,
      ppv_calculation,
      calculation,
      stored
    } = this.state;
    const brew = {
      id: uuidv4(),
      name,
      alcohol,
      alcohol_unit,
      volume,
      volume_unit,
      price,
      calculation,
      apv_calculation,
      ppv_calculation
    };
    stored.push(brew);

    this.persistState(
      assign(cloneDeep(INITIAL_STATE), {
        stored: orderBy(
          stored,
          ["calculation", "apv_calculation", "ppv_calculation"],
          ["asc", "desc", "asc"]
        )
      })
    );
  };

  updateCalculation = () => {
    this.persistState(this.calculateCalculations(this.state));
  };

  calculateCalculations = brew => {
    const { alcohol, alcohol_unit, volume, volume_unit, price } = brew;

    var localAlcohol = alcohol;
    var localVolume = volume;
    var localAPVCalculation = null;
    var localPPVCalculation = null;
    var localCalculation = null;

    if (alcohol_unit === "ABW") {
      localAlcohol = alcohol * 1.25;
    }

    if (volume_unit === "mL") {
      localVolume = volume * 0.03381;
    } else if (volume_unit === "L") {
      localVolume = volume * 1000 * 0.03381;
    }

    if (localAlcohol && localAlcohol > 0 && localVolume && localVolume > 0) {
      localAPVCalculation = (localAlcohol / 100) * localVolume;
    }

    if (localVolume && localVolume > 0 && price && price > 0) {
      localPPVCalculation = price / localVolume;
    }

    if (
      localAlcohol &&
      localAlcohol > 0 &&
      localVolume &&
      localVolume > 0 &&
      price &&
      price > 0
    ) {
      localCalculation = price / ((localAlcohol / 100) * localVolume);
    }

    // console.log("localCalculation", localCalculation);
    // console.log("localAPVCalculation", localAPVCalculation);
    // console.log("localPPVCalculation", localPPVCalculation);

    return {
      calculation: localCalculation,
      apv_calculation: localAPVCalculation,
      ppv_calculation: localPPVCalculation
    };
  };

  reCalculateAll = () => {
    const { stored } = this.state;
    stored.forEach(storedBrew => {
      assign(storedBrew, this.calculateCalculations(storedBrew));
    });
    this.persistState({
      stored: orderBy(
        stored,
        ["calculation", "apv_calculation", "ppv_calculation"],
        ["asc", "desc", "asc"]
      )
    });
  };

  removeBrew = id => {
    const { stored } = this.state;
    remove(stored, storedBrew => storedBrew.id === id);
    this.persistState({ stored });
  };

  editBrew = brew => {
    this.persistState(brew);
    this.removeBrew(brew.id);
  };

  reset = () => {
    this.persistState(cloneDeep(INITIAL_STATE));
  };

  render() {
    const {
      name,
      alcohol,
      alcohol_unit,
      volume,
      volume_unit,
      price
    } = this.state;

    return (
      <div className="home">
        <Helmet title="BeerMiser">
          <link
            rel="manifest"
            href={process.env.PUBLIC_URL + "/manifest.json"}
          />
        </Helmet>
        <h1 className="text-center">BeerMiser</h1>
        <Form className="mt-4" autoComplete={"off"}>
          <FormGroup row>
            <Col sm={12}>
              <InputGroup>
                <Input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={name}
                  onChange={this.handleChange}
                />
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col sm={12}>
              <InputGroup>
                <Input
                  type="number"
                  name="alcohol"
                  placeholder="Alcohol"
                  value={alcohol}
                  onChange={this.handleChange}
                  min={0}
                />
                <InputGroupAddon addonType="append">
                  <Input
                    type="select"
                    name="alcohol_unit"
                    value={alcohol_unit}
                    className={"ml-2"}
                    onChange={this.handleChange}
                  >
                    <option>APV</option>
                    <option>ABW</option>
                  </Input>
                </InputGroupAddon>
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col sm={12}>
              <InputGroup>
                <Input
                  type="number"
                  name="volume"
                  placeholder="Volume"
                  value={volume}
                  onChange={this.handleChange}
                  min={0}
                />
                <InputGroupAddon addonType="append">
                  <Input
                    type="select"
                    name="volume_unit"
                    value={volume_unit}
                    className={"ml-2"}
                    onChange={this.handleChange}
                  >
                    <option>Oz</option>
                    <option>mL</option>
                    <option>L</option>
                  </Input>
                </InputGroupAddon>
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col sm={12}>
              <InputGroup>
                <Input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={price}
                  onChange={this.handleChange}
                  min={0}
                  step={0.01}
                />
                <InputGroupAddon addonType="append">$</InputGroupAddon>
              </InputGroup>
            </Col>
          </FormGroup>

          <Row>
            <Col>
              <div className="text-center my-2">{this.renderCalculation()}</div>
            </Col>
          </Row>
          <Row>
            <Col sm={{ size: 6, offset: 6 }}>
              <Button block color="success" onClick={this.saveCurrent}>
                Save
              </Button>
            </Col>
          </Row>
        </Form>

        <Row>
          <Col>
            <div className="text-center my-2">{this.renderResults()}</div>
          </Col>
        </Row>
        {
          // <div className="pt-5">
          //   <Button block color="danger" onClick={this.reCalculateAll}>
          //     reCalculateAll
          //   </Button>
          // </div>
        }
        <div className="pt-5">
          <Button block color="danger" onClick={this.reset}>
            Reset
          </Button>
        </div>
      </div>
    );
  }

  renderCalculation = () => {
    const { calculation, apv_calculation, ppv_calculation } = this.state;
    if (calculation || apv_calculation || ppv_calculation) {
      return (
        <Alert color="success">
          {calculation && (
            <h5>
              {calculation.toFixed(3)}
              <small className="noselect px-1 text-nowrap">
                <sup>$</sup>/<sub>A</sub>
              </small>
            </h5>
          )}
          {apv_calculation && (
            <h5>
              {apv_calculation.toFixed(3)}
              <small className="noselect px-1">Alc</small>
            </h5>
          )}
          {ppv_calculation && (
            <h5>
              {ppv_calculation.toFixed(3)}
              <small className="noselect px-1">
                <sup>$</sup>/<sub>oz</sub>
              </small>
            </h5>
          )}
        </Alert>
      );
    } else {
      return (
        <Alert color="success" style={{ opacity: 0.3 }}>
          <h5>Calculating....</h5>
        </Alert>
      );
    }
  };

  renderResults = () => {
    const { stored } = this.state;
    const rows = stored.map((brew, i) => {
      return (
        <React.Fragment key={brew.id}>
          <tr>
            <td className="align-middle text-left">
              <div className="mb-2">{brew.name}</div>
              <ButtonGroup>
                <Button onClick={() => this.editBrew(brew)} size={"sm"}>
                  <i className="fa fa-edit px-1"></i>
                </Button>
                <Button
                  color="danger"
                  onClick={() => this.removeBrew(brew.id)}
                  size={"sm"}
                >
                  <i className="fa fa-times px-1"></i>
                </Button>
              </ButtonGroup>
            </td>
            <td className="align-middle text-left">
              <div>{brew.price && `$${parseFloat(brew.price).toFixed(2)}`}</div>
              <div>
                <span className="mr-1">{brew.alcohol}</span>
                <small>{brew.alcohol_unit}</small>
              </div>
              <div>
                <span className="mr-1">{brew.volume}</span>
                <small>{brew.volume_unit}</small>
              </div>
            </td>
            <td className="align-middle">
              {brew.ppv_calculation && brew.ppv_calculation.toFixed(3)}
            </td>
            <td className="align-middle">
              {brew.apv_calculation && brew.apv_calculation.toFixed(3)}
            </td>
            <td className="align-middle">
              {brew.calculation && brew.calculation.toFixed(3)}
            </td>
          </tr>
        </React.Fragment>
      );
    });

    return (
      rows.length > 0 && (
        <Table dark={true} className="my-5" size={"sm"}>
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th className="noselect text-nowrap">
                <sup>$</sup>/<sub>oz</sub>
              </th>
              <th className="noselect text-nowrap">Alc</th>
              <th className="noselect text-nowrap">
                <sup>$</sup>/<sub>A</sub>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      )
    );
  };
}
