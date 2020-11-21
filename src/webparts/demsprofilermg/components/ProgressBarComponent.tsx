import * as React from 'react';

const ProgressBarComponent = (props) => {
  const { bgcolor, completed } = props;

  const containerStyles = {
    height: 20,
    width: '90%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: 50
  };

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: 'inherit',
    textAlign: 'right'
  };

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  };

  return (
    <div style={{height: 20,
          width: '100%',
          backgroundColor: "#e0e0de",
          borderRadius: 50,
          margin: "5px 0px 20px 0px"}}>
    <div style={{ height: '100%',
        width: `${completed}%`,
        backgroundColor: bgcolor,
        borderRadius: 'inherit',
        textAlign: 'right'}}>
        <span style={{padding: 5,
    color: 'white',
    fontWeight: 'bold'}}>{`${completed}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBarComponent;