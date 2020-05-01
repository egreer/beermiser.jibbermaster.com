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
import { Size, Brew } from "../../models/brew";

const INITIAL_SIZE: Size = {
  id: uuidv4(),
  volume: "",
  volume_unit: "Oz",
  price: "",
  calculation: null,
  apv_calculation: null,
  ppv_calculation: null
};

const INITIAL_BREW: Brew = {
  id: uuidv4(),
  name: "",
  alcohol: "",
  alcohol_unit: "APV",
  sizes: [cloneDeep(INITIAL_SIZE)]
};

const INITIAL_STATE: {
  stored: Array<any>;
  brew: Brew;
} = {
  stored: [],
  brew: cloneDeep(INITIAL_BREW)
};

export class Home extends Component {
  state = cloneDeep(INITIAL_STATE);

  componentDidMount = () => {
    const state = store.get("beermiser-state") || cloneDeep(INITIAL_STATE);
    this.setState(state);
  };

  persistState = (state: any, callback?: Function) => {
    this.setState(state, () => {
      store.set("beermiser-state", this.state);
      if (isFunction(callback)) {
        callback();
      }
    });
  };

  handleChange = (event: any) => {
    const { brew } = this.state;
    this.persistState(
      { brew: set(brew, event.target.name, event.target.value) },
      this.updateCalculation
    );
  };

  handleVolumeChange = (event: any, id: string) => {
    console.log(event, id);
    const { brew } = this.state;
    const { sizes } = this.state.brew;
    sizes.map(v => {
      if (v.id === id) {
        set(v, event.target.name, event.target.value);
      }
      return v;
    });
    this.persistState(brew, this.updateCalculation);
  };

