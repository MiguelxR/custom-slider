"use client";

import { TRangeMode } from '@/types/types';
import NormalRange from './NomalRange';
import './Range.css';
import FixedValues from './FixedValues';

type Props = {
    RangeMode: TRangeMode;
};

const Range = ({ RangeMode }: Props) => {

  const normal_mode = "Normal";

  const fixed_values_mode = "FixedValues";

  return (
    <>
    {RangeMode === normal_mode ? <NormalRange Currency='€'/> : fixed_values_mode ===  fixed_values_mode ? <FixedValues Currency='€'/> : null}
    </>
  );
};

export default Range;