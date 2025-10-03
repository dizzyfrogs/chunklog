import React from 'react';
import FoodForm from './FoodForm';
import WeightLog from './WeightLog';

function AddEntry({ onEntryAdded }) {

  const handleAction = () => {
    if(onEntryAdded) onEntryAdded();
  }

  return (
    <div>
      <FoodForm onFoodAdded={handleAction} />
      <hr />
      <WeightLog />
    </div>
  );
}

export default AddEntry;