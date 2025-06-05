
import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { MOCK_ITEM_NAMES } from '../../constants';
import { PlusCircle, Trash2, DollarSign, Tag } from 'lucide-react';

interface ShopItem {
  id: string;
  itemName: string;
  price: number;
  stock: number | 'unlimited';
  description: string;
  availableInChannels: string[]; // IDs of channels
}

const ShopSetupPage: React.FC = () => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Omit<ShopItem, 'id' | 'availableInChannels'>>({
    itemName: MOCK_ITEM_NAMES[0],
    price: 100,
    stock: 10,
    description: ''
  });

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? (value === 'unlimited' ? 'unlimited' : Number(value)) : value
    }));
  };

  const handleAddItem = () => {
    if (!newItem.itemName || newItem.price <= 0) {
      alert("Item name and a valid price are required.");
      return;
    }
    setShopItems(prev => [...prev, { ...newItem, id: Date.now().toString(), availableInChannels: [] }]);
    setNewItem({ itemName: MOCK_ITEM_NAMES[0], price: 100, stock: 10, description: '' });
    setIsAddingItem(false);
  };

  const handleRemoveItem = (id: string) => {
    setShopItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <Card title="Shop Setup">
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        Configure items available for purchase in the bot's shop. Set names, prices, stock levels, and descriptions.
      </p>

      <div className="mb-6">
        <Button onClick={() => setIsAddingItem(!isAddingItem)} leftIcon={<PlusCircle size={16} />}>
          {isAddingItem ? 'Cancel Adding Item' : 'Add New Shop Item'}
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
            />
            <Input
              label="Price (Gold)"
              name="price"
              type="number"
              value={newItem.price}
              onChange={handleNewItemChange}
              min="1"
            />
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Stock</label>
              <div className="flex items-center gap-2">
                <Input
                  name="stock"
                  type="number"
                  value={newItem.stock === 'unlimited' ? '' : newItem.stock}
                  onChange={handleNewItemChange}
                  min="0"
                  disabled={newItem.stock === 'unlimited'}
                  inputClassName="w-full"
                  containerClassName="flex-grow mb-0"
                />
                 <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-4 w-4 text-primary-600 rounded border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 focus:ring-primary-500"
                    checked={newItem.stock === 'unlimited'}
                    onChange={(e) => setNewItem(prev => ({...prev, stock: e.target.checked ? 'unlimited' : 10}))}
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
            />
          </div>
          <div className="mt-4 text-right">
            <Button onClick={handleAddItem} leftIcon={<Tag size={16}/>}>Add Item to Shop</Button>
          </div>
        </Card>
      )}

      {shopItems.length === 0 && !isAddingItem && (
        <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">No items currently in the shop. Click "Add New Shop Item" to begin.</p>
      )}

      <div className="space-y-4">
        {shopItems.map(item => (
          <Card key={item.id} title={item.itemName} className="shadow-md hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Price</p>
                <p className="font-semibold text-neutral-800 dark:text-neutral-100 flex items-center"><DollarSign size={16} className="mr-1 text-yellow-500"/> {item.price.toLocaleString()} Gold</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Stock</p>
                <p className={`font-semibold ${item.stock === 'unlimited' ? 'text-green-500' : 'text-neutral-800 dark:text-neutral-100'}`}>{item.stock === 'unlimited' ? 'Unlimited' : item.stock}</p>
              </div>
              <div className="md:col-span-3">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Description</p>
                <p className="text-neutral-700 dark:text-neutral-300">{item.description || 'No description provided.'}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 text-right">
              <Button variant="danger" size="sm" onClick={() => handleRemoveItem(item.id)} leftIcon={<Trash2 size={14}/>}>
                Remove Item
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
        Further implementation would involve saving these configurations to a backend and linking them to specific Discord channels if needed.
      </p>
    </Card>
  );
};

export default ShopSetupPage;
