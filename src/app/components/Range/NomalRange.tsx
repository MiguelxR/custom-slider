"use client";

import { useEffect, useState } from 'react';
import './Range.css';
import { getRange } from '@/app/services/getRange';

type Props = {
  Currency: string;
};

const NormalRange = ({ Currency }: Props) => {
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(100);
  const [selectedMinValue, setSelectedMinValue] = useState(minValue);
  const [selectedMaxValue, setSelectedMaxValue] = useState(maxValue);
  const [isEditingMin, setIsEditingMin] = useState(false);
  const [isEditingMax, setIsEditingMax] = useState(false);

  useEffect(() => {
    getRange().then((data) => {     
      setMinValue(data.min);
      setMaxValue(data.max);
    }).catch((error) => {
      console.error("Error al obtener el rango:", error);
    });
  }, [])
  

  const handleDrag = (
    event: MouseEvent,
    setValue: React.Dispatch<React.SetStateAction<number>>,
    otherValue: number,
    isMin: boolean
  ) => {
    const rangeElement = document.querySelector(".range-line") as HTMLDivElement;
    const rangeRect = rangeElement.getBoundingClientRect();
    const relativeX = event.clientX - rangeRect.left;

    // Convert the mouse position to a value within the range
    const newValue = Math.round((relativeX / rangeRect.width) * maxValue);

    // Ensure the value stays within bounds and does not overlap
    if (isMin) {
      setValue(Math.max(minValue, Math.min(newValue, otherValue - 1)));
    } else {
      setValue(Math.min(maxValue, Math.max(newValue, otherValue + 1)));
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

  const handleMinValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isNaN(Number(newValue)) && Number(newValue) < selectedMaxValue && Number(newValue) >= minValue) {
      setSelectedMinValue(Number(newValue));
    }
  };

  const handleMaxValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isNaN(Number(newValue)) && Number(newValue) > selectedMinValue && Number(newValue) <= maxValue) {
      setSelectedMaxValue(Number(newValue));
    }
  }

  const handleMinValueBlur = () => {
    setIsEditingMin(false);
  };

  return (
    <div className="range-container">
      <div className="range-line">
        <div
          className="range-handle range-handle-min"
          style={{ left: `${(selectedMinValue / maxValue) * 100}%` }}
          onMouseDown={handleMouseDown(setSelectedMinValue, selectedMaxValue, true)}
        />
        <div
          className="range-handle range-handle-max"
          style={{ left: `${(selectedMaxValue / maxValue) * 100}%` }}
          onMouseDown={handleMouseDown(setSelectedMaxValue, selectedMinValue, false)}
        />
      </div>
      <div className="range-values">
        {isEditingMin ? (
          <input
            type="text"
            value={selectedMinValue}
            onChange={handleMinValueChange}
            onBlur={handleMinValueBlur}
            autoFocus
          />
        ) : (
          <span onClick={() => setIsEditingMin(true)}>{Currency} {selectedMinValue}</span>
        )}
        {isEditingMax ? ( 
          <input type="text" 
          value={selectedMaxValue} 
          onChange={handleMaxValueChange} 
          onBlur={() => setIsEditingMax(false)} autoFocus /> 
          ) : ( 
          <span onClick={() => setIsEditingMax(true)}>{Currency} {selectedMaxValue}</span> 
          )}
      </div>
    </div>
  );
};

export default NormalRange;