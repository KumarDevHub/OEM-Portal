import logo from "./logo.svg";
import "./App.css";
import { Plus, Edit, Trash2 } from 'lucide-react'; // Import Plus, Edit, and Trash2 icons
import AddCustomer from "./AddCustomer"
import "./cust.css"

import React, { useState, useMemo, useEffect } from "react"; // Added useEffect import

// Mock data for customer information with multiple shipToAddresses
const customerData = {
  "CUST-0056": {
    customerName: "Acme Corp.",
    shipToAddresses: [
      "123 Main St, Anytown, USA",
      "456 Oak Ave, Somewhere, USA",
      "789 Pine Ln, Anyplace, USA",
    ],
  },
  "CUST-0077": {
    customerName: "Global Solutions Inc.",
    shipToAddresses: [
      "456 Tech Park Dr, Technoville, CA",
      "101 Innovation Blvd, Future City, CA",
    ],
  },
  "CUST-0099": {
    customerName: "Future Innovations Ltd.",
    shipToAddresses: [
      "789 Innovation Way, New City, NY",
      "202 Research Rd, Old Town, NY",
      "303 Progress Pl, Anotherburg, NY",
      "404 Discovery Dr, Distantland, NY",
    ],
  },
  // Add more mock customers as needed
};

// Mock data for items and units of measure
const mockItems = [
  {
    id: "ITEM-A123",
    name: "Product Alpha",
    defaultUomId: "EA",
    defaultUnitPrice: 15.0,
  },
  {
    id: "ITEM-B456",
    name: "Product Beta",
    defaultUomId: "BOX",
    defaultUnitPrice: 25.5,
  },
  {
    id: "ITEM-C789",
    name: "Product Gamma",
    defaultUomId: "PC",
    defaultUnitPrice: 75.0,
  },
  {
    id: "ITEM-D101",
    name: "Product Delta",
    defaultUomId: "EA",
    defaultUnitPrice: 12.0,
  },
  {
    id: "ITEM-E202",
    name: "Product Epsilon",
    defaultUomId: "SET",
    defaultUnitPrice: 30.0,
  },
  {
    id: "ITEM-F303",
    name: "Product Zeta",
    defaultUomId: "PC",
    defaultUnitPrice: 100.0,
  },
];

const mockUOMs = [
  { id: "EA", name: "Each" },
  { id: "BOX", name: "Box" },
  { id: "PC", name: "Piece" },
  { id: "SET", name: "Set" },
  { id: "PKG", name: "Package" },
];

