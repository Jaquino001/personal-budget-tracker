import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import AddCreditCardForm from './AddCreditCardForm';

function CreditCardSection({ creditCards }) {
  const { updateCreditCard, deleteCreditCard } = useBudget();
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    limit: 0,
    balance: 0,
    color: '#3498db'
  });

  const handleEditCard = (card) => {
    setEditingCardId(card.id);
    setFormData({
      name: card.name,
      limit: card.limit,
      balance: card.balance,
      color: card.color
    });
  };

  const handleSaveEdit = () => {
    if (!formData.name || formData.limit <= 0) {
      alert('Please provide a valid name and limit.');
      return;
    }

    updateCreditCard({
      id: editingCardId,
      name: formData.name,
      limit: parseFloat(formData.limit),
      balance: parseFloat(formData.balance),
      color: formData.color
    });
    
    setEditingCardId(null);
  };

  const handleDeleteCard = (id) => {
    if (window.confirm('Are you sure you want to delete this credit card?')) {
      deleteCreditCard(id);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getUtilizationColor = (utilization) => {
    if (utilization >= 0.8) return 'bg-red-500';
    if (utilization >= 0.5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Credit Cards</h2>
        <button 
          className="text-blue-500 hover:text-blue-700"
          onClick={() => setShowAddCard(!showAddCard)}
        >
          {showAddCard ? 'Cancel' : 'Add Card'}
        </button>
      </div>
      
      {showAddCard ? (
        <AddCreditCardForm onCancel={() => setShowAddCard(false)} />
      ) : (
        <div className="space-y-4">
          {creditCards.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No credit cards added yet.
            </div>
          ) : (
            creditCards.map((card) => {
              const utilization = card.balance / card.limit;
              
              return (
                <div 
                  key={card.id} 
                  className="border rounded-lg p-4 relative overflow-hidden"
                  style={{ borderColor: card.color }}
                >
                  {editingCardId === card.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit</label>
                          <input
                            type="number"
                            name="limit"
                            value={formData.limit}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Current Balance</label>
                          <input
                            type="number"
                            name="balance"
                            value={formData.balance}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Color</label>
                        <input
                          type="color"
                          name="color"
                          value={formData.color}
                          onChange={handleChange}
                          className="w-full h-10 p-1 border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                      <div className="flex justify-end space-x-2 mt-3">
                        <button
                          className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                          onClick={() => setEditingCardId(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={handleSaveEdit}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg" style={{ color: card.color }}>{card.name}</h3>
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleEditCard(card)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteCard(card.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Credit Limit</p>
                          <p className="font-bold">${card.limit.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Current Balance</p>
                          <p className="font-bold">${card.balance.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm text-gray-500 flex justify-between">
                          <span>Credit Utilization</span>
                          <span>{(utilization * 100).toFixed(1)}%</span>
                        </p>
                        <div className="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full ${getUtilizationColor(utilization)}`}
                            style={{ width: `${Math.min(utilization * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm text-gray-500">Available Credit</p>
                        <p className="font-bold">${(card.limit - card.balance).toFixed(2)}</p>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default CreditCardSection;