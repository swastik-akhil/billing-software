// components/Billing.js
import { useState } from 'react';

const itemsData = [
  { id: 1, name: 'Stamp Circular - 50', price: 50 },
  { id: 2, name: 'Stamp Oval - 70', price: 70 },
  { id: 3, name: 'Stamp Box - 100', price: 100 },
  { id: 4, name: 'Flex Printing 50inchx50inch - 200', price: 200 },
  { id: 5, name: 'Flex Printing 100inchx100inch - 300', price: 350 },
];

const GST_RATE = 0.10; // 10%

const Billing = () => {
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(itemsData[0]);
  const [quantity, setQuantity] = useState(1);

  const addItem = () => {
    const existingItem = cart.find(item => item.id === selectedItem.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === selectedItem.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      ));
    } else {
      setCart([...cart, { ...selectedItem, quantity }]);
    }
    setQuantity(1);
  };

  const updateQuantity = (id, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          if (newQuantity < 1) {
            return null;
          }
          return { ...item, quantity: newQuantity }; 
        }
        return item; 
      }).filter(item => item !== null); 
    });
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateGST = (subtotal) => {
    return subtotal * GST_RATE;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const gst = calculateGST(subtotal);
    return subtotal + gst;
  };

  const printBill = () => {
    const billContent = document.getElementById('bill').innerHTML;
    const newWin = window.open('', '', 'width=800,height=600');
    newWin.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              text-align: center; /* Center align the text */
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px; /* Add margin on top of the table */
            }
            th, td { 
              border: 1px solid #000; 
              padding: 8px; 
              text-align: left; 
            }
            .no-print { 
              display: none; 
            } /* Hide elements with this class during print */
            h2 {
              font-size: 24px; /* Increase font size */
              margin-bottom: 20px; /* Add space below the heading */
              color: #2c3e50; /* Change the color */
            }
          </style>
        </head>
        <body>
          <h2>RairaTech</h2>
          ${billContent}
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.focus(); 
    newWin.print();

    setTimeout(() => {
      newWin.close();
    }, 1000); 
  };

  return (
    <div className="min-h-screen w-full bg-gray-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl flex flex-col overflow-hidden">
        <h1 className="text-4xl font-bold text-center mb-6 text-cyan underline">RairaTech Billing Software</h1>
        
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="item" className="block mb-2 text-gray-700">Select Item</label>
            <select 
              id="item" 
              value={selectedItem.id} 
              onChange={(e) => setSelectedItem(itemsData.find(item => item.id === parseInt(e.target.value)))}
              className="border border-gray-300 rounded p-2 w-full focus:ring focus:ring-blue-300"
            >
              {itemsData.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="quantity" className="block mb-2 text-gray-700">Quantity</label>
            <input 
              type="number" 
              id="quantity" 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1" 
              className="border border-gray-300 rounded p-2 w-full focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        <button 
          onClick={addItem} 
          className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition mb-4"
        >
          Add Item
        </button>
        
        <div id="bill" className="mt-6 flex-1 overflow-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bill</h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Price (Rs)</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                    <td className="border border-gray-300 px-4 py-2 flex items-center justify-between">
                      <button onClick={() => updateQuantity(item.id, -1)} className="bg-red-600 text-white p-1 rounded hover:bg-red-700 transition no-print">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="bg-green-600 text-white p-1 rounded hover:bg-green-700 transition no-print">+</button>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{(item.price * item.quantity).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold text-lg">Subtotal: {calculateSubtotal().toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</h3>
              <h3 className="font-semibold text-lg">GST (10%): {calculateGST(calculateSubtotal()).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</h3>
              <h3 className="font-semibold text-lg">Total: {calculateTotal().toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</h3>
            </div>
            <button onClick={printBill} className="bg-gray-800 text-white p-3 rounded mt-4 hover:bg-gray-900 transition w-full no-print">
              Print Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
