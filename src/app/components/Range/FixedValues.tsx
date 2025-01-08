import { useState, useEffect } from 'react';
import './Range.css';
import { getArrayValues } from '@/app/services/getArrayValues';


type Props = {
  Currency: string;
  values?: number[];
};

const FixedValues = ({ Currency}: Props) => {
  const [values, setValues] = useState([1.99, 5.99, 10.99, 30.99, 50.99, 70.99]);
  const [minValue, setMinValue] = useState(values[0]);
  const [maxValue, setMaxValue] = useState(values[values.length - 1]);
  const [selectedMinValue, setSelectedMinValue] = useState(minValue);
  const [selectedMaxValue, setSelectedMaxValue] = useState(maxValue);

  useEffect(() => {
    getArrayValues().then((data) => {
      const arrayValues = data.getArrayValues;
      setValues(arrayValues);
      setMinValue(arrayValues[0]);
      setMaxValue(arrayValues[arrayValues - 1]);
    })
  }, []);


  const handleDrag = (
    event: MouseEvent,
    setValue: React.Dispatch<React.SetStateAction<number>>,
    otherValue: number,
    isMin: boolean
  ) => {
    const rangeElement = document.querySelector(".range-line") as HTMLDivElement;
    const rangeRect = rangeElement.getBoundingClientRect();
    const relativeX = event.clientX - rangeRect.left;
    const index = Math.round((relativeX / rangeRect.width) * (values.length - 1));

    const newValue = values[index];

    if (isMin) {
      if (newValue < otherValue) {
        setValue(newValue);
        setSelectedMinValue(newValue);
      }
    } else {
      if (newValue > otherValue) {
        setValue(newValue);
        setSelectedMaxValue(newValue);
      }
    }
  };

  const handleMouseDown = (
    setValue: React.Dispatch<React.SetStateAction<number>>,
    otherValue: number,
    isMin: boolean
  ) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();

    const onMouseMove = (event: MouseEvent) => {
      handleDrag(event, setValue, otherValue, isMin);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="range-container">
      <div className="range-line">
        <div
          className="range-handle range-handle-min"
          data-testid="handler-one"
          style={{ left: `${(values.indexOf(selectedMinValue) / (values.length - 1)) * 100}%` }}
          onMouseDown={handleMouseDown(setSelectedMinValue, selectedMaxValue, true)}
        />
        <div
          className="range-handle range-handle-max"
          style={{ left: `${(values.indexOf(selectedMaxValue) / (values.length - 1)) * 100}%` }}
          onMouseDown={handleMouseDown(setSelectedMaxValue, selectedMinValue, false)}
        />
      </div>
      <div className="range-values">
        <span>{Currency} {selectedMinValue}</span>
        <span>{Currency} {selectedMaxValue}</span>
      </div>
    </div>
  );
};

export default FixedValues;