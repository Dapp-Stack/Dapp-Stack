import * as React from 'react';

import styles from './FunctionDescription.module.scss';

import Button from '../../components/Button'
import Card from '../../components/Card'
import TextInput from '../../components/TextInput'
import Pill from '../../components/Pill'

class FunctionDescription extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      estimate: null,
      inputs: {},
      result: null,
      transaction: null,
      error: null,
    }
  }

  render() {
    if (this.props.func.type !== 'function') {
      return <React.Fragment />;
    }
    const func = this.props.func;
    return (
      <Card className={styles.functionCard}>
        <Card.Header>
          <Card.HeaderTitle>
            {func.name}
            {func.payable && <Pill className={styles.right} backgroundColor="orange" textColor="white">Payable</Pill>}
            {!func.constant && <Pill className={styles.right} backgroundColor="purple" textColor="white">Non-Constant</Pill>}
            {func.constant && <Pill className={styles.right} backgroundColor="red" textColor="white">Constant</Pill>}
          </Card.HeaderTitle>
        </Card.Header>
        <Card.Body>
          {func.inputs.map(
            (input, index) =>
              input.name ? (
                <div className={styles.marginTop} key={index}>
                  <TextInput label={`${input.name} (${input.type})`}
                             placeholder={input.type}
                             value={this.state.inputs[input.name]}
                             onChange={value => this.onChangeInput(value, input.name)}/>
                  </div>
              ) : (
                <React.Fragment key={index}></React.Fragment>
              ),
          )}
          {func.constant && <Button className={styles.marginTop} type="primary" onClick={this.onSubmit}>Call</Button>}
          {!func.constant && (
            <div className={styles.marginTop}>
              <Button type="primary" onClick={this.onSubmit}>Send</Button>
              <span className={styles.separator}>|</span>
              <Button onClick={this.onEstimate}>Estimate</Button>
            </div>
          )}
          
          {this.state.result && (
            <dl className={`row ${styles.marginTop}`}>
              <dt className="col-sm-3">Result:</dt>
              <dd className="col-sm-9">{JSON.stringify(this.state.result)}</dd>
            </dl>
          )}

          {this.state.error && (
            <dl className={`row ${styles.marginTop}`}>
              <dt className="col-sm-3">Error:</dt>
              <dd className="col-sm-9">{JSON.stringify(this.state.error)}</dd>
            </dl>
          )}

          {this.state.estimate && (
            <dl className={`row ${styles.marginTop}`}>
              <dt className="col-sm-3">Estimate:</dt>
              <dd className="col-sm-9">{this.state.estimate}</dd>
            </dl>
          )}

          {this.state.transaction && (
            <dl className={`row ${styles.marginTop}`}>
              <dt className="col-sm-3">Transaction:</dt>
              <dd className="col-sm-9" style={{ wordWrap: 'break-word' }}>
                {this.state.transaction.hash}
              </dd>
            </dl>
          )}
        </Card.Body>
      </Card>
    );
  }

  onChangeInput = (value, name) => {
    if (!name) return;
    let newInputs = this.state.inputs;
    newInputs[name] = value;
    this.setState({ inputs: newInputs });
  };

  onEstimate = async () => {
    const args = Object.values(this.state.inputs);
    try {
      const estimate = await this.props.contract.estimate[this.props.func.name](...args);
      this.setState({ estimate: estimate.toString(), error: null });
    } catch (error) {
      this.setState({ error });
    }
  };

  onSubmit = async () => {
    const args = Object.values(this.state.inputs);
    try {
      if (this.props.func.constant) {
        const result = await this.props.contract[this.props.func.name](...args);
        this.setState({ result, error: null });
      } else {
        const transaction = await this.props.contract[this.props.func.name](...args);
        await transaction.wait();
        this.setState({ transaction, error: null });
      }
    } catch (error) {
      this.setState({ error });
    }
  };
}

export default FunctionDescription;
