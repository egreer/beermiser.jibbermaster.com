import React, { Component } from "react";
import { Helmet } from "react-helmet-async";
import {
  Alert,
  Button,
  ButtonGroup,
  Col,
  Form,
  InputGroup,
  Row,
  Table
} from "react-bootstrap";
import {
  assign,
  set,
  isFunction,
  cloneDeep,
  remove,
  orderBy,
  some
} from "lodash";
import store from "store/dist/store.modern";
import uuidv4 from "uuid/v4";
import { Size, Brew } from "../../models/brew";
import { Confirm } from "../../confirm/Confirm";

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

  currentValid = () => {
    const { brew } = this.state;
    const hasSize = some(brew.sizes, (s: Size) => s.volume || s.price);
    return brew.name || brew.alcohol || hasSize;
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
    assign(brewSize, { brewId: brew.id, id: size.id, sizes: [] });
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
    if (this.currentValid()) {
      this.saveCurrent();
    }
    const brew = this.rebuildBrew(brewSize.brewId);
    this.persistState({ brew });
    this.removeBrew(brew.id);
  };

  rebuildBrew = (brewId: string): Brew => {
    const { stored } = this.state;
    const sizes = stored.filter(brewSize => brewSize.brewId === brewId);
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
          <Form.Group as={Row}>
            <Col sm={12}>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={name}
                  onChange={this.handleChange}
                />
              </InputGroup>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Col sm={12}>
              <InputGroup>
                <Form.Control
                  type="number"
                  name="alcohol"
                  placeholder="Alcohol"
                  value={alcohol}
                  onChange={this.handleChange}
                  min={0}
                />
                <InputGroup.Append>
                  <Form.Control
                    as="select"
                    name="alcohol_unit"
                    value={alcohol_unit}
                    className="rounded-right"
                    style={{ borderRadius: 0 }}
                    onChange={this.handleChange}
                  >
                    <option>APV</option>
                    <option>ABW</option>
                  </Form.Control>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Form.Group>

          {this.renderSizes(sizes)}

          <Row>
            <Col sm={{ span: 6, offset: 6 }}>
              <Button block variant="secondary" onClick={this.addSize}>
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
            <Col sm={{ span: 6, offset: 6 }}>
              <Button
                block
                variant="success"
                onClick={this.saveCurrent}
                disabled={!this.currentValid()}
              >
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
          //   <Button block variant="danger" onClick={this.reCalculateAll}>
          //     reCalculateAll
          //   </Button>
          // </div>
        }
        <div className="pt-5">
          <Confirm
            onConfirm={this.reset}
            triggerText="Reset"
            confirmText="Reset"
            headerText="Reset Brews?"
            confirmVariant="danger"
            triggerButtonParams={{ block: true, variant: "danger" }}
          />
        </div>
      </div>
    );
  }

  renderSizes = (sizes: Array<any>) => {
    return sizes?.map((v, i) => (
      <Form.Group as={Row} key={i}>
        <Col xs={{ span: 6 }} className={"mb-3 mb-sm-0"}>
          <InputGroup>
            <Form.Control
              type="number"
              name="volume"
              placeholder="Volume"
              value={v.volume}
              onChange={e => this.handleVolumeChange(e, v.id)}
              min={0}
            />
            <InputGroup.Append>
              <Form.Control
                as="select"
                name="volume_unit"
                value={v.volume_unit}
                className="rounded-right"
                style={{ borderRadius: 0 }}
                onChange={e => this.handleVolumeChange(e, v.id)}
              >
                <option>Oz</option>
                <option>mL</option>
                <option>L</option>
              </Form.Control>
            </InputGroup.Append>
          </InputGroup>
        </Col>
        <Col xs={{ span: 4 }} className={"mb-3 mb-sm-0 pr-1"}>
          <InputGroup>
            <Form.Control
              type="number"
              name="price"
              placeholder="Price"
              value={v.price}
              onChange={e => this.handleVolumeChange(e, v.id)}
              min={0}
              step={0.01}
            />
            <InputGroup.Append>
              <InputGroup.Text>$</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Col>
        <Col xs={{ span: 2 }}>
          <Button
            variant="danger"
            block
            disabled={sizes.length <= 1}
            onClick={() => this.removeActiveBrewSize(v.id)}
          >
            <i className="fa fa-trash"></i>
          </Button>
        </Col>
      </Form.Group>
    ));
  };

  renderCalculations = (brew: Brew) => {
    return (
      <Alert variant="success" className="calculations">
        {brew.sizes.map((s, i) => this.renderCalculation(s, i))}
      </Alert>
    );
  };

  renderCalculation = (size: Size, index: number) => {
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
        <Row key={index}>
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
    //   <Alert variant="success" style={{ opacity: 0.3 }}>
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
                <Button
                  variant="secondary"
                  onClick={() => this.editBrew(brewSize)}
                  size={"sm"}
                >
                  <i className="fa fa-edit px-1"></i>
                </Button>
                <Button
                  variant="danger"
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
        <Table variant="dark" className="my-5" size="sm" hover>
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
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      )
    );
  };
}