// EditDistributionModal Component
const EditDistributionModal = ({ distribution, onSave, onCancel }) => {
  const [editedDist, setEditedDist] = useState(distribution);

  const handleChange = (field, value) => {
    setEditedDist(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedDist);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 flex flex-col">
        <div className="bg-black text-white p-4 -mx-6 -mt-6 rounded-t-lg flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Distribution</h2>
          <button onClick={onCancel} className="text-white hover:text-gray-300 transition-colors duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-account" className="block text-sm font-medium text-gray-700">Account</label>
            <input
              type="text"
              id="edit-account"
              value={editedDist.account}
              onChange={(e) => handleChange('account', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700">Type</label>
            <select
              id="edit-type"
              value={editedDist.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm"
            >
              <option>RECV</option>
              <option>SALES</option>
              <option>TAXES</option>
              <option>COMMEXP</option>
              <option>COMMPAY</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-debit" className="block text-sm font-medium text-gray-700">Debit</label>
              <input
                type="number"
                id="edit-debit"
                value={editedDist.debit}
                onChange={(e) => handleChange('debit', parseFloat(e.target.value) || 0)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm text-right"
              />
            </div>
            <div>
              <label htmlFor="edit-credit" className="block text-sm font-medium text-gray-700">Credit</label>
              <input
                type="number"
                id="edit-credit"
                value={editedDist.credit}
                onChange={(e) => handleChange('credit', parseFloat(e.target.value) || 0)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm text-right"
              />
            </div>
          </div>
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              id="edit-description"
              value={editedDist.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 mt-4">
            <button
              type="submit"
              className="bg-black text-white rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-800 transition-colors duration-200"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-gray-800 rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-400 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// SalesDistributionEntry Component (New Component for the Popup)
const SalesDistributionEntry = ({ onClose, invoiceHeaderData }) => {
  const [distributions, setDistributions] = useState([
    { id: 1, account: '000-1200-00', type: 'RECV', debit: 89198.87, credit: 0.00, description: 'Accounts Receivable' },
    { id: 2, account: '000-4100-01', type: 'SALES', debit: 0.00, credit: 5645.47, description: 'Product Sales A' },
  ]);

  // Removed editingDistribution state
  const [selectedDistributionId, setSelectedDistributionId] = useState(null); // New state for selected distribution ID

  // Removed handleUpdateDistribution function
  // Removed handleEditClick function

  // Handle radio button change for distribution selection
  const handleDistributionSelect = (id) => {
    setSelectedDistributionId(id);
  };

  const functionalTotalsDebit = distributions.reduce((sum, item) => sum + parseFloat(item.debit || 0), 0);
  const functionalTotalsCredit = distributions.reduce((sum, item) => sum + parseFloat(item.credit || 0), 0);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] max-h-full flex flex-col">
        {/* Header */}
        <div className="bg-black text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-bold">Sales Distribution Entry</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Info Section */}
        <div className="px-4 py-4 md:px-6 md:py-6 grid grid-cols-1 md:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-3 md:gap-y-4 border-b border-gray-200 text-sm">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <label htmlFor="dist-customer-id" className="w-28 sm:w-36 text-gray-700 font-medium">Customer ID</label>
              <input type="text" id="dist-customer-id" defaultValue={invoiceHeaderData?.customerId || ''} readOnly className="flex-grow px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-xs" />
            </div>
            <div className="flex items-center">
              <label htmlFor="dist-customer-name" className="w-28 sm:w-36 text-gray-700 font-medium">Name</label>
              <input type="text" id="dist-customer-name" defaultValue={invoiceHeaderData?.customerName || ''} readOnly className="flex-grow px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-xs" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <label htmlFor="dist-document-no" className="w-28 sm:w-36 text-gray-700 font-medium">Document No.</label>
              <input type="text" id="dist-document-no" defaultValue={invoiceHeaderData?.documentNumber || ''} readOnly className="flex-grow px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-xs" />
            </div>
            <div className="flex items-center">
              <label htmlFor="dist-document-type" className="w-28 sm:w-36 text-gray-700 font-medium">Document Type</label>
              <input type="text" id="dist-document-type" defaultValue={invoiceHeaderData?.documentType || ''} readOnly className="flex-grow px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-xs" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <label htmlFor="dist-functional-amount" className="w-28 sm:w-36 text-gray-700 font-medium">Functional Amount</label>
              <div className="flex-grow flex items-center gap-2">
                <span className="mr-1 text-gray-600 font-semibold text-xs">$</span>
                <input type="text" id="dist-functional-amount" defaultValue="89,198.87" readOnly className="flex-grow px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-right text-xs" />
              </div>
            </div>
            <div className="flex items-center">
              <label htmlFor="dist-originating-amount" className="w-28 sm:w-36 text-gray-700 font-medium">Originating Amount</label>
              <div className="flex-grow flex items-center gap-2">
                  <span className="mr-1 text-gray-600 font-semibold text-xs">$</span>
                  <input type="text" id="dist-originating-amount" defaultValue="0.00" readOnly className="flex-grow px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-right text-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Account Distributions Grid */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Account Distributions</h3>
              <div className="flex items-center space-x-2">
                {/* Removed Edit button */}
              </div>
            </div>
            <div className="overflow-x-auto mb-4 border border-gray-300 rounded-lg">
              <table className="w-full border-collapse bg-white">
                <thead>
                  <tr>
                    <th className="border border-gray-200 p-2 md:p-3 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-[40px]">
                       {/* Empty header for radio button column */}
                    </th>
                    <th className="border border-gray-200 p-2 md:p-3 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-[35%]">Distribution Reference</th>
                    <th className="border border-gray-200 p-2 md:p-3 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-[15%]">Type</th>
                    <th className="border border-gray-200 p-2 md:p-3 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-[15%]">Originating Debit</th>
                    <th className="border border-gray-200 p-2 md:p-3 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-[15%]">Originating Credit</th>
                    <th className="border border-gray-200 p-2 md:p-3 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-[5%]"></th> {/* Empty header for actions column */}
                  </tr>
                </thead>
                <tbody>
                  {distributions.map((dist) => (
                    <tr
                      key={dist.id}
                      onClick={() => handleDistributionSelect(dist.id)} // Select row on click
                      className={`cursor-pointer ${selectedDistributionId === dist.id ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
                    >
                      <td className="border border-gray-200 p-2 text-center">
                        <input
                          type="radio"
                          name="distributionSelection"
                          checked={selectedDistributionId === dist.id}
                          onChange={() => handleDistributionSelect(dist.id)} // Update state on radio click
                          className="accent-red-700"
                        />
                      </td>
                      <td className="border border-gray-200 p-2 text-xs sm:text-sm text-gray-700">
                        {`${dist.account} - $${dist.debit.toFixed(2)} - $${dist.credit.toFixed(2)} - ${dist.description}`}
                      </td>
                      <td className="border border-gray-200 p-2 text-xs sm:text-sm text-gray-700">
                        {dist.type}
                      </td>
                      <td className="border border-gray-200 p-2">
                        <input type="text" defaultValue="0.00" readOnly className="border-none w-full p-1 text-xs sm:text-sm bg-transparent text-right focus:outline-none" />
                      </td>
                      <td className="border border-gray-200 p-2">
                        <input type="text" defaultValue="0.00" readOnly className="border-none w-full p-1 text-xs sm:text-sm bg-transparent text-right focus:outline-none" />
                      </td>
                      <td className="border border-gray-200 p-2 text-center">
                        {/* No individual edit/delete button here */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="grid grid-cols-[40%_15%_15%_15%_5%] gap-2 mt-4 text-sm"> {/* Mimic table column widths roughly */}
              {/* Functional Totals Row */}
              <div className="col-span-2 text-right font-semibold text-gray-700 pr-4">Functional Totals</div> {/* Label spanning first two conceptual columns */}
              <div className="flex items-center justify-end col-span-2 space-x-2"> {/* Debit and Credit inputs */}
                <span className="text-gray-600 font-semibold">$</span>
                <input type="text" value={functionalTotalsDebit.toFixed(2)} readOnly className="p-1 border border-gray-300 rounded-md bg-gray-50 text-right w-24 sm:w-28 font-bold text-xs sm:text-sm" />
                <span className="text-gray-600 font-semibold">$</span>
                <input type="text" value={functionalTotalsCredit.toFixed(2)} readOnly className="p-1 border border-gray-300 rounded-md bg-gray-50 text-right w-24 sm:w-28 font-bold text-xs sm:text-sm" />
              </div>
              <div className="col-span-1"></div> {/* Empty column for 'Actions' space */}

              {/* Originating Totals Row */}
              <div className="col-span-2 text-right font-semibold text-gray-700 pr-4">Originating Totals</div> {/* Label spanning first two conceptual columns */}
              <div className="flex items-center justify-end col-span-2 space-x-2"> {/* Debit and Credit inputs */}
                <span className="text-gray-600 font-semibold">$</span>
                <input type="text" defaultValue="0.00" readOnly className="p-1 border border-gray-300 rounded-md bg-gray-50 text-right w-24 sm:w-28 text-xs sm:text-sm" />
                <span className="text-gray-600 font-semibold">$</span>
                <input type="text" defaultValue="0.00" readOnly className="p-1 border border-gray-300 rounded-md bg-gray-50 text-right w-24 sm:w-28 text-xs sm:text-sm" />
              </div>
              <div className="col-span-1"></div> {/* Empty column for 'Actions' space */}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-4 bg-gray-100 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 rounded-b-lg">
            <button className="bg-black text-white rounded-md px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-800 transition-colors duration-200">OK</button>
          </div>
        </div>
    </div>
  );
};

// ConfirmationMessage Component
const ConfirmationMessage = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Confirmation
        </h3>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="bg-black text-white rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-800 transition-colors duration-200"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-400 transition-colors duration-200"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmationMessage = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Confirmation Confirmation
        </h3>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-center space-x-4">
          
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-400 transition-colors duration-200"
          >
            No
          </button>

          <button
            onClick={onConfirm}
            style={{backgroundColor: "red"}}
            className=" text-white rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-800 transition-colors duration-200"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

// ShipToAddressSelection Component (New Popup)
const ShipToAddressSelection = ({ addresses, onSelectAddress, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 flex flex-col">
        {/* Header */}
        <div className="bg-black text-white p-4 -mx-6 -mt-6 rounded-t-lg flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select Ship To Address</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto mb-4 border border-gray-200 rounded-md">
          {addresses.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {addresses.map((address, index) => (
                <li
                  key={index}
                  className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => onSelectAddress(address)}
                >
                  {address}
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-gray-600 text-center">
              No addresses found for this customer.
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-400 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// SalesTransactionEntryForm Component
const SalesTransactionEntryForm = ({ onDistributionsClick }) => {
  // State for line items (mock data for demonstration of sorting)
  const [lineItems, setLineItems] = useState([
    // Initial data, now referencing mock items
    { id: 1, itemId: 'ITEM-A123', comments: 'Initial comment for Alpha', qtyOrdered: 10, unitPrice: 15.00, extendedPrice: 0.00 },
  ]);

  // UseEffect to calculate extended price when line items change
  useEffect(() => {
    setLineItems(prevLineItems =>
      prevLineItems.map(item => ({
        ...item,
        extendedPrice: (item.qtyOrdered || 0) * (item.unitPrice || 0),
      }))
    );
  }, [lineItems.map(item => `${item.qtyOrdered}-${item.unitPrice}`).join('-')]); // Dependency array to re-calculate when qty or unitPrice changes


  // State for sorting
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  // State for selected line item ID (single selection for radio buttons)
  const [selectedLineItemId, setSelectedLineItemId] = useState(null);
  // State for showing delete confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);


  // State for the selected Type/Type ID, initially 'Order'
  const [documentType, setDocumentType] = useState('Order');
  // States for customer and document information, now initialized dynamically or with default
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [shipToAddress, setShipToAddress] = useState(''); // New state for ship-to address
  const [documentNumber, setDocumentNumber] = useState('ORD-001234');
  const [documentDate, setDocumentDate] = useState('2017-04-12');

  // State for Ship To Address popup
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [availableShipToAddresses, setAvailableShipToAddresses] = useState([]);


  // Effect to set initial values or clear if customer ID is empty
  useEffect(() => {
    // Set initial customer data if a default ID is desired or if it's dynamic
    const initialCustomerId = 'CUST-0056'; // Example default
    const initialCustomerInfo = customerData[initialCustomerId];
    if (initialCustomerInfo) {
      setCustomerId(initialCustomerId);
      setCustomerName(initialCustomerInfo.customerName);
      setShipToAddress(initialCustomerInfo.shipToAddresses[0] || ''); // Set first address as default
      setAvailableShipToAddresses(initialCustomerInfo.shipToAddresses);
    } else {
      setCustomerId('');
      setCustomerName('');
      setShipToAddress('');
      setAvailableShipToAddresses([]);
    }
  }, []); // Run once on component mount


  // Handle changes in line item fields
  const handleLineItemChange = (id, field, value) => {
    setLineItems(prevLineItems =>
      prevLineItems.map(item => {
        if (item.id === id) {
          let updatedItem = { ...item, [field]: value };

          // If item number changes, update default Unit Price (UOM is now comments, not dependent)
          if (field === 'itemId') {
            const selectedItem = mockItems.find(mockItem => mockItem.id === value);
            if (selectedItem) {
              updatedItem.unitPrice = selectedItem.defaultUnitPrice;
            } else {
              updatedItem.unitPrice = 0;
            }
          }

          // Recalculate extended price immediately
          updatedItem.extendedPrice = (updatedItem.qtyOrdered || 0) * (updatedItem.unitPrice || 0);
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Function to add a new line item
  const handleAddItem = () => {
    setLineItems(prevLineItems => [
      ...prevLineItems,
      {
        id: prevLineItems.length > 0 ? Math.max(...prevLineItems.map(item => item.id)) + 1 : 1,
        itemId: '',
        comments: '', // Initialize comments for new item
        qtyOrdered: 0,
        unitPrice: 0.00,
        extendedPrice: 0.00,
      },
    ]);
  };

  // Function to delete the selected line item
  const handleDeleteSelected = () => {
    if (selectedLineItemId) {
      setShowDeleteConfirmation(true); // Show confirmation dialog
    }
  };

  // Confirm deletion
  const confirmDelete = () => {
    setLineItems(prevLineItems => prevLineItems.filter(item => item.id !== selectedLineItemId));
    setSelectedLineItemId(null); // Deselect the item after deletion
    setShowDeleteConfirmation(false); // Close confirmation dialog
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirmation(false); // Close confirmation dialog
  };


  // State for showing save confirmation
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  // Handle sorting logic
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc'); // Default to ascending when changing column
    }
  };

  // Handle radio button change
  const handleRadioButtonChange = (id, event) => {
    event.stopPropagation(); // Prevent row click from firing
    setSelectedLineItemId(id);
  };

  // Handle row click for selection
  const handleRowClick = (itemId) => {
    setSelectedLineItemId(itemId); // Set the clicked row as selected
  };

  // Handle change for the Type/Type ID dropdown
  const handleDocumentTypeChange = (event) => {
    setDocumentType(event.target.value);
  };

  // Handlers for customer and document fields
  const handleCustomerIdChange = (e) => {
    const id = e.target.value;
    setCustomerId(id);
    const customerInfo = customerData[id];
    if (customerInfo) {
      setCustomerName(customerInfo.customerName);
      setShipToAddress(customerInfo.shipToAddresses[0] || ''); // Set first address as default
      setAvailableShipToAddresses(customerInfo.shipToAddresses);
    } else {
      // Clear fields if customer ID not found
      setCustomerName('');
      setShipToAddress('');
      setAvailableShipToAddresses([]);
    }
  };
  const handleCustomerNameChange = (e) => setCustomerName(e.target.value);
  const handleShipToAddressChange = (e) => setShipToAddress(e.target.value); // Handler for Ship To Address
  const handleDocumentNumberChange = (e) => setDocumentNumber(e.target.value);
  const handleDocumentDateChange = (e) => setDocumentDate(e.target.value);

  // Handler for opening the Ship To Address popup
  const handleShipToAddressClick = () => {
    if (availableShipToAddresses.length > 0) {
      setShowAddressPopup(true);
    }
  };

  // Handler for selecting an address from the popup
  const handleAddressSelect = (address) => {
    setShipToAddress(address);
    setShowAddressPopup(false); // Close the popup after selection
  };

  // Memoize sorted line items to prevent unnecessary re-sorting
  const sortedLineItems = useMemo(() => {
    if (!sortColumn) {
      return lineItems;
    }

    const sortableItems = [...lineItems]; // Create a shallow copy to avoid mutating original state directly

    sortableItems.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
    return sortableItems;
  }, [lineItems, sortColumn, sortDirection]);

  // Handle save button click
  const handleSaveClick = () => {
    setShowSaveConfirmation(true);
  };

  // Confirm save
  const confirmSave = () => {
    // Implement actual save logic here
    console.log("Saving data...");
    setShowSaveConfirmation(false);
    // Optionally, show a success message or redirect
  };

  // Cancel save
  const cancelSave = () => {
    setShowSaveConfirmation(false);
  };

  // Prepare data for Distributions popup
  const handleDistributionsButtonClick = () => {
    const dataToPass = {
      customerId,
      customerName,
      documentNumber,
      documentType,
      documentDate,
      shipToAddress, // Pass the shipToAddress as well
    };
    onDistributionsClick(dataToPass);
  };

  // Calculate total extended price for the form summary
  const totalExtendedPrice = lineItems.reduce((sum, item) => sum + item.extendedPrice, 0);


  return (
    <div className="flex bg-gray-100 font-sans text-gray-800">
      <div className="form-container bg-white border border-gray-200 rounded-lg shadow-lg w-full">
        <div className="main-content p-4 sm:p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-3 md:gap-y-4 mb-6 sm:mb-8 text-sm">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <label htmlFor="customer-id" className="w-36 text-gray-700 font-medium">Customer ID</label>
                <div className="flex-grow flex items-center gap-2">
                  <input type="text" id="customer-id" value={customerId} onChange={handleCustomerIdChange} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700" />
                </div>
              </div>
              {/* Removed Type/Type ID field */}
              <div className="flex items-center">
                <label htmlFor="document-no" className="w-36 text-gray-700 font-medium">Document No .</label>
                <div className="flex-grow flex items-center gap-2">
                  <input type="text" id="document-no" value={documentNumber} onChange={handleDocumentNumberChange} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700" />
                </div>
              </div>
              {/* Moved Currency ID here */}
              <div className="flex items-center">
                <label htmlFor="currency-id" className="w-36 text-gray-700 font-medium">Currency ID</label>
                <div className="flex-grow flex items-center gap-2">
                  <input type="text" defaultValue="USD" className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700" />
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <label htmlFor="customer-name" className="w-36 text-gray-700 font-medium">Customer Name</label>
                <div className="flex-grow flex items-center gap-2">
                  <input type="text" id="customer-name" value={customerName} onChange={handleCustomerNameChange} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700" />
                </div>
              </div>
              {/* Swap: Customer PO Number moved here */}
              <div className="flex items-center">
                <label htmlFor="customer-po-number" className="w-36 text-gray-700 font-medium">Customer PO Number</label>
                <div className="flex-grow flex items-center gap-2">
                  <input type="text" defaultValue="PO-78901" className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700" />
                </div>
              </div>
              {/* NEW POSITION FOR SHIP TO ADDRESS */}
              <div className="flex items-center">
                {/* Changed label to a button for clickability */}
                <button type="button" onClick={handleShipToAddressClick} className="w-36 text-red-700 underline cursor-pointer text-sm font-medium text-left">
                  Ship To Address
                </button>
                <div className="flex-grow flex items-center gap-2">
                  <input type="text" id="ship-to-address" value={shipToAddress} onChange={handleShipToAddressChange} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700" />
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              {/* NEW POSITION FOR DATE */}
              <div className="flex items-center">
                <label htmlFor="date" className="w-36 text-gray-700 font-medium">Date</label>
                <div className="flex-grow flex items-center gap-2">
                  <input type="date" id="date" value={documentDate} onChange={handleDocumentDateChange} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700" />
                </div>
              </div>
              <div className="flex items-center">
                <label htmlFor="default-site-id" className="w-36 text-gray-700 font-medium">Default Site ID</label>
                <div className="flex-grow flex items-center gap-2">
                  <input type="text" defaultValue="WAREHOUSE" className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700" />
                </div>
              </div>
              {/* Moved Comment ID here previously */}
              <div className="flex items-center">
                <label htmlFor="comment-id" className="w-36 sm:w-44 text-gray-700 font-medium">Comment ID</label>
                <div className="flex-grow flex items-center gap-2">
                  <input type="text" id="comment-id" defaultValue="Initial Order" className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-gray-200 text-gray-800 p-2 rounded-md mb-0 font-semibold text-base border border-gray-300">
            <span>Line Items by Order Entered</span>
            <div className="flex items-center space-x-2"> {/* Container for add and delete buttons */}
              <button
                onClick={handleAddItem}
                className="bg-black text-white rounded-full p-1.5 text-xs font-medium shadow-sm hover:bg-gray-800 transition-colors duration-200"
                title="Add New Line Item" // Improved clarity
              >
                <Plus size={16} /> {/* Increased size for better clarity */}
              </button>
              <button
                onClick={handleDeleteSelected}
                className={`rounded-full p-1.5 text-xs font-medium shadow-sm transition-colors duration-200 ${
                  selectedLineItemId
                    ? 'bg-red-700 text-white hover:bg-red-800'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
                title="Delete Selected Line Item" // Improved clarity
                disabled={!selectedLineItemId} // Disable if no item is selected
              >
                <Trash2 size={16} /> {/* Increased size for better clarity */}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto mb-6 sm:mb-8">
            <table className="w-full border-collapse bg-white border border-gray-300 rounded-lg">
              <thead>
                <tr>
                  <th className="border border-gray-200 p-2 md:p-3 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-[40px]">
                    {/* Empty header for radio button column */}
                  </th>
                  <th className="border border-gray-200 p-2 md:p-3 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-1/4 cursor-pointer" onClick={() => handleSort('itemId')}>
                    Item Number{' '}
                    {sortColumn === 'itemId' && (
                      sortDirection === 'asc' ? '▲' : '▼'
                    )}
                  </th>
                  <th className="border border-gray-200 p-2 md:p-3 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-1/6 cursor-pointer" onClick={() => handleSort('comments')}>
                    Comments{' '} {/* Changed label to Comments */}
                    {sortColumn === 'comments' && (
                      sortDirection === 'asc' ? '▲' : '▼'
                    )}
                  </th>
                  <th className="border border-gray-200 p-2 md:p-3 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-1/6 cursor-pointer" onClick={() => handleSort('qtyOrdered')}>
                    Qty Ordered{' '}
                    {sortColumn === 'qtyOrdered' && (
                      sortDirection === 'asc' ? '▲' : '▼'
                    )}
                  </th>
                  <th className="border border-gray-200 p-2 md:p-3 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-1/6 cursor-pointer" onClick={() => handleSort('unitPrice')}>
                    Unit Price{' '}
                    {sortColumn === 'unitPrice' && (
                      sortDirection === 'asc' ? '▲' : '▼'
                    )}
                  </th>
                  <th className="border border-gray-200 p-2 md:p-3 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-1/4 cursor-pointer" onClick={() => handleSort('extendedPrice')}>
                    Extended Price{' '}
                    {sortColumn === 'extendedPrice' && (
                      sortDirection === 'asc' ? '▲' : '▼'
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedLineItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item.id)}
                    className={`cursor-pointer ${selectedLineItemId === item.id ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
                  >
                    <td className="border border-gray-200 p-2 text-center">
                      <input
                        type="radio"
                        name="lineItemSelection" // Name attribute for radio buttons ensures only one can be selected
                        checked={selectedLineItemId === item.id}
                        onChange={(e) => handleRadioButtonChange(item.id, e)}
                        className="accent-red-700"
                      />
                    </td>
                    <td className="border border-gray-200 p-2">
                      <input // Changed to text input
                        type="text"
                        value={item.itemId} // Use itemId field
                        onChange={(e) => handleLineItemChange(item.id, 'itemId', e.target.value)} // Update itemId field
                        placeholder="Enter Item ID" // Placeholder for Item Number
                        className="border-none w-full p-1 text-xs sm:text-sm bg-transparent focus:outline-none focus:ring-red-700 focus:border-red-700"
                      />
                    </td>
                    <td className="border border-gray-200 p-2">
                      <input // Changed to text input
                        type="text"
                        value={item.comments} // Use comments field
                        onChange={(e) => handleLineItemChange(item.id, 'comments', e.target.value)} // Update comments field
                        placeholder="Add comments here" // Placeholder for Comments
                        className="border-none w-full p-1 text-xs sm:text-sm bg-transparent focus:outline-none focus:ring-red-700 focus:border-red-700"
                      />
                    </td>
                    <td className="border border-gray-200 p-2">
                      <input
                        type="number"
                        value={item.qtyOrdered}
                        onChange={(e) => handleLineItemChange(item.id, 'qtyOrdered', parseFloat(e.target.value) || 0)}
                        className="border-none w-full p-1 text-xs sm:text-sm bg-transparent focus:outline-none focus:ring-red-700 focus:border-red-700"
                      />
                    </td>
                    <td className="border border-gray-200 p-2">
                      <input
                        type="number"
                        value={item.unitPrice.toFixed(2)}
                        onChange={(e) => handleLineItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="border-none w-full p-1 text-xs sm:text-sm bg-transparent focus:outline-none focus:ring-red-700 focus:border-red-700"
                      />
                    </td>
                    <td className="border border-gray-200 p-2">
                      <input type="text" value={item.extendedPrice.toFixed(2)} readOnly className="border-none w-full p-1 text-xs sm:text-sm bg-transparent text-right focus:outline-none" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Combined summary section into a 2-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-10 gap-y-3 md:gap-y-4 mb-6 sm:mb-8 text-sm">
            {/* Left column: Amount Received, Terms Discount Taken, On Account */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <label htmlFor="freight" className="w-28 sm:w-36 text-gray-700 font-medium">Freight</label>
                <div className="flex-grow flex items-center gap-2">
                  <span className="mr-1 text-gray-600 font-semibold">$</span>
                  <input type="text" id="freight" defaultValue="15.00" className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-right text-sm focus:ring-red-700 focus:border-red-700" />
                </div>
              </div>
              <div className="flex items-center">
                <label htmlFor="miscellaneous" className="w-28 sm:w-36 text-gray-700 font-medium">Miscellaneous</label>
                <div className="flex-grow flex items-center gap-2">
                  <span className="mr-1 text-gray-600 font-semibold">$</span>
                  <input type="text" id="miscellaneous" defaultValue="0.00" className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-right text-sm focus:ring-red-700 focus:border-red-700" />
                </div>
              </div>
              <div className="flex items-center">
                <label htmlFor="tax" className="w-28 sm:w-36 text-gray-700 font-medium">Tax</label>
                <div className="flex-grow flex items-center gap-2">
                  <span className="mr-1 text-gray-600 font-semibold">$</span>
                  <input type="text" id="tax" defaultValue="25.65" className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-right text-sm" readOnly />
                </div>
              </div>
              <div className="flex items-center">
                <label htmlFor="subtotal" className="w-28 sm:w-36 text-gray-700 font-medium">Subtotal</label>
                <div className="flex-grow flex items-center gap-2">
                  <span className="mr-1 text-gray-600 font-semibold">$</span>
                  <input type="text" id="subtotal" value={totalExtendedPrice.toFixed(2)} readOnly className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-right text-sm" />
                </div>
              </div>
            </div>

            {/* Right column: Freight, Miscellaneous, Tax, Subtotal */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <label htmlFor="amount-received" className="w-36 sm:w-44 text-gray-700 font-medium">Amount Received</label>
                <div className="flex-grow flex items-center gap-2">
                  <span className="mr-1 text-gray-600 font-semibold">$</span>
                  <input type="text" id="amount-received" defaultValue="427.50" className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-right text-sm focus:ring-red-700 focus:border-red-700" />
                </div>
              </div>
              <div className="flex items-center">
                <label htmlFor="terms-discount-taken" className="w-36 sm:w-44 text-gray-700 font-medium">Terms Discount Taken</label>
                <div className="flex-grow flex items-center gap-2">
                  <span className="mr-1 text-gray-600 font-semibold">$</span>
                  <input type="text" id="terms-discount-taken" defaultValue="0.00" className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-right text-sm focus:ring-red-700 focus:border-red-700" />
                </div>
              </div>
              <div className="flex items-center">
                <label htmlFor="on-account" className="w-36 sm:w-44 text-gray-700 font-medium">On Account</label>
                <div className="flex-grow flex items-center gap-2">
                  <span className="mr-1 text-gray-600 font-semibold">$</span>
                  <input type="text" id="on-account" defaultValue="0.00" className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-right text-sm focus:ring-red-700 focus:border-red-700" />
                </div>
              </div>
              {/* Added a placeholder div to align with the subtotal field if needed */}
              <div className="h-12"></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <button
                onClick={handleDistributionsButtonClick}
                className={`rounded-md px-4 py-2.5 text-sm font-medium shadow-sm transition-colors duration-200 w-full sm:w-auto bg-black text-white hover:bg-gray-800`} // Removed disabled prop and conditional classes
              >
                Distributions
              </button>
              <button
                onClick={handleSaveClick}
                className="bg-black text-white hover:bg-gray-800 rounded-md px-4 py-2.5 text-sm font-medium shadow-sm transition-colors duration-200 w-full sm:w-auto"
              >
                Save
              </button>
            </div>
            <div className="flex items-center w-full sm:w-auto justify-end">
              <label className="text-gray-700 text-base font-semibold mr-2">Total</label>
              <div className="flex items-center">
                <span className="mr-1 text-gray-800 text-lg font-bold">$</span>
                <input type="text" value={(totalExtendedPrice + 15.00 + 25.65).toFixed(2)} className="p-2 border border-gray-300 rounded-md bg-gray-50 text-right font-bold text-lg w-28 sm:w-32" readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSaveConfirmation && (
        <ConfirmationMessage
          message="Are you sure you want to save the current invoice?"
          onConfirm={confirmSave}
          onCancel={cancelSave}
        />
      )}
      {showDeleteConfirmation && (
        <ConfirmationMessage
          message="Are you sure you want to delete the selected line item?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      {showAddressPopup && (
        <ShipToAddressSelection
          addresses={availableShipToAddresses}
          onSelectAddress={handleAddressSelect}
          onClose={() => setShowAddressPopup(false)}
        />
      )}
    </div>
  );
};

// Define the structure for side navigation items
const sideNavSections = {
  home: [
    {
      label: "Overview",
      page: "overview",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-9v10a1 1 0 001 1h3M10 2l-2 2m0 0l-7 7m7-7v7"
          ></path>
        </svg>
      ),
    },
  ],
  dashboard: [
    {
      label: "Customer",
      page: "customer",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m7 0V5a2 2 0 012-2h2a2 2 0 012 2v10m-7 0h7"
          ></path>
        </svg>
      ),
    },
    {
      label: "Reports",
      page: "reports",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          ></path>
        </svg>
      ),
    },
    {
      label: "Data Management",
      page: "data",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16V9m2 7V9m-2 7H9M6 18h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
          ></path>
        </svg>
      ),
    },
  ],
  invoice: [
    // New Sales category
    {
      label: "Manual Invoice",
      page: "sales-transaction-entry",
      // Changed label to Invoice Entry
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 10a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
      ),
    },
  ],
};

// Main App component
const App = () => {
  const [currentPage, setCurrentPage] = useState("customer");
  const [topNavActiveItem, setTopNavActiveItem] = useState("customer");
  const [showDistributionPopup, setShowDistributionPopup] = useState(false);
  const [
    invoiceHeaderDataForDistribution,
    setInvoiceHeaderDataForDistribution,
  ] = useState(null); // State to pass data to popup

  // Customer Info Admin (Analytics) state and handlers
  const [showTable, setShowTable] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [animate, setAnimate] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  
  const [selectedCustomerForEdit, setSelectedCustomerForEdit] = useState(undefined);
  const [selectedCustomerForDelete, setSelectedCustomerForDelete] = useState(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [latestId, setLatestId] = useState(undefined)

  const handleOpenCustomerModal = () => {
    const latestId = CustomerData.map((c) => parseInt(c.customerId.replace("CB", ""))).sort((a, b) => b-a)[0]
    const strLatestId = "CB" + String(latestId+1).padStart(8, "0")
    setLatestId(strLatestId)

    setShowCustomerModal(true);

    setTimeout(() => setModalVisible(true), 10); // trigger animation
  };
  const handleCloseCustomerModal = () => {
    setModalVisible(false);
    setTimeout(() => setShowCustomerModal(false), 250); // match animation duration
  };
  const _initialCustomerData = [
    {
      customerId: "CB00010001",
      Customer: "Belkin",
      company: "Belkin Corp",
      contact: "Kamesh Driver",
      phone: "310-751-2976",
      email: "kumeisha.udriver@belkin.com",
      status: "Active",
    },
    {
      customerId: "CB00010002",
      Customer: "Logitech",
      company: "Logitech Inc",
      contact: "Sarah Lee",
      phone: "510-555-1234",
      email: "sarah.lee@logitech.com",
      status: "Active",
    },
    {
      customerId: "CB00010003",
      Customer: "HP",
      company: "HP Inc",
      contact: "John Smith",
      phone: "650-555-5678",
      email: "john.smith@hp.com",
      status: "Inactive",
    },
    {
      customerId: "CB00010004",
      Customer: "Dell",
      company: "Dell Technologies",
      contact: "Priya Patel",
      phone: "512-555-7890",
      email: "priya.patel@dell.com",
      status: "Active",
    },
    {
      customerId: "CB00010005",
      Customer: "Apple",
      company: "Apple Inc",
      contact: "Emily Chen",
      phone: "408-555-2468",
      email: "emily.chen@apple.com",
      status: "Active",
    },
    {
      customerId: "CB00010005",
      Customer: "Apple",
      company: "Apple Inc",
      contact: "Tim Chen",
      phone: "408-666-2468",
      email: "Tim.chen@apple.com",
      status: "Active",
    },
    {
      customerId: "CB00010006",
      Customer: "Samsung",
      company: "Samsung Electronics",
      contact: "David Kim",
      phone: "+82-2-5555-1234",
      email: "david.kim@samsung.com",
      status: "Inactive",
    },
    {
      customerId: "CB00010007",
      Customer: "Sony",
      company: "Sony Corp",
      contact: "Hiro Tanaka",
      phone: "+81-3-5555-1234",
      email: "hiro.tanaka@sony.com",
      status: "Active",
    },
    {
      customerId: "CB00010008",
      Customer: "Lenovo",
      company: "Lenovo Group",
      contact: "Wei Zhang",
      phone: "+86-10-5555-1234",
      email: "wei.zhang@lenovo.com",
      status: "Active",
    },
    {
      customerId: "CB00010009",
      Customer: "Acer",
      company: "Acer Inc",
      contact: "Lina Wu",
      phone: "+886-2-5555-1234",
      email: "lina.wu@acer.com",
      status: "Inactive",
    },
    {
      customerId: "CB00010010",
      Customer: "Asus",
      company: "AsusTek",
      contact: "Ken Lee",
      phone: "+886-2-5555-5678",
      email: "ken.lee@asus.com",
      status: "Active",
    },
  ];
  const [CustomerData, setCustomerData] = useState(_initialCustomerData)
  const filteredData = CustomerData.filter(
    (row) =>
      row.company.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.customerId.toLowerCase().includes(searchValue.toLowerCase())
  );

  // State for pagination
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const recordsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const paginatedData = filteredData.slice(
    (currentPageNumber - 1) * recordsPerPage,
    currentPageNumber * recordsPerPage
  );

  const handleCustomerSearch = () => {
    setSearchValue(searchInput);
    setShowTable(false);
    setTimeout(() => {
      setShowTable(true);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 400);
    }, 100);
  };

  const handleTopNavClick = (sectionKey, defaultPage) => {
    setTopNavActiveItem(sectionKey);
    setCurrentPage(defaultPage);
  };

  const handleSideNavClick = (page) => {
    setCurrentPage(page);
  };

  // Function to open the Distributions popup, now accepts data
  const openDistributionsPopup = (data) => {
    setInvoiceHeaderDataForDistribution(data); // Store the received data
    setShowDistributionPopup(true);
  };

  // Function to close the Distributions popup
  const closeDistributionsPopup = () => {
    setShowDistributionPopup(false);
    setInvoiceHeaderDataForDistribution(null); // Clear data when closing
  };

  const renderContent = () => {
    switch (currentPage) {
      case "overview":
        return (
          <>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-8 border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">
                Welcome to Your Application!
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                This is the Overview page. Here you'll find a general summary of
                your data.
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
                The side navigation is now always visible.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-8 border border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
                  Overview Card 1
                </h3>
                <p className="text-sm sm:text-base text-gray-700">
                  Display key metrics or important information here.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-8 border border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
                  Overview Card 2
                </h3>
                <p className="text-sm sm:text-base text-gray-700">
                  Summarize recent activity or progress.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-8 border border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
                  Overview Card 3
                </h3>
                <p className="text-sm sm:text-base text-gray-700">
                  Provide quick links or actions related to your app.
                </p>
              </div>
            </div>
          </>
        );
      case "customer":
        return (
          <div id="CustomerInfoSection">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Non-Retail Customer List</h2>
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button
                    id="addNewCustomerBtn"
                    className="p-2 rounded-full bg-[#1d1f1f] hover:bg-[#2c2c2e] shadow text-white px-3 py-1.5 flex items-center justify-center transition-colors"
                    aria-label="Add New Customer"
                    onClick={handleOpenCustomerModal}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                  <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    New Customer
                  </span>
                </div>
                {showCustomerModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div
                      className={`bg-white rounded shadow-lg w-full max-w-2xl mx-2 relative border border-gray-300
        ${modalVisible ? "modal-fade-in" : "modal-fade-out"}`}
                    >
                      <AddCustomer id={latestId} onSave={(formData) => {
                        setCustomerData([...CustomerData, formData])
                        setShowCustomerModal(false)
                      }} onClose={() => setShowCustomerModal(false)}/>
                    </div>
                  </div>
                )}

{selectedCustomerForDelete && (
  <DeleteConfirmationMessage
  message={"Are you sure you want to delete the selected 1 OEM(s)?"}
  onCancel={() => setSelectedCustomerForDelete(undefined)}
  onConfirm={() => {
    setCustomerData(CustomerData.filter((data) => data.customerId != selectedCustomerForDelete.customerId));
                          setSelectedCustomerForDelete(undefined)
                        }}
  ></ DeleteConfirmationMessage>
                )}

{selectedCustomerForEdit && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div
                      className={`bg-white rounded shadow-lg w-full max-w-2xl mx-2 relative border border-gray-300
        ${modalVisible ? "modal-fade-in" : "modal-fade-out"}`}
                    >
                      <AddCustomer id={selectedCustomerForEdit?.customerId} customerData={selectedCustomerForEdit} onSave={(formData) => {
                        const currentCustomerData = CustomerData.findIndex((c) => c.customerId == formData.customerId)
                        if (currentCustomerData > -1){
                          CustomerData[currentCustomerData] = {...formData}
                        }
                        setSelectedCustomerForEdit(undefined)
                      }} onClose={() => setSelectedCustomerForEdit(undefined)}/>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-2">
                <form
                  className="flex items-center space-x-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCustomerSearch();
                  }}
                >
                  <div className="relative w-48">
                    <input
                      type="text"
                      placeholder="Search Customer or ID..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full px-3 py-1.5 pr-7 border border-gray-200 rounded-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 bg-gray-50 placeholder:text-xs placeholder:font-normal placeholder:font-['Segoe_UI'] shadow-sm font-['Segoe_UI']"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Clear"
                        onClick={() => setSearchInput("")}
                        tabIndex={-1}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Search"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                      />
                    </svg>
                  </button>
                </form>
              </div>
              <div className="overflow-x-auto">
                {showTable && (
                  <div
                    className={animate ? "animate-fadeIn" : ""}
                    style={{ maxHeight: "none", overflowY: "visible" }}
                  >
                    <table
                      className="min-w-full text-sm divide-y divide-black"
                      data-sort-dir="asc"
                    >
                      <thead className="bg-gray-50">
                        <tr className="border-b-2 border-black">
                          <th className="px-2 py-2 w-6 text-center align-middle">
                            <input
                              type="checkbox"
                              className="w-3 h-3 accent-black border-gray-400 rounded-sm"
                              checked={
                                paginatedData.length > 0 &&
                                paginatedData.every((row, idx) =>
                                  selectedRows.includes(
                                    idx +
                                      (currentPageNumber - 1) * recordsPerPage
                                  )
                                )
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRows([
                                    ...selectedRows,
                                    ...paginatedData
                                      .map(
                                        (_, idx) =>
                                          idx +
                                          (currentPageNumber - 1) *
                                            recordsPerPage
                                      )
                                      .filter(
                                        (idx) => !selectedRows.includes(idx)
                                      ),
                                  ]);
                                } else {
                                  setSelectedRows(
                                    selectedRows.filter(
                                      (idx) =>
                                        idx <
                                          (currentPageNumber - 1) *
                                            recordsPerPage ||
                                        idx >=
                                          currentPageNumber * recordsPerPage
                                    )
                                  );
                                }
                              }}
                            />
                          </th>
                          <th className="px-2 py-1 text-[13px] text-left cursor-pointer hover:text-blue-600">
                            Customer ID
                          </th>
                          <th className="px-2 py-1 text-[13px] text-left cursor-pointer hover:text-blue-600">
                            Customer
                          </th>
                          <th className="px-2 py-1 text-[13px] text-left cursor-pointer hover:text-blue-600">
                            Company Name
                          </th>
                          <th className="px-2 py-1 text-[13px] text-left cursor-pointer hover:text-blue-600">
                            Contact
                          </th>
                          <th className="px-2 py-1 text-[13px] text-left">
                            Phone
                          </th>
                          <th className="px-2 py-1 text-[13px] text-left">
                            Email
                          </th>
                          <th className="px-2 py-1 text-[13px] text-left">
                            Status
                          </th>
                          <th className="px-2 py-1 text-[13px] text-left">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((row, idx) => {
                          const globalIdx =
                            idx + (currentPageNumber - 1) * recordsPerPage;
                          return (
                            <tr key={globalIdx} className="hover:bg-gray-50">
                              <td className="px-2 py-2 w-6 text-center align-middle">
                                <input
                                  type="checkbox"
                                  className="w-3 h-3 accent-black border-gray-400 rounded-sm"
                                  checked={selectedRows.includes(globalIdx)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedRows([
                                        ...selectedRows,
                                        globalIdx,
                                      ]);
                                    } else {
                                      setSelectedRows(
                                        selectedRows.filter(
                                          (i) => i !== globalIdx
                                        )
                                      );
                                    }
                                  }}
                                />
                              </td>
                              <td className="px-2 py-1 text-[13px] font-mono text-blue-700">
                                {row.customerId ||
                                  `CB0001${String(globalIdx + 1).padStart(
                                    4,
                                    "0"
                                  )}`}
                              </td>
                              <td className="px-2 py-1 text-[13px]">
                                {row.Customer}
                              </td>
                              <td className="px-2 py-1 text-[13px]">
                                {row.company}
                              </td>
                              <td className="px-2 py-1 text-[13px]">
                                {row.contact}
                              </td>
                              <td className="px-2 py-1 text-[13px]">
                                {row.phone}
                              </td>
                              <td className="px-2 py-1 text-[13px]">
                                {row.email}
                              </td>
                              <td className="px-2 py-1 text-[13px]">
                                {row.status}
                              </td>
                              <td className="px-2 py-1 text-[13px] flex gap-1">
                                {/* Edit Button */}
                                <div className="relative group">
                                  <button
                                    className="p-1 rounded-full hover:bg-blue-100 transition-colors"
                                    aria-label="Edit"
                                    onClick={() => {
                                      setSelectedCustomerForEdit(row)
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#1976D2"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                                      <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                                    </svg>
                                  </button>
                                  <span className="absolute left-1/2 -translate-x-1/2 mt-7 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    Edit
                                  </span>
                                </div>
                                {/* Delete Button */}
                                <div className="relative group">
                                  <button
                                    className="p-1 rounded-full hover:bg-red-100 transition-colors"
                                   aria-label="Delete"
                                    onClick={() => setSelectedCustomerForDelete(row)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="15"
                                      height="15"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#F44336"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <polyline points="3 6 5 6 21 6"></polyline>
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                      <line
                                        x1="10"
                                        y1="11"
                                        x2="10"
                                        y2="17"
                                      ></line>
                                      <line
                                        x1="14"
                                        y1="11"
                                        x2="14"
                                        y2="17"
                                      ></line>
                                    </svg>
                                  </button>
                                  <span className="absolute left-1/2 -translate-x-1/2 mt-7 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    Delete
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {paginatedData.length === 0 && (
                          <tr>
                            <td
                              colSpan={9}
                              className="text-center py-4 text-gray-400"
                            >
                              No results found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex justify-end items-center gap-2 mt-4">
                        <button
                          className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                          onClick={() =>
                            setCurrentPageNumber((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPageNumber === 1}
                        >
                          Prev
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            className={`px-2 py-1 rounded text-sm ${
                              currentPageNumber === i + 1
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                            }`}
                            onClick={() => setCurrentPageNumber(i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                          onClick={() =>
                            setCurrentPageNumber((p) =>
                              Math.min(totalPages, p + 1)
                            )
                          }
                          disabled={currentPageNumber === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "reports":
        return (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">
              Generate Reports
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              Here you can generate various types of reports based on your data.
            </p>
            <ul className="list-disc list-inside mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
              <li>Daily Sales Report</li>
              <li>Monthly Performance Report</li>
              <li>User Activity Log</li>
            </ul>
          </div>
        );
      case "data":
        return (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">
              Data Management
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              View, add, edit, or delete your application data.
            </p>
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0">
              <button className="bg-black text-white px-3 py-2 rounded-md hover:bg-gray-800 mr-0 sm:mr-2 transition-colors duration-200 shadow-sm text-sm">
                Add New Data
              </button>
              <button className="bg-gray-200 text-gray-800 px-3 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200 shadow-sm text-sm">
                Export Data
              </button>
            </div>
            <div className="mt-4 sm:mt-6 border border-gray-200 rounded-lg p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">
                Recent Data Entries
              </h3>
              <ul className="list-disc list-inside text-xs sm:text-sm text-gray-700">
                <li>Entry A - 2025-06-21</li>
                <li>Entry B - 2025-06-20</li>
                <li>Entry C - 2025-06-19</li>
              </ul>
            </div>
          </div>
        );
      case "sales-transaction-entry":
        return (
          <SalesTransactionEntryForm
            onDistributionsClick={openDistributionsPopup}
          />
        );
      case "general-settings":
        return (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">
              General Settings
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              Adjust general application preferences.
            </p>
            <form className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              <div>
                <label
                  htmlFor="language"
                  className="block text-gray-700 font-medium mb-1 text-sm"
                >
                  Language
                </label>
                <select
                  id="language"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-700 focus:border-red-700 text-sm"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-black text-white px-3 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 shadow-sm text-sm"
              >
                Save Changes
              </button>
            </form>
          </div>
        );
      case "security-settings":
        return (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">
              Security Settings
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              Manage your account's security options.
            </p>
            <ul className="mt-3 sm:mt-4 space-y-2 text-sm">
              <li className="flex items-center">
                <input
                  type="checkbox"
                  id="twoFactor"
                  className="mr-2 accent-red-700"
                />
                <label htmlFor="twoFactor">
                  Enable Two-Factor Authentication
                </label>
              </li>
              <li className="flex items-center">
                <button className="text-red-700 hover:underline focus:outline-none">
                  Change Password
                </button>
              </li>
            </ul>
          </div>
        );
      case "my-profile":
        return (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">
              My Profile
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              View and edit your personal profile information here.
            </p>
            <div className="mt-3 sm:mt-4 space-y-3 text-sm">
              <p>
                <strong>Name:</strong> John Doe
              </p>
              <p>
                <strong>Email:</strong> john.doe@example.com
              </p>
              <p>
                <strong>Role:</strong> Administrator
              </p>
            </div>
            <button className="mt-4 sm:mt-6 bg-black text-white px-3 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 shadow-sm text-sm">
              Edit Profile
            </button>
          </div>
        );
      case "preferences":
        return (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">
              User Preferences
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              Customize your application experience.
            </p>
            <form className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              <div>
                <label
                  htmlFor="notifications"
                  className="block text-gray-700 font-medium mb-1 text-sm"
                >
                  Notifications
                </label>
                <input
                  type="checkbox"
                  id="notifications"
                  className="mr-2 accent-red-700"
                  defaultChecked
                />{" "}
                Enable email notifications
              </div>
              <div>
                <label
                  htmlFor="timezone"
                  className="block text-gray-700 font-medium mb-1 text-sm"
                >
                  Timezone
                </label>
                <select
                  id="timezone"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-700 focus:border-red-700 text-sm"
                >
                  <option>UTC-5:00 Central Time (US & Canada)</option>
                  <option>UTC-8:00 Pacific Time (US & Canada)</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-black text-white px-3 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 shadow-sm text-sm"
              >
                Save Preferences
              </button>
            </form>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">
              Page Not Found
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              The page you are trying to access does not exist.
            </p>
          </div>
        );
    }
  };

  // Function to render side navigation links based on the active top navigation item
  // const renderSideNavLinks = () => {
  //   const currentSectionItems = sideNavSections[topNavActiveItem] || [];
  //   return currentSectionItems.map((item, index) => (
  //     <React.Fragment key={item.page}>
  //       <li>
  //         <button
  //           onClick={() => handleSideNavClick(item.page)}
  //           className={`block w-full text-left p-3 rounded-md transition-colors duration-200 flex items-center space-x-3 focus:outline-none font-semibold text-sm sm:text-base
  //             ${
  //               currentPage === item.page
  //                 ? "bg-gray-100 text-red-700 border-l-4 border-red-700"
  //                 : "text-gray-800 hover:bg-gray-50"
  //             }`}
  //         >
  //           {item.icon}
  //           <span>{item.label}</span>
  //         </button>
  //       </li>
  //       {index < currentSectionItems.length - 1 && (
  //         <li className="my-2">
  //           <hr className="border-t border-gray-200" />
  //         </li>
  //       )}
  //     </React.Fragment>
  //   ));
  // };

  return (
    <div className="bg-gray-100 font-sans text-gray-800 flex flex-col">
      {/* New Top Bar for Application Title/Branding */}
      <div className="bg-black p-3 sm:p-4 flex items-center justify-between border-b border-gray-800 shadow-sm">
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Verizon Logo */}
          <span className="text-red-700 text-2xl sm:text-3xl font-bold">
            verizon
          </span>
          <span className="text-sm sm:text-xl font-bold text-white hidden sm:block pt-1">
            | Vision 2.0
          </span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 text-white text-xs sm:text-sm">
          <span className="hidden md:block">Portal Updates</span>
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.002 2.002 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            ></path>
          </svg>
          <span className="hidden md:block">Notifications</span>
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 10v11h18V10M3 10a2 2 0 002-2h14a2 2 0 012 2v-1a2 2 0 00-2-2H5a2 2 0 00-2 2v1"
            ></path>
          </svg>
          <span className="hidden md:block">Dashboard Team</span>
        </div>
      </div>

      {/* Main Top Navigation Bar (with main links) */}
      <header className="bg-white text-gray-900 p-3 sm:p-4 flex items-center justify-start border-b border-gray-200 overflow-x-auto whitespace-nowrap">
        <nav className="flex space-x-3 sm:space-x-6 px-2 sm:px-4">
          <button
            onClick={() => handleTopNavClick("customer", "customer")}
            className={`py-2 px-3 rounded-sm hover:bg-gray-100 transition-colors duration-200 focus:outline-none font-bold text-sm ${
              topNavActiveItem === "customer"
                ? "text-red-700 border-b-2 border-red-700"
                : "text-gray-700"
            }`}
          >
            Customer
          </button>
          <button
            onClick={() =>
              handleTopNavClick("sales", "sales-transaction-entry")
            }
            className={`py-2 px-3 rounded-sm hover:bg-gray-100 transition-colors duration-200 focus:outline-none font-bold text-sm ${
              topNavActiveItem === "sales"
                ? "text-red-700 border-b-2 border-red-700"
                : "text-gray-700"
            }`}
          >
            Manual Invoice
          </button>
          <button
            onClick={() => handleTopNavClick("profile", "my-profile")}
            className={`py-2 px-3 rounded-sm  hover:bg-gray-100 transition-colors duration-200 focus:outline-none font-bold text-sm ${
              topNavActiveItem === "profile"
                ? "text-red-700 border-b-2 border-red-700"
                : "text-gray-700"
            }`}
          >
            Payments
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
     <div className="flex flex-1 overflow-hidden">
        {/* <aside
          className={`bg-white text-gray-800 flex-shrink-0 transition-all duration-300 ease-in-out w-full md:w-64 lg:w-72 border-r border-gray-200`}
        >
          <nav className="p-4 space-y-2">
            <ul>{renderSideNavLinks()}</ul>
          </nav>
        </aside> */}

       <main className="flex-1 px-4 sm:px-8 py-4 sm:py-8 overflow-y-auto bg-gray-50">
          {renderContent()}
        </main>
      </div>

      {/* Render the SalesDistributionEntry popup if showDistributionPopup is true */}
      {showDistributionPopup && (
        <SalesDistributionEntry
          onClose={closeDistributionsPopup}
          invoiceHeaderData={invoiceHeaderDataForDistribution}
        />
      )}
    </div>
  );
};

export default App;