  saveCurrent = () => {
    console.log("Save Current", this.state);
    const { brew, stored } = this.state;

    brew.id = uuidv4();
    brew.sizes.forEach(size => {
      size.id = uuidv4();
      stored.push(this.buildBrewSize(brew, size));
    });

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

  buildBrewSize = (brew: Brew, size: Size) => {
    console.log("brew", brew);
    console.log("size", size);
    const brewSize = assign({}, brew, size);
    console.log("brewSize", brewSize);
    delete brewSize.sizes;
    assign(brewSize, { brewId: brew.id, id: size.id });
    return brewSize;
  };

  updateCalculation = () => {
    this.persistState({ brew: this.calculateCalculations(this.state.brew) });
  };

  calculateCalculations = (brew: Brew) => {
    const { alcohol, alcohol_unit } = brew;
    brew.sizes.forEach((size: Size) => {
      const { volume, volume_unit, price } = size;

      let localAlcohol = parseFloat(alcohol);
      let localVolume = parseFloat(volume);
      let localAPVCalculation = null;
      let localPPVCalculation = null;
      let localCalculation = null;

      if (alcohol && alcohol_unit === "ABW") {
        localAlcohol = parseFloat(alcohol) * 1.25;
      }

      if (volume && volume_unit === "mL") {
        localVolume = parseFloat(volume) * 0.03381;
      } else if (volume && volume_unit === "L") {
        localVolume = parseFloat(volume) * 1000 * 0.03381;
      }

      if (localAlcohol && localAlcohol > 0 && localVolume && localVolume > 0) {
        localAPVCalculation = (localAlcohol / 100) * localVolume;
      }

      if (localVolume && localVolume > 0 && price && parseFloat(price) > 0) {
        localPPVCalculation = parseFloat(price) / localVolume;
      }

      if (
        localAlcohol &&
        localAlcohol > 0 &&
        localVolume &&
        localVolume > 0 &&
        price &&
        parseFloat(price) > 0
      ) {
        localCalculation =
          parseFloat(price) / ((localAlcohol / 100) * localVolume);
      }

      // console.log("size", size);
      // console.log("localCalculation", localCalculation);
      // console.log("localAPVCalculation", localAPVCalculation);
      // console.log("localPPVCalculation", localPPVCalculation);
      assign(size, {
        calculation: localCalculation,
        apv_calculation: localAPVCalculation,
        ppv_calculation: localPPVCalculation
      });
    });

    return brew;
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

  removeActiveBrewSize = (sizeId: string) => {
    const { brew } = this.state;
    remove(brew.sizes, size => size.id === sizeId);
    this.persistState({ brew });
  };

  removeBrewSize = (id: string) => {
    const { stored } = this.state;
    remove(stored, storedBrew => storedBrew.id === id);
    this.persistState({ stored });
  };

  removeBrew = (id: string) => {
    const { stored } = this.state;
    remove(stored, storedBrew => storedBrew.brewId === id);
    this.persistState({ stored });
  };

  editBrew = (brewSize: any) => {
    const brew = this.rebuildBrew(brewSize.brewId);
    this.persistState({ brew });
    this.removeBrew(brew.id);
  };

  rebuildBrew = (brewId: string): Brew => {
    const { stored } = this.state;
    const sizes = stored.filter(brewSize => brewSize.brewId == brewId);
    const brew: Brew = {
      id: brewId,
      name: sizes[0].name,
      alcohol: sizes[0].alcohol,
      alcohol_unit: sizes[0].alcohol_unit,
      sizes
    };
    sizes.forEach(s => {
      delete s.name;
      delete s.alcohol;
      delete s.alcohol_unit;
    });
    return brew;
  };

  addSize = () => {
    const { brew } = this.state;
    const newSize = cloneDeep(INITIAL_SIZE);
    newSize.id = uuidv4();
    brew.sizes.push(newSize);
    this.persistState({ brew });
  };

  reset = () => {
    this.persistState(cloneDeep(INITIAL_STATE));
  };

  render() {
    const { brew } = this.state;
    const { name, alcohol, alcohol_unit, sizes } = brew;

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

          {this.renderSizes(sizes)}

          <Row>
            <Col sm={{ size: 6, offset: 6 }}>
              <Button block onClick={this.addSize}>
                Add Size
              </Button>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="text-center my-2">
                {this.renderCalculations(brew)}
              </div>
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

  renderSizes = (sizes: Array<any>) => {
    return sizes?.map((v, i) => (
      <FormGroup row key={i}>
        <Col xs={{ size: 12 }} sm={6} className={"mb-3 mb-sm-0"}>
          <InputGroup>
            <Input
              type="number"
              name="volume"
              placeholder="Volume"
              value={v.volume}
              onChange={e => this.handleVolumeChange(e, v.id)}
              min={0}
            />
            <InputGroupAddon addonType="append">
              <Input
                type="select"
                name="volume_unit"
                value={v.volume_unit}
                className={"ml-2"}
                onChange={e => this.handleVolumeChange(e, v.id)}
              >
                <option>Oz</option>
                <option>mL</option>
                <option>L</option>
              </Input>
            </InputGroupAddon>
          </InputGroup>
        </Col>
        <Col xs={{ size: 10 }} sm={4} className={"mb-3 mb-sm-0 pr-1"}>
          <InputGroup>
            <Input
              type="number"
              name="price"
              placeholder="Price"
              value={v.price}
              onChange={e => this.handleVolumeChange(e, v.id)}
              min={0}
              step={0.01}
            />
            <InputGroupAddon addonType="append">$</InputGroupAddon>
          </InputGroup>
        </Col>
        <Col>
          <Button
            color="danger"
            block
            disabled={sizes.length <= 1}
            onClick={() => this.removeActiveBrewSize(v.id)}
          >
            <i className="fa fa-trash"></i>
          </Button>
        </Col>
      </FormGroup>
    ));
  };

  renderCalculations = (brew: Brew) => {
    return (
      <Alert color="success" className="calculations">
        {brew.sizes.map(s => this.renderCalculation(s))}
      </Alert>
    );
  };

  renderCalculation = (size: Size) => {
    if (size) {
      const {
        calculation,
        apv_calculation,
        ppv_calculation,
        volume,
        volume_unit
      } = size;

      let cols = (
        <Col xs={6} sm={9} style={{ opacity: 0.3 }}>
          <h5>Calculating....</h5>
        </Col>
      );

      if (calculation || apv_calculation || ppv_calculation) {
        cols = (
          <>
            <Col xs={6} sm={3}>
              {calculation && (
                <h5>
                  {calculation.toFixed(3)}
                  <small className="noselect px-1 text-nowrap">
                    <sup>$</sup>/<sub>A</sub>
                  </small>
                </h5>
              )}
            </Col>
            <Col xs={6} sm={3}>
              {apv_calculation && (
                <h5>
                  {apv_calculation.toFixed(3)}
                  <small className="noselect px-1">Alc</small>
                </h5>
              )}
            </Col>
            <Col xs={6} sm={3}>
              {ppv_calculation && (
                <h5>
                  {ppv_calculation.toFixed(3)}
                  <small className="noselect px-1">
                    <sup>$</sup>/<sub>oz</sub>
                  </small>
                </h5>
              )}
            </Col>
          </>
        );
      }

      return (
        <Row>
          <Col xs={6} sm={3}>
            <h5>
              {volume} {volume_unit}
            </h5>
          </Col>
          {cols}
        </Row>
      );
    }

    //return; <></>;
    //   <Alert color="success" style={{ opacity: 0.3 }}>
    //     <h5>Calculating....</h5>
    //   </Alert>
    // );
  };

  renderResults = () => {
    const { stored } = this.state;
    const rows = stored.map(brewSize => {
      return (
        <React.Fragment key={brewSize.id}>
          <tr>
            <td className="align-middle text-left">
              <div className="mb-2">{brewSize.name}</div>
              <ButtonGroup>
                <Button onClick={() => this.editBrew(brewSize)} size={"sm"}>
                  <i className="fa fa-edit px-1"></i>
                </Button>
                <Button
                  color="danger"
                  onClick={() => this.removeBrewSize(brewSize.id)}
                  size={"sm"}
                >
                  <i className="fa fa-times px-1"></i>
                </Button>
              </ButtonGroup>
            </td>
            <td className="align-middle text-left">
              <div>
                {brewSize.price && `$${parseFloat(brewSize.price).toFixed(2)}`}
              </div>
              <div>
                <span className="mr-1">{brewSize.alcohol}</span>
                <small>{brewSize.alcohol_unit}</small>
              </div>
              <div>
                <span className="mr-1">{brewSize.volume}</span>
                <small>{brewSize.volume_unit}</small>
              </div>
            </td>
            <td className="align-middle">
              {brewSize.ppv_calculation && brewSize.ppv_calculation.toFixed(3)}
            </td>
            <td className="align-middle">
              {brewSize.apv_calculation && brewSize.apv_calculation.toFixed(3)}
            </td>
            <td className="align-middle">
              {brewSize.calculation && brewSize.calculation.toFixed(3)}
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
