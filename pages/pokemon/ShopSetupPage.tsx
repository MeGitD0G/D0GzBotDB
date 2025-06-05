
import React, { useState, useEffect } from 'react';
import Card from '../../ui/Card'; 
import Button from '../../ui/Button'; 
import Input from '../../ui/Input'; 
import Select from '../../ui/Select'; 
import { MOCK_ITEM_NAMES } from '../../constants';
import { PlusCircle, Trash2, DollarSign, Tag, Save, AlertCircle } from 'lucide-react';

interface ShopItem {
  id?: string; // Optional for new items before saving, backend will assign _id
  _id?: string; // From MongoDB
  itemName: string;
  price: number;
  stock: number | 'unlimited';
  description: string;
}

const ShopSetupPage: React.FC = () => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Omit<ShopItem, 'id' | '_id'>>({
    itemName: MOCK_ITEM_NAMES[0] || '',
    price: 100,
    stock: 10,
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const fetchShopItems = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    console.log("Fetching shop items (mock)...");
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      // Mock success with empty data or sample data
      const mockData: ShopItem[] = [
        // Example:
        // { _id: 'mock-item-1', itemName: 'Pokeball', price: 200, stock: 50, description: 'A device for catching wild Pokémon.'},
        // { _id: 'mock-item-2', itemName: 'Potion', price: 300, stock: 'unlimited', description: 'Restores HP of one Pokémon by 20.'}
      ];
      setShopItems(mockData);
    } catch (error: any) {
      setStatusMessage({type: 'error', message: `Error loading items (mock): ${error.message}`});
      setShopItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShopItems();
  }, []);

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target; 
    setNewItem(prev => {
      if (name === 'stock') {
        if (prev.stock === 'unlimited') { // if unlimited is checked, this field is disabled, but good to handle
          return prev; 
        }
        const numericValue = parseInt(value, 10);
        return { ...prev, stock: isNaN(numericValue) ? 0 : numericValue }; // default to 0 if NaN
      }
      if (name === 'price') {
        return { ...prev, price: parseInt(value, 10) || 0 };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleAddItem = () => {
    if (!newItem.itemName || newItem.price <= 0 || (typeof newItem.stock === 'number' && newItem.stock < 0)) {
      setStatusMessage({type: 'error', message: "Item name, valid price, and non-negative stock are required."});
      return;
    }
    const itemToAdd: ShopItem = { 
        ...newItem, 
        id: `temp-${Date.now().toString()}`, // Temporary local ID
        stock: newItem.stock // Ensure stock is correctly passed
    }; 
    setShopItems(prev => [...prev, itemToAdd]);
    setNewItem({ itemName: MOCK_ITEM_NAMES[0] || '', price: 100, stock: 10, description: '' });
    setIsAddingItem(false);
    setStatusMessage({type: 'success', message: `${newItem.itemName} added locally. Save all changes to persist (mock).`});
  };

  const handleRemoveItem = (idToRemove?: string) => {
    if (!idToRemove) return;
    setShopItems(prev => prev.filter(item => (item.id || item._id) !== idToRemove));
    setStatusMessage({type: 'success', message: `Item removed locally. Save all changes to persist (mock).`});
  };

  const handleSaveAllShopItems = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    console.log("Saving all shop items (mock):", shopItems);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      // Simulate backend assigning _id and removing temporary id
      const itemsToSave = shopItems.map(({ id, ...rest }) => ({
        ...rest,
        _id: rest._id || `mock-saved-${Date.now()}-${Math.random()}` // Ensure items have an _id for display
      }));
      
      setShopItems(itemsToSave); // Update local state with "saved" items
      setStatusMessage({type: 'success', message: 'Shop items saved successfully (mock)!'});
    } catch (error: any) {
      setStatusMessage({type: 'error', message: `Error saving items (mock): ${error.message}`});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Shop Setup">
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        Configure items available for purchase in the bot's shop. Set names, prices, stock levels, and descriptions. Backend interactions are currently mocked.
      </p>

      {statusMessage && (
        <div className={`my-4 p-3 rounded-md text-sm flex items-center ${statusMessage.type === 'success' ? 'bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-200'}`}>
          <AlertCircle size={18} className={`mr-2 ${statusMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}/>
          {statusMessage.message}
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <Button onClick={() => setIsAddingItem(!isAddingItem)} leftIcon={<PlusCircle size={16} />} disabled={isLoading}>
          {isAddingItem ? 'Cancel Adding Item' : 'Add New Shop Item'}
        </Button>
        <Button onClick={handleSaveAllShopItems} leftIcon={<Save size={16} />} isLoading={isLoading} disabled={isLoading || shopItems.length === 0}>
          {isLoading ? 'Saving...' : 'Save All Shop Items (Mock)'}
        </Button>
      </div>

      {isAddingItem && (
        <Card title="Add New Item" className="mb-6 bg-neutral-50 dark:bg-neutral-750">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Item Name"
              name="itemName"
              options={MOCK_ITEM_NAMES.map(name => ({ label: name, value: name }))}
              value={newItem.itemName}
              onChange={handleNewItemChange}
              containerClassName="mb-0"
            />
            <Input
              label="Price (Gold)"
              name="price"
              type="number"
              value={newItem.price} 
              onChange={handleNewItemChange}
              min="1"
              containerClassName="mb-0"
            />
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Stock</label>
              <div className="flex items-center gap-2">
                <Input
                  name="stock"
                  type="number"
                  value={newItem.stock === 'unlimited' || newItem.stock === undefined ? '' : newItem.stock}
                  onChange={handleNewItemChange}
                  min="0" 
                  disabled={newItem.stock === 'unlimited'}
                  inputClassName="w-full"
                  containerClassName="flex-grow mb-0"
                  placeholder="Number or leave blank for 0"
                />
                 <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-4 w-4 text-primary-600 rounded border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 focus:ring-primary-500"
                    checked={newItem.stock === 'unlimited'}
                    onChange={(e) => setNewItem(prev => ({...prev, stock: e.target.checked ? 'unlimited' : (typeof prev.stock === 'number' ? prev.stock : 10)}))}
                    />
                  <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">Unlimited</span>
                </label>
              </div>
            </div>
            <Input
              label="Description (Optional)"
              name="description"
              type="text"
              value={newItem.description}
              onChange={handleNewItemChange}
              inputClassName="md:col-span-2"
              containerClassName="md:col-span-2 mb-0"
            />
          </div>
          <div className="mt-4 text-right">
            <Button onClick={handleAddItem} leftIcon={<Tag size={16}/>}>Add Item to List</Button>
          </div>
        </Card>
      )}

      {isLoading && shopItems.length === 0 && !isAddingItem && (
         <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            <p className="ml-3 text-neutral-500 dark:text-neutral-400">Loading shop items...</p>
        </div>
      )}
      {!isLoading && shopItems.length === 0 && !isAddingItem && (
        <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">No items currently in the shop. Click "Add New Shop Item" to begin, then "Save All Shop Items".</p>
      )}

      <div className="space-y-4">
        {shopItems.map(item => (
          <Card key={item.id || item._id} title={item.itemName} className="shadow-md hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Price</p>
                <p className="font-semibold text-neutral-800 dark:text-neutral-100 flex items-center"><DollarSign size={16} className="mr-1 text-yellow-500"/> {item.price.toLocaleString()} Gold</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Stock</p>
                <p className={`font-semibold ${item.stock === 'unlimited' ? 'text-green-500' : 'text-neutral-800 dark:text-neutral-100'}`}>{item.stock === 'unlimited' ? 'Unlimited' : (item.stock === undefined ? 'N/A' : item.stock)}</p>
              </div>
              <div className="md:col-span-3">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Description</p>
                <p className="text-neutral-700 dark:text-neutral-300">{item.description || 'No description provided.'}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 text-right">
              <Button variant="danger" size="sm" onClick={() => handleRemoveItem(item.id || item._id)} leftIcon={<Trash2 size={14}/>} disabled={isLoading}>
                Remove Item
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default ShopSetupPage;
