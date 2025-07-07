import logo from "./logo.png";
import "./App.css";
import { Plus, Edit, Trash2, Info } from "lucide-react"; // Import Plus, Edit, and Trash2 icons
import AddCustomer from "./AddCustomer";
import InvoiceProgressBar from "./components/InvoiceProgressBar";
//import "./cust.css"

import React, { useState, useMemo, useEffect } from "react"; // Added useEffect import
import CurrencyInput from "./components/CurrencyInput";

// Mock data for customer information with multiple shipToAddresses
const customerData = {
  CB00010001: {
    customerName: "Acme Corp.",
    shipToAddresses: [
      "123 Main St, Anytown, USA",
      "456 Oak Ave, Somewhere, USA",
      "789 Pine Ln, Anyplace, USA",
    ],
  },
  CB00010002: {
    customerName: "Global Solutions Inc.",
    shipToAddresses: [
      "456 Tech Park Dr, Technoville, CA",
      "101 Innovation Blvd, Future City, CA",
    ],
  },
  CB00010003: {
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
    id: "MSC",
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

// New popup component for displaying the progress bar
const ProgressBarPopup = ({ onClose }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Pending"); // Initial status changed to "Pending"
  const stages = ["Started", "InProgress", "Complete"];

  useEffect(() => {
    // Set initial progress and status
    setProgress(0);
    setStatus("Pending");

    // Clear any existing intervals to prevent multiple running instances
    // No further progress updates, as per requirement to only show "Pending"
    return () => {}; // Return an empty cleanup function as no interval is started
  }, []); // Run only once on mount

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6 flex flex-col">
        <div className="bg-black text-white p-4 -mx-6 -mt-6 rounded-t-lg flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Invoice Processing Progress</h2>
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
        <div className="p-4">
          {/* Always pass 0 progress for the "Pending" only state */}
          <InvoiceProgressBar progress={0} status={status} stages={stages} />
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
          <button
            // onClick={onClose}
            className="bg-gray-300 text-gray-800 rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-400 transition-colors duration-200"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

// EditDistributionModal Component
const EditDistributionModal = ({ distribution, onSave, onCancel }) => {
  const [editedDist, setEditedDist] = useState(distribution);

  const handleChange = (field, value) => {
    setEditedDist((prev) => ({ ...prev, [field]: value }));
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
          <button
            onClick={onCancel}
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="edit-account"
              className="block text-sm font-medium text-gray-700"
            >
              Account
            </label>
            <input
              type="text"
              id="edit-account"
              value={editedDist.account}
              onChange={(e) => handleChange("account", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="edit-type"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="edit-type"
              value={editedDist.type}
              onChange={(e) => handleChange("type", e.target.value)}
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
              <label
                htmlFor="edit-debit"
                className="block text-sm font-medium text-gray-700"
              >
                Debit
              </label>
              <input
                type="number"
                id="edit-debit"
                value={editedDist.debit}
                onChange={(e) =>
                  handleChange("debit", parseFloat(e.target.value) || 0)
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm text-right"
              />
            </div>
            <div>
              <label
                htmlFor="edit-credit"
                className="block text-sm font-medium text-gray-700"
              >
                Credit
              </label>
              <input
                type="number"
                id="edit-credit"
                value={editedDist.credit}
                onChange={(e) =>
                  handleChange("credit", parseFloat(e.target.value) || 0)
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm text-right"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="edit-description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <input
              type="text"
              id="edit-description"
              value={editedDist.description}
              onChange={(e) => handleChange("description", e.target.value)}
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
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[82vh] max-h-full flex flex-col">
        {/* Header */}
        <div className="bg-black text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-bold">Sales Distribution Entry</h2>
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

        {/* Info Section */}
        <div className="px-4 py-4 md:px-6 md:py-6 grid grid-cols-1 md:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-3 md:gap-y-4 border-b border-gray-200 text-sm">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <label
                htmlFor="dist-customer-id"
                className="w-28 sm:w-36 text-gray-700 font-medium"
              >
                Customer ID
              </label>
              <input
                type="text"
                id="dist-customer-id"
                defaultValue={invoiceHeaderData?.customerId || ""}
                readOnly
                className="flex-grow px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-xs"
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="dist-customer-name"
                className="w-28 sm:w-36 text-gray-700 font-medium"
              >
                Name
              </label>
              <input
                type="text"
                id="dist-customer-name"
                defaultValue={invoiceHeaderData?.Customer || ""}
                readOnly
                className="flex-grow px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-xs"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              {/* <label htmlFor="dist-document-no" className="w-28 sm:w-36 text-gray-700 font-medium">Document No.</label>
              <input type="text" id="dist-document-no" defaultValue={invoiceHeaderData?.documentNumber || ''} readOnly className="flex-grow px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-xs" /> */}
            </div>
            <div className="flex items-center">
              {/* <label htmlFor="dist-document-type" className="w-28 sm:w-36 text-gray-700 font-medium">Document Type</label>
              <input type="text" id="dist-document-type" defaultValue={invoiceHeaderData?.documentType || ''} readOnly className="flex-grow px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-xs" /> */}
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <label
                htmlFor="dist-functional-amount"
                className="w-28 sm:w-36 text-gray-700 font-medium"
              >
                Functional Amount
              </label>
              <div className="flex-grow flex items-center gap-2">
                <span className="mr-1 text-gray-600 font-semibold text-xs"></span>
                <input
                  type="text"
                  id="dist-functional-amount"
                  value="$61,070.00"
                  readOnly
                  className="flex-grow px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-left text-xs"
                />
              </div>
            </div>
            <div className="flex items-center">
              <label
                htmlFor="dist-originating-amount"
                className="w-28 sm:w-36 text-gray-700 font-medium"
              >
                Originating Amount
              </label>
              <div className="flex-grow flex items-center gap-2">
                <span className="mr-1 text-gray-600 font-semibold text-xs"></span>
                <input
                  type="text"
                  id="dist-originating-amount"
                  value="$0.00"
                  readOnly
                  className="flex-grow px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-left text-xs"
                />
              </div>
            </div>
          </div>
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
            style={{ backgroundColor: "black" }}
            className=" text-white rounded-md px-5 py-2.5 text-xs font-medium shadow-sm hover:bg-gray-800 transition-colors duration-200"
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
const SalesTransactionEntryForm = ({ onDistributionsClick, filteredData }) => {
  // Initial mock data for line items
  const initialLineItems = [
    {
      id: 1,
      itemId: "MSC",
      comments: "Program 1 197 310.00 61,070.00",
      qtyOrdered: 197,
      unitPrice: 310.0,
      extendedPrice: 0.0,
    },
  ];
  // State for line items (mock data for demonstration of sorting)
  const [lineItems, setLineItems] = useState(initialLineItems);

  // UseEffec to calculate extended price when line items change
  useEffect(() => {
    console.log("Unit Price");
    setLineItems(() =>
      lineItems.map((item) => ({
        ...item,
        extendedPrice: (item.qtyOrdered || 0) * (item.unitPrice || 0),
      }))
    );
  }, [
    lineItems.map((item) => `${item.qtyOrdered}-${item.unitPrice}`).join("-"),
  ]); // Dependency array to re-calculate when qty or unitPrice changes

  // State for sorting
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' or 'desc'

  // State for selected line item ID (single selection for radio buttons)
  const [selectedLineItemId, setSelectedLineItemId] = useState(null);
  // State for showing delete confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // State for the selected Type/Type ID, initially 'Order'
  const [documentType, setDocumentType] = useState("Order");
  // States for customer and document information, now initialized dynamically or with default
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [shipToAddress, setShipToAddress] = useState(""); // New state for ship-to address
  const [documentNumber, setDocumentNumber] = useState("ORD-001234");
  const [documentDate, setDocumentDate] = useState("2017-04-12");
  const [amountReceived, setAmountReceived] = useState("");
  const [onAccount, setOnAccount] = useState("61,070.00"); //61,070.00
  const [invoiceTotal, setInvoiceTotal] = useState("61,070.00");

  // State for Ship To Address popup
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [availableShipToAddresses, setAvailableShipToAddresses] = useState([]);
  const [showProgressBarPopup, setShowProgressBarPopup] = useState(false); // New state for progress bar popup
  const [showTooltip, setShowTooltip] = useState(false); // State for tooltip visibility

  // New state to track if save is confirmed
  const [isSaveConfirmed, setIsSaveConfirmed] = useState(false);

  // Effect to set initial values or clear if customer ID is empty
  useEffect(() => {
    console.log("Filtered Data:", filteredData);
    // Set initial customer data if a default ID is desired or if it's dynamic
    const initialCustomerId = filteredData[0]?.customerId; // Example default
    const initialCustomerInfo = filteredData[0];
    if (initialCustomerInfo) {
      setCustomerId(initialCustomerId);
      setCustomerName(initialCustomerInfo.Customer);
      setShipToAddress(initialCustomerInfo.shipToAddresses[0] || ""); // Set first address as default
      setAvailableShipToAddresses(initialCustomerInfo.shipToAddresses);
    } else {
      setCustomerId("");
      setCustomerName("");
      setShipToAddress("");
      setAvailableShipToAddresses([]);
    }
  }, []); // Run once on component mount

  // Handle changes in line item fields
  const handleLineItemChange = (id, field, value) => {
    console.log("Unit Price");
    setLineItems((preLineItems) =>
      preLineItems.map((item) => {
        if (item.id === id) {
          let updatedItem = { ...item, [field]: value };

          // If item number changes, update default Unit Price (UOM is now comments, not dependent)
          if (field === "itemId") {
            const selectedItem = mockItems.find(
              (mockItem) => mockItem.id === value
            );
            if (selectedItem) {
              updatedItem.unitPrice = selectedItem.defaultUnitPrice;
            } else {
              updatedItem.unitPrice = 0;
            }
          }

          // Recalculate extended price immediately
          updatedItem.extendedPrice =
            (updatedItem.qtyOrdered || 0) * (updatedItem.unitPrice || 0);
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Function to add a new line item
  const handleAddItem = () => {
    console.log("Unit Price");
    setLineItems((prevLineItems) => [
      ...prevLineItems,
      {
        id:
          prevLineItems.length > 0
            ? Math.max(...prevLineItems.map((item) => item.id)) + 1
            : 1,
        itemId: "",
        comments: "", // Initialize comments for new item
        qtyOrdered: 0,
        unitPrice: 0.0,
        extendedPrice: 0.0,
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
    setLineItems((prevLineItems) =>
      prevLineItems.filter((item) => item.id !== selectedLineItemId)
    );
    setSelectedLineItemId(null); // Deselect the item after deletion
    setShowDeleteConfirmation(false); // Close confirmation dialog
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirmation(false); // Close confirmation dialog
  };

  // Handle sorting logic
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc"); // Default to ascending when changing column
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

  // Handle change for the Type/Type ID dropdown
  const handleNumberFormatChange = (event) => {
    setDocumentType(event.target.value);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2, // Ensures at least two decimal places
      maximumFractionDigits: 2, // Ensures no more than two decimal places
    }).format(event.target.value);
  };

  // Handlers for customer and document fields
  const handleCustomerIdChange = (e) => {
    const id = e.target.value;
    setCustomerId(id);
  };
  const handleCustomerNameChange = (e) => setCustomerName(e.target.value);
  const handleShipToAddressChange = (e) => setShipToAddress(e.target.value); // Handler for Ship To Address
  const handleDocumentNumberChange = (e) => setDocumentNumber(e.target.value);
  const handleDocumentDateChange = (e) => setDocumentDate(e.target.value);
  const handleAmountReceivedChange = (value) => {
    setAmountReceived(value);
    // const cleanString = onAccount.replace(/[$,€£\s]/g, '').replace(/,/g, '');
    // const OnAccountValue = parseFloat(cleanString) - value;
    // setOnAccount(OnAccountValue.toString());
  };
  const handleInvoiceTotalChange = (value) => setInvoiceTotal(value);
  const handleOnAccountChange = (value) => {
    setOnAccount(value);
    // setInvoiceTotal(value);
  };

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

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
    });
    return sortableItems;
  }, [lineItems, sortColumn, sortDirection]);

  // Handle save button click
  const handleSaveClick = () => {
    setShowSaveConfirmation(true);
  };

  // Function to reset all data to initial state
  const handleResetData = () => {
    setLineItems(initialLineItems);
    setDistributions(initialDistributions);
    setIsSaveConfirmed(false); // Reset save confirmation
  };

  // Confirm save
  const confirmSave = () => {
    // Implement actual save logic here
    console.log("Saving data...");
    setShowSaveConfirmation(false);
    setIsSaveConfirmed(true); // Set save confirmed to true
    // Optionally, show a success message or redirect
  };

  // Cancel save
  const cancelSave = () => {
    setShowSaveConfirmation(false);
  };

  // Apply Distributions
  const applyDistributions = () => {
    console.log("Apply Distributions");
  };

  // // Prepare data for Distributions popup
  // const handleDistributionsButtonClick = () => {
  //   const dataToPass = {
  //     customerId,
  //     customerName,
  //     documentNumber,
  //     documentType,
  //     documentDate,
  //     shipToAddress, // Pass the shipToAddress as well
  //   };
  //   onDistributionsClick(dataToPass);
  // };

  // Handle "Generate Invoice" button click to open progress bar popup
  const handleGenerateInvoiceClick = () => {
    setShowProgressBarPopup(true);
  };

  // State for showing save confirmation
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const initialDistributions = [
    {
      id: 1,
      distributionReference: "10000-80000-130030-0000-000-000000-PFSGL-00022",
      account: "10000-80000-130030",
      type: "RECV",
      debit: 61070.0,
      credit: 0.0,
      accountId: "0000-000-000000",
      description: "PFSGL-00022",
    },
    {
      id: 2,
      distributionReference: "10000-90000-130020-0000-000-109290-PFSGL-00022",
      account: "10000-90000-130020",
      type: "SALES",
      debit: 0.0,
      credit: 61070.0,
      accountId: "0000-000-109290",
      description: "PFSGL-00022",
    },
  ];

  const [distributions, setDistributions] = useState(initialDistributions);

  const [editingDistribution, setEditingDistribution] = useState(null); // State for the distribution being edited

  // Handle radio button change for distribution selection
  const handleDistributionSelect = (id) => {
    setSelectedDistributionId(id);
  };

  // Handle inline change for distribution fields
  const handleDistributionChange = (id, field, value) => {
    setDistributions(() =>
      distributions.map((dist) => {
        if (dist.id === id) {
          // For debit and credit, clean the input value before parsing to float
          // This allows for backspace and deletion while maintaining currency format display
          //const cleanedValue = value.replace(/[^0-9.-]+/g, ""); // Remove non-numeric characters except '.' and '-'
          if (field === "debit" || field === "credit") {
            return { ...dist, [field]: parseFloat(value) || 0 };
          }
          return { ...dist, [field]: value };
        }
        return dist;
      })
    );
  };

  // Handle edit click directly from a row's button
  const handleEditClick = (distributionToEdit) => {
    setEditingDistribution(distributionToEdit);
  };

  const functionalTotalsDebit = distributions.reduce(
    (sum, item) => sum + parseFloat(item.debit || 0),
    0
  );
  const functionalTotalsCredit = distributions.reduce(
    (sum, item) => sum + parseFloat(item.credit || 0),
    0
  );

  // State for selected distribution ID (single selection for radio buttons)
  const [selectedDistributionId, setSelectedDistributionId] = useState(null);

  // // Handle edit click
  // const handleEditClick = () => {

  //   if (selectedDistributionId) {
  //     console.log("Edit Distribution Clicked",selectedDistributionId);
  //     const distToEdit = distributions.find(
  //       (dist) => dist.id === selectedDistributionId
  //     );
  //     setEditingDistribution(distToEdit);
  //   }
  // };

  // Handle update from modal
  const handleUpdateDistribution = (updatedDist) => {
    setDistributions((prevDistributions) =>
      prevDistributions.map((dist) =>
        dist.id === updatedDist.id ? updatedDist : dist
      )
    );
    setEditingDistribution(null); // Close modal
  };

  // Handle cancel from modal
  const handleCancelEdit = () => {
    setEditingDistribution(null); // Close modal
  };

  // Handle "OK" button click to open progress bar popup
  const handleOkClick = () => {};

  // Calculate total extended price for the form summary
  const totalExtendedPrice = lineItems.reduce(
    (sum, item) => sum + item.extendedPrice,
    0
  );

  return (
    <div className="flex bg-gray-100 font-sans text-gray-800">
      <div className="form-container bg-white border border-gray-200 rounded-lg shadow-lg w-full">
        <div className="main-content p-4 sm:p-6 bg-white sm:pb-4">
          {" "}
          {/* Reduced bottom padding */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-2 md:gap-y-3 mb-4 sm:mb-6 text-sm overflow-auto">
            {" "}
            {/* Reduced gap-y and mb */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <label
                  htmlFor="customer-id"
                  className="w-36 text-gray-700 font-medium"
                >
                  Customer ID
                </label>
                <div className="flex-grow flex items-center gap-2">
                  <input
                    type="text"
                    id="customer-id"
                    value={customerId}
                    onChange={handleCustomerIdChange}
                    readOnly
                    className="w-full p-1.5 border border-gray-300 bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700"
                  />
                </div>
              </div>
              {/* NEW POSITION FOR DATE */}
              <div className="flex items-center">
                <label
                  htmlFor="date"
                  className="w-36 text-gray-700 font-medium"
                >
                  Date
                </label>
                <div className="flex-grow flex items-center gap-2">
                  <input
                    type="date"
                    id="date"
                    value={documentDate}
                    onChange={handleDocumentDateChange}
                    className="w-full p-1.5 border border-gray-300 bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label
                  htmlFor="date"
                  className="w-36 text-gray-700 font-medium"
                >
                  Amount Received
                </label>
                <div className="flex-grow flex items-center gap-2">
                  <CurrencyInput
                    id="currencyInput"
                    value={amountReceived}
                    onChange={handleAmountReceivedChange}
                    currencySymbol="$" // You can change this symbol
                    decimalSeparator="." // You can change this separator
                    groupSeparator="," // You can change this separator
                    precision={2} // Number of decimal places
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <label
                  htmlFor="customer-name"
                  className="w-36 text-gray-700 font-medium"
                >
                  Customer Name
                </label>
                <div className="flex-grow flex items-center gap-2">
                  <input
                    type="text"
                    id="customer-name"
                    value={customerName}
                    onChange={handleCustomerNameChange}
                    readOnly
                    className="w-full p-1.5 border border-gray-300 bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label
                  htmlFor="customer-po-number"
                  className="w-36 text-gray-700 font-medium"
                >
                  Customer PO Number
                </label>
                <div className="flex-grow flex items-center gap-2">
                  <input
                    type="text"
                    defaultValue="4100647534"
                    className="w-full p-1.5 border border-gray-300 bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label
                  htmlFor="customer-po-number"
                  className="w-36 text-gray-700 font-medium"
                >
                  On Account
                </label>
                <div className="flex-grow flex items-center gap-2">
                  <CurrencyInput
                    id="currencyInput"
                    value={onAccount}
                    onChange={handleOnAccountChange}
                    currencySymbol="$" // You can change this symbol
                    decimalSeparator="." // You can change this separator
                    groupSeparator="," // You can change this separator
                    precision={2} // Number of decimal places
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleShipToAddressClick}
                  className="w-36 text-red-700 underline cursor-pointer text-sm font-medium text-left"
                >
                  Ship To Address
                </button>
                <div className="flex-grow flex items-center gap-2">
                  <input
                    type="text"
                    id="ship-to-address"
                    value={shipToAddress}
                    onChange={handleShipToAddressChange}
                    readOnly
                    className="w-full p-1.5 border border-gray-300 bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label
                  htmlFor="default-site-id"
                  className="w-36 text-gray-700 font-medium"
                >
                  Supplement No
                </label>
                <div className="flex-grow flex items-center gap-2">
                  <input
                    type="text"
                    defaultValue="PVF925"
                    className="w-full p-1.5 border border-gray-300 bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label
                  htmlFor="default-site-id"
                  className="w-36 text-gray-700 font-medium"
                >
                  Requestor Name
                </label>
                <div className="flex-grow flex items-center gap-2">
                  <input
                    type="text"
                    defaultValue="DEREK SYBER"
                    className="w-full p-1.5 border border-gray-300 bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center bg-gray-200 text-gray-800 p-2 mb-0 font-semibold text-base border border-gray-300 rounded-t-md">
            <span>Line Items by Order Entered</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAddItem}
                className="bg-black text-white rounded-full p-1 text-xs font-medium shadow-sm hover:bg-gray-800 transition-colors duration-200"
                title="Add New Line Item"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={handleDeleteSelected}
                className={`rounded-full p-1 text-xs font-medium shadow-sm transition-colors duration-200 ${
                  selectedLineItemId
                    ? "bg-red-700 text-white hover:bg-red-800"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
                title="Delete Selected Line Item"
                disabled={!selectedLineItemId}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto mb-3 sm:mb-3">
            <div className="relative">
              <div className="overflow-y-auto max-h-[105px] border border-gray-300 rounded-b-md">
                {" "}
                {/* 2 rows * 48px (approx row height) + header height */}
                <table className="w-full border-collapse bg-white border border-gray-300 rounded-lg">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr>
                      <th className="border border-gray-200 p-1 md:p-2 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-[40px]"></th>
                      <th
                        className="border border-gray-200 p-1 md:p-2 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-1/4 cursor-pointer"
                        onClick={() => handleSort("itemId")}
                      >
                        Item Number{" "}
                        {sortColumn === "itemId" &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        className="border border-gray-200 p-1 md:p-2 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-1/6 cursor-pointer"
                        onClick={() => handleSort("comments")}
                      >
                        Comments{" "}
                        {sortColumn === "comments" &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        className="border border-gray-200 p-1 md:p-2 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-1/6 cursor-pointer"
                        onClick={() => handleSort("qtyOrdered")}
                      >
                        Invoice Quantity{" "}
                        {sortColumn === "qtyOrdered" &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        className="border border-gray-200 p-1 md:p-2 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-1/6 cursor-pointer"
                        onClick={() => handleSort("unitPrice")}
                      >
                        Unit Price{" "}
                        {sortColumn === "unitPrice" &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        className="border border-gray-200 p-1 md:p-2 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-1/4 cursor-pointer"
                        onClick={() => handleSort("extendedPrice")}
                      >
                        Extended Price{" "}
                        {sortColumn === "extendedPrice" &&
                          (sortDirection === "asc" ? "▲" : "▼")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedLineItems.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => handleRowClick(item.id)}
                        className={`cursor-pointer ${
                          selectedLineItemId === item.id
                            ? "bg-blue-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="border border-gray-200 p-1 text-center">
                          <input
                            type="radio"
                            name="lineItemSelection"
                            checked={selectedLineItemId === item.id}
                            onChange={(e) =>
                              handleRadioButtonChange(item.id, e)
                            }
                            className="accent-black"
                          />
                        </td>
                        <td className="border border-gray-200 p-1">
                          <input
                            type="text"
                            value={item.itemId}
                            onChange={(e) =>
                              handleLineItemChange(
                                item.id,
                                "itemId",
                                e.target.value
                              )
                            }
                            placeholder="Enter Item ID"
                            className="border-none w-full p-0.5 text-xs sm:text-sm bg-transparent focus:outline-none focus:ring-red-700 focus:border-red-700"
                          />
                        </td>
                        <td className="border border-gray-200 p-1">
                          <input
                            type="text"
                            value={item.comments}
                            onChange={(e) =>
                              handleLineItemChange(
                                item.id,
                                "comments",
                                e.target.value
                              )
                            }
                            placeholder="Add comments here"
                            className="border-none w-full p-0.5 text-xs sm:text-sm bg-transparent focus:outline-none focus:ring-red-700 focus:border-red-700"
                          />
                        </td>
                        <td className="border border-gray-200 p-1">
                          <input
                            type="number"
                            value={item.qtyOrdered}
                            onChange={(e) =>
                              handleLineItemChange(
                                item.id,
                                "qtyOrdered",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="border-none w-full p-0.5 text-xs sm:text-sm bg-transparent focus:outline-none focus:ring-red-700 focus:border-red-700"
                          />
                        </td>
                        <td className="border border-gray-200 p-1">
                          <div className="flex items-center">
                            <input
                              // type="number"
                              //value={item.unitPrice.toFixed(2)}
                              value={item.unitPrice.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                              onChange={(e) =>
                                handleLineItemChange(
                                  item.id,
                                  "unitPrice",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="border-none w-full p-0.5 text-xs sm:text-sm bg-transparent focus:outline-none focus:ring-red-700 focus:border-red-700 text-right"
                            />
                          </div>
                        </td>
                        <td className="border border-gray-200 p-1">
                          <div className="flex items-center">
                            {/* <span className="text-gray-700 text-xs sm:text-sm mr-1 text-right">
                              $
                            </span> */}
                            <input
                              type="text"
                              value={item.extendedPrice.toLocaleString(
                                "en-US",
                                {
                                  style: "currency",
                                  currency: "USD",
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                              readOnly
                              className="border-none w-full p-0.5 text-xs sm:text-sm bg-transparent text-left focus:outline-none text-right"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-3" style={{ paddingTop: "4px" }}>
            <div className="col-span-3">
              {/* Account Distributions Grid */}
              {/* <div className="flex-1 p-4 md:p-6 overflow-y-auto"> */}
              <div>
                <div className="overflow-x-auto mb-4 border border-gray-300 rounded-lg">
                  <table className="w-full border-collapse bg-white min-w-full">
                    <thead>
                      <tr>
                        <th className="border border-gray-200 p-2 md:p-3 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm w-[40px]"></th>
                        <th className="border border-gray-200 p-2 md:p-3 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm min-w-[250px]">
                          <div className="flex items-center space-x-1">
                            <span>Distribution Reference</span>
                            <div
                              className="relative"
                              onMouseEnter={() => setShowTooltip(true)}
                              onMouseLeave={() => setShowTooltip(false)}
                            >
                              <Info
                                size={16}
                                className="text-gray-500 cursor-help"
                              />
                              {showTooltip && (
                                <div className="absolute z-10 top-1/2 left-full -translate-y-1/2 ml-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap">
                                  Business -Unit -Market-Account -Cost
                                  Center-Product-Location-default-code
                                </div>
                              )}
                            </div>
                          </div>
                        </th>
                        <th className="border border-gray-200 p-2 md:p-3 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm min-w-[80px]">
                          Type
                        </th>
                        <th className="border border-gray-200 p-2 md:p-3 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm min-w-[120px]">
                          Originating Debit
                        </th>
                        <th className="border border-gray-200 p-2 md:p-3 text-left bg-gray-100 font-semibold text-gray-700 text-xs sm:text-sm min-w-[120px]">
                          Originating Credit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {distributions.map((dist) => (
                        <tr
                          key={dist.id}
                          className={`${
                            selectedDistributionId === dist.id
                              ? "bg-blue-50"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => handleDistributionSelect(dist.id)}
                        >
                          <td className="border border-gray-200 p-1 text-center w-[40px]">
                            <input
                              type="radio"
                              name="selectedDistribution"
                              checked={selectedDistributionId === dist.id}
                              onChange={() => handleDistributionSelect(dist.id)}
                              className="accent-black"
                            />
                          </td>
                          <td className="border border-gray-200 p-1 min-w-[250px]">
                            <input
                              type="text"
                              value={dist.distributionReference}
                              onChange={(e) =>
                                handleDistributionChange(
                                  dist.id,
                                  "distributionReference",
                                  e.target.value
                                )
                              }
                              className="border-none w-full p-0.5 text-xs sm:text-sm bg-transparent focus:outline-none focus:ring-red-700 focus:border-red-700"
                            />
                          </td>

                          <td className="border border-gray-200 p-2 text-xs sm:text-sm text-gray-700 min-w-[80px]">
                            {dist.type}
                          </td>
                          <td className="border border-gray-200 p-2 min-w-[120px]">
                            <input
                              type="text"
                              value={dist.debit.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                              onChange={(e) =>
                                handleDistributionChange(
                                  dist.id,
                                  "debit",
                                  parseFloat(
                                    e.target.value.replace(/[^0-9.-]+/g, "")
                                  ) || 0
                                )
                              }
                              className="border-none w-full p-0.5 text-xs sm:text-sm bg-transparent focus:outline-none focus:ring-red-700 focus:border-red-700 text-right"
                            />
                          </td>
                          <td className="border border-gray-200 p-2 min-w-[120px]">
                            <input
                              type="text"
                              value={dist.credit.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                              onChange={(e) =>
                                handleDistributionChange(
                                  dist.id,
                                  "credit",
                                  parseFloat(
                                    e.target.value.replace(/[^0-9.-]+/g, "")
                                  ) || 0
                                )
                              }
                              className="border-none w-full p-0.5 text-xs sm:text-sm bg-transparent focus:outline-none focus:ring-red-700 focus:border-red-700 text-right"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals Section */}
                {/* <div className="grid grid-cols-[50%_12%_12%_23%_5%] gap-3 mt-4 text-sm"> */}
                <div class="grid grid-flow-col grid-rows-2 gap-4">
                  {" "}
                  <div className="flex col-span-2 space-x-2">
                    {" "}
                    {/* Debit and Credit inputs */}
                    <span
                      className="text-gray-600 font-semibold"
                      style={{ paddingRight: "3rem" }}
                    >
                      {" "}
                      Functional Totals
                    </span>
                    <input
                      type="text"
                      value={"$" + functionalTotalsDebit.toFixed(2)}
                      readOnly
                      className="p-1 border border-gray-300 rounded-md bg-gray-50 text-left w-56 sm:w-56 font-bold text-xs sm:text-sm text-right"
                    />
                    <span className="text-gray-600 font-semibold"></span>
                    <input
                      type="text"
                      value={"$" + functionalTotalsCredit.toFixed(2)}
                      readOnly
                      className="p-1 border border-gray-300 rounded-md bg-gray-50 text-left w-56 sm:w-56 font-bold text-xs sm:text-sm text-right"
                    />
                  </div>
                  <div className="flex col-span-2 space-x-2">
                    {" "}
                    {/* Debit and Credit inputs */}
                    <span
                      className="text-gray-600 font-semibold"
                      style={{ paddingRight: "41px" }}
                    >
                      {" "}
                      Originating Totals
                    </span>
                    <input
                      type="text"
                      defaultValue="$0.00"
                      readOnly
                      className="p-1 border border-gray-300 rounded-md bg-gray-50 text-left w-56 sm:w-56 text-xs sm:text-sm text-right"
                    />
                    <span className="text-gray-600 font-semibold"></span>
                    <input
                      type="text"
                      defaultValue="$0.00"
                      readOnly
                      className="p-1 border border-gray-300 rounded-md bg-gray-50 text-left w-56 sm:w-56 text-xs sm:text-sm text-right"
                    />
                  </div>
                </div>
              </div>
              {editingDistribution && (
                <EditDistributionModal
                  distribution={editingDistribution}
                  onSave={handleUpdateDistribution}
                  onCancel={handleCancelEdit}
                />
              )}
            </div>
            <div className="col-span-1"></div>
            <div className="col-span-full md:col-span-1 flex flex-col space-y-2">
              {/* Subtotal */}
              <div className="flex items-center">
                <label
                  htmlFor="subtotal"
                  className="w-[160px] text-gray-700 font-medium"
                >
                  Subtotal
                </label>
                <div className="flex-grow flex justify-end">
                  <input
                    type="text"
                    id="subtotal"
                    value={totalExtendedPrice.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    readOnly
                    className="p-1.5 border border-gray-300 bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700 text-right w-full max-w-[300px]"
                  />
                </div>
              </div>
              {/* Tax */}
              <div className="flex items-center">
                <label
                  htmlFor="tax"
                  className="w-[160px] text-gray-700 font-medium"
                >
                  Tax
                </label>
                <div className="flex-grow flex justify-end">
                  <input
                    type="text"
                    id="tax"
                    value="$0.00"
                    readOnly
                    className="p-1.5 border border-gray-300 bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700 text-right w-full max-w-[300px]"
                  />
                </div>
              </div>
              {/* Freight */}
              <div className="flex items-center">
                <label
                  htmlFor="freight"
                  className="w-[160px] text-gray-700 font-medium"
                >
                  Freight
                </label>
                <div className="flex-grow flex justify-end">
                  <input
                    type="text"
                    id="freight"
                    value="$0.00"
                    readOnly
                    className="p-1.5 border border-gray-300 bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700 text-right w-full max-w-[300px]"
                  />
                </div>
              </div>
              {/* Miscellaneous */}
              <div className="flex items-center">
                <label
                  htmlFor="miscellaneous"
                  className="w-[160px] text-gray-700 font-medium"
                >
                  Miscellaneous
                </label>
                <div className="flex-grow flex justify-end">
                  <input
                    type="text"
                    id="miscellaneous"
                    value="$0.00"
                    readOnly
                    className="p-1.5 border border-gray-300 bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700 text-right w-full max-w-[300px]"
                  />
                </div>
              </div>
              {/* Total */}
              <div className="flex items-center">
                <label
                  htmlFor="total"
                  className="w-[160px] text-gray-700 font-bold"
                >
                  <strong>Total</strong>
                </label>
                <div font-boldclassName="flex-grow flex justify-end">
                  <input
                    type="text"
                    id="total"
                    value={totalExtendedPrice.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    readOnly
                    className="font-bold p-1.5 border border-gray-300 bg-gray-50 text-sm focus:ring-red-700 focus:border-red-700 text-right w-full max-w-[300px]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-3 sm:mt-4 space-y-2 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              {/* <button
                onClick={applyDistributions}
                className="rounded-md px-3 py-1.5 text-sm font-medium shadow-sm transition-colors duration-200 w-full sm:w-auto bg-black text-white hover:bg-gray-800"
              >
                Apply Distributions
              </button> */}
              <button
                onClick={handleSaveClick}
                className="bg-black text-white rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-800 transition-colors duration-200"
              >
                Save
              </button>
              <button
                onClick={handleResetData} // Add Reset button
                className="bg-black text-white rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-800 transition-colors duration-200"
              >
                Reset
              </button>
              <button
                onClick={handleGenerateInvoiceClick}
                disabled={!isSaveConfirmed} // Disable if save is not confirmed
                className={`px-5 py-2.5 text-sm font-medium shadow-sm transition-colors duration-200 rounded-md ${
                  isSaveConfirmed
                    ? "bg-black text-white rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-800 transition-colors duration-200"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Generate Invoice
              </button>
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
      {showProgressBarPopup && (
        <ProgressBarPopup onClose={() => setShowProgressBarPopup(false)} />
      )}
    </div>
  );
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
  const [showInvoice, setShowInvoice] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [animate, setAnimate] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const [selectedCustomerForEdit, setSelectedCustomerForEdit] = useState(
    undefined
  );
  const [selectedCustomerForDelete, setSelectedCustomerForDelete] = useState(
    undefined
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [latestId, setLatestId] = useState(undefined);

  const handleOpenCustomerModal = () => {
    setShowTable(false);
    const latestId = CustomerData.map((c) =>
      parseInt(c.customerId.replace("CB", ""))
    ).sort((a, b) => b - a)[0];
    const strLatestId = "CB" + String(latestId + 1).padStart(8, "0");
    setLatestId(strLatestId);

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
      PONumber: "4100647534",
      defaultSiteid: Math.random() > 0.5 ? "DROP SHIP" : "WAREHOUSE",
      shipToAddresses: [
        "123 Main St, Anytown, USA",
        "456 Oak Ave, Somewhere, USA",
        "789 Pine Ln, Anyplace, USA",
      ],
    },
    {
      customerId: "CB00010002",
      Customer: "Logitech",
      company: "Logitech Inc",
      contact: "Sarah Lee",
      phone: "510-555-1234",
      email: "sarah.lee@logitech.com",
      status: "Active",
      PONumber: "4100647534",
      defaultSiteid: Math.random() > 0.5 ? "DROP SHIP" : "WAREHOUSE",
      shipToAddresses: [
        "123 Main St, Anytown, USA",
        "456 Oak Ave, Somewhere, USA",
        "789 Pine Ln, Anyplace, USA",
      ],
    },
    {
      customerId: "CB00010003",
      Customer: "HP",
      company: "HP Inc",
      contact: "John Smith",
      phone: "650-555-5678",
      email: "john.smith@hp.com",
      status: "Inactive",
      PONumber: "4100647534",
      defaultSiteid: Math.random() > 0.5 ? "DROP SHIP" : "WAREHOUSE",
      shipToAddresses: [
        "123 Main St, Anytown, USA",
        "456 Oak Ave, Somewhere, USA",
        "789 Pine Ln, Anyplace, USA",
      ],
    },
    {
      customerId: "CB00010004",
      Customer: "Dell",
      company: "Dell Technologies",
      contact: "Priya Patel",
      phone: "512-555-7890",
      email: "priya.patel@dell.com",
      status: "Active",
      PONumber: "4100647534",
      defaultSiteid: Math.random() > 0.5 ? "DROP SHIP" : "WAREHOUSE",
      shipToAddresses: [
        "123 Main St, Anytown, USA",
        "456 Oak Ave, Somewhere, USA",
        "789 Pine Ln, Anyplace, USA",
      ],
    },
    {
      customerId: "CB00010005",
      Customer: "Apple",
      company: "Apple Inc",
      contact: "Emily Chen",
      phone: "408-555-2468",
      email: "emily.chen@apple.com",
      status: "Active",
      PONumber: "4100647534",
      defaultSiteid: Math.random() > 0.5 ? "DROP SHIP" : "WAREHOUSE",
      shipToAddresses: [
        "123 Main St, Anytown, USA",
        "456 Oak Ave, Somewhere, USA",
        "789 Pine Ln, Anyplace, USA",
      ],
    },
    {
      customerId: "CB00010004",
      Customer: "Google",
      company: "Google Inc",
      contact: "Tim Ling",
      phone: "408-666-2468",
      email: "Tim.chen@apple.com",
      status: "Active",
      PONumber: "4100647534",
      defaultSiteid: Math.random() > 0.5 ? "DROP SHIP" : "WAREHOUSE",
      shipToAddresses: [
        "456 Tech Park Dr, Technoville, CA",
        "101 Innovation Blvd, Future City, CA",
      ],
    },
    {
      customerId: "CB00010006",
      Customer: "Samsung",
      company: "Samsung Electronics",
      contact: "David Kim",
      phone: "+82-2-5555-1234",
      email: "david.kim@samsung.com",
      status: "Inactive",
      PONumber: "4100647534",
      defaultSiteid: Math.random() > 0.5 ? "DROP SHIP" : "WAREHOUSE",
      shipToAddresses: [
        "456 Tech Park Dr, Technoville, CA",
        "101 Innovation Blvd, Future City, CA",
      ],
    },
    {
      customerId: "CB00010007",
      Customer: "Sony",
      company: "Sony Corp",
      contact: "Hiro Tanaka",
      phone: "+81-3-5555-1234",
      email: "hiro.tanaka@sony.com",
      status: "Active",
      PONumber: "4100647534",
      defaultSiteid: Math.random() > 0.5 ? "DROP SHIP" : "WAREHOUSE",
      shipToAddresses: [
        "789 Innovation Way, New City, NY",
        "202 Research Rd, Old Town, NY",
        "303 Progress Pl, Anotherburg, NY",
        "404 Discovery Dr, Distantland, NY",
      ],
    },
    {
      customerId: "CB00010008",
      Customer: "Lenovo",
      company: "Lenovo Group",
      contact: "Wei Zhang",
      phone: "+86-10-5555-1234",
      email: "wei.zhang@lenovo.com",
      status: "Active",
      PONumber: "4100647534",
      defaultSiteid: Math.random() > 0.5 ? "DROP SHIP" : "WAREHOUSE",
      shipToAddresses: [
        "789 Innovation Way, New City, NY",
        "202 Research Rd, Old Town, NY",
        "303 Progress Pl, Anotherburg, NY",
        "404 Discovery Dr, Distantland, NY",
      ],
    },
    {
      customerId: "CB00010009",
      Customer: "Acer",
      company: "Acer Inc",
      contact: "Lina Wu",
      phone: "+886-2-5555-1234",
      email: "lina.wu@acer.com",
      status: "Inactive",
      PONumber: "4100647534",
      defaultSiteid: Math.random() > 0.5 ? "DROP SHIP" : "WAREHOUSE",
      shipToAddresses: [
        "456 Tech Park Dr, Technoville, CA",
        "101 Innovation Blvd, Future City, CA",
      ],
    },
    {
      customerId: "CB00010010",
      Customer: "Asus",
      company: "AsusTek",
      contact: "Ken Lee",
      phone: "+886-2-5555-5678",
      email: "ken.lee@asus.com",
      status: "Active",
      PONumber: "4100647534",
      defaultSiteid: Math.random() > 0.5 ? "DROP SHIP" : "WAREHOUSE",
      shipToAddresses: [
        "123 Main St, Anytown, USA",
        "456 Oak Ave, Somewhere, USA",
        "789 Pine Ln, Anyplace, USA",
      ],
    },
  ];

  const [CustomerData, setCustomerData] = useState(_initialCustomerData);
  const filteredData =
    searchValue.trim() === ""
      ? []
      : CustomerData.filter(
          (row) =>
            row.company.toLowerCase().includes(searchValue.toLowerCase()) ||
            row.customerId.toLowerCase().includes(searchValue.toLowerCase())
        );

  const [showLogout, setShowLogout] = useState(false);

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
  const openDistributionsPopup = (filteredData) => {
    setInvoiceHeaderDataForDistribution(filteredData); // Store the received data
    setShowDistributionPopup(true);
  };

  // Function to close the Distributions popup
  const closeDistributionsPopup = () => {
    setShowDistributionPopup(false);
    setInvoiceHeaderDataForDistribution(null); // Clear data when closing
  };

  const generateManualInvoice = (row) => {
    setShowInvoice(true);
    setShowTable(false);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "customer":
        return (
          <div id="CustomerInfoSection">
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
                        onClick={() => {
                          setSearchInput("");
                          setShowTable(false);
                        }}
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
                            strokeWidth="2"
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
                  {/* <h2 className="text-xl font-bold">Non-Retail Customer List</h2> */}
                  <div className="flex items-center space-x-4">
                    <div className="relative group ml-auto flex justify-end">
                      <button
                        id="addNewCustomerBtn"
                        className="bg-black text-white rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-800 transition-colors duration-200"
                        aria-label="Add New Customer"
                        onClick={handleOpenCustomerModal}
                      >
                        {/* <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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
                        </svg> */}
                        Add New Customer
                      </button>
                      {/* <span className="absolute left-1/2 -translate-x-1/2 mt-10 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        New Customer
                      </span> */}
                    </div>
                    {showCustomerModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div
                          className={`bg-white rounded shadow-lg w-full max-w-2xl mx-2 relative border border-gray-300
        ${modalVisible ? "modal-fade-in" : "modal-fade-out"}`}
                        >
                          <AddCustomer
                            id={latestId}
                            onSave={(formData) => {
                              setCustomerData([...CustomerData, formData]);
                              setShowCustomerModal(false);
                              setShowTable(false);
                            }}
                            onClose={() => setShowCustomerModal(false)}
                          />
                          {/* <AddCustomerWithButton
                            id={latestId}
                            onSave={(formData) => {
                              setCustomerData([...CustomerData, formData]);
                              setShowCustomerModal(false);
                            }}
                            onClose={() => setShowCustomerModal(false)}
                          /> */}
                        </div>
                      </div>
                    )}

                    {selectedCustomerForDelete && (
                      <DeleteConfirmationMessage
                        message={
                          "Are you sure you want to delete the selected customer?"
                        }
                        onCancel={() => setSelectedCustomerForDelete(undefined)}
                        onConfirm={() => {
                          setCustomerData(
                            CustomerData.filter(
                              (data) =>
                                data.customerId !=
                                selectedCustomerForDelete.customerId
                            )
                          );
                          setSelectedCustomerForDelete(undefined);
                        }}
                      ></DeleteConfirmationMessage>
                    )}

                    {selectedCustomerForEdit && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div
                          className={`bg-white rounded shadow-lg w-full max-w-2xl mx-2 relative border border-gray-300
        ${modalVisible ? "modal-fade-in" : "modal-fade-out"}`}
                        >
                          <AddCustomer
                            id={selectedCustomerForEdit?.customerId}
                            customerData={selectedCustomerForEdit}
                            onSave={(formData) => {
                              const currentCustomerData = CustomerData.findIndex(
                                (c) => c.customerId == formData.customerId
                              );
                              if (currentCustomerData > -1) {
                                CustomerData[currentCustomerData] = {
                                  ...formData,
                                };
                              }
                              setSelectedCustomerForEdit(undefined);
                            }}
                            onClose={() =>
                              setSelectedCustomerForEdit(undefined)
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>
              <div>
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
                          <th className="px-2 py-1 text-[13px] text-left cursor-pointer hover:text-blue-600">
                            Customer ID
                          </th>
                          <th className="px-2 py-1 text-[13px] text-left cursor-pointer hover:text-blue-600">
                            Customer Name
                          </th>
                          {/* <th className="px-2 py-1 text-[13px] text-left cursor-pointer hover:text-blue-600">
                            Company Name
                          </th> */}
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
                              {/* <td className="px-2 py-2 w-6 text-center align-middle">
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
                              </td> */}
                              <td className="px-2 py-1 text-[13px]">
                                {row.customerId ||
                                  `CB0001${String(globalIdx + 1).padStart(
                                    4,
                                    "0"
                                  )}`}
                              </td>
                              <td className="px-2 py-1 text-[13px]">
                                {row.Customer}
                              </td>
                              {/* <td className="px-2 py-1 text-[13px]">
                                {row.company}
                              </td> */}
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
                              <td className="px-4 py-1 text-[13px] flex gap-1">
                                {/* Edit Button */}
                                <div className="relative group">
                                  <button
                                    className="p-1 rounded-full hover:bg-blue-100 transition-colors"
                                    aria-label="Edit"
                                    onClick={() => {
                                      setSelectedCustomerForEdit(row);
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
                                {/* <div className="relative group">
                                  <button
                                    className="p-1 rounded-full hover:bg-red-100 transition-colors"
                                    aria-label="Delete"
                                    onClick={() =>
                                      setSelectedCustomerForDelete(row)
                                    }
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
                                </div> */}
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
                                ? "bg-black text-white"
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
      case "sales-transaction-entry":
        return (
          // <SalesTransactionEntryForm
          //   onDistributionsClick={openDistributionsPopup}
          // />
          <div id="CustomerInfoSection">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-2">
                {!showInvoice && (
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
                          onClick={() => {
                            setSearchInput("");
                            setShowTable(false);
                            setShowInvoice(false);
                          }}
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
                              strokeWidth="2"
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
                )}
                {showInvoice && (
                  <button
                    type="button"
                    className="p-2 ml-1 flex items-center rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Back to Customer List"
                    style={{
                      fontFamily: "Segoe UI, Arial, sans-serif",
                      fontWeight: 500,
                      fontSize: 15,
                    }}
                    onClick={() => {
                      setShowInvoice(false);
                      setShowTable(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                      style={{ minWidth: 20 }}
                    >
                      <path d="M19 12H6M12 5l-7 7 7 7" />
                    </svg>
                    Back to Customer List
                  </button>
                )}
              </div>
              <div>
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
                          <th className="px-2 py-1 text-[13px] text-left cursor-pointer hover:text-blue-600">
                            Customer ID
                          </th>
                          <th className="px-2 py-1 text-[13px] text-left cursor-pointer hover:text-blue-600">
                            Customer Name
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
                              {/* <td className="px-2 py-2 w-6 text-center align-middle">
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
                              </td> */}
                              <td className="px-2 py-1 text-[13px]">
                                {row.customerId ||
                                  `CB0001${String(globalIdx + 1).padStart(
                                    4,
                                    "0"
                                  )}`}
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
                                {/* Create Button */}
                                <div className="relative group">
                                  <button
                                    id="createInvoiceBtn"
                                    className="bg-black text-white rounded-md px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-gray-800 transition-colors duration-200"
                                    aria-label="Create"
                                    onClick={() => {
                                      generateManualInvoice(row);
                                    }}
                                  >
                                    Create Invoice
                                  </button>
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
                                ? "bg-black text-white"
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
              <div>
                {showInvoice && filteredData.length > 0 && (
                  <SalesTransactionEntryForm
                    onDistributionsClick={openDistributionsPopup}
                    filteredData={filteredData}
                    id={selectedCustomerForEdit?.customerId}
                    customerData={selectedCustomerForEdit}
                  />
                )}
                {/* {showTable && filteredData.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No customers found. Please try a different search.
                  </div>
                )} */}
              </div>
            </div>
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

  return (
    <div className="bg-gray-100 font-sans text-gray-800 flex flex-col">
      {/* New Top Bar for Application Title/Branding */}
      <div className="bg-black p-1 sm:p-1 flex items-center justify-between border-b border-gray-800 shadow-sm">
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Verizon Logo */}
          <img
            src={logo}
            alt="Verizon Logo"
            className="h-6 sm:h-10 w-auto mr-2 inline-block align-middle"
          />
          <h1 className="text-sm sm:text-base font-bold text-white hidden sm:block">
            <span className="first-letter">A</span>ccounts-
            <span className="first-letter">R</span>evenue-
            <span className="first-letter">C</span>ontracts
          </h1>
        </div>
        <div
          className={`flex items-center space-x-2 mr-6 sm:space-x-4 text-white text-xs sm:text-sm relative transition-shadow duration-300
      ${showLogout ? "z-30" : ""}
    `}
        >
          {/* Cylinder shadow background */}
          <div
            className={`
        absolute -top-2 left-0 right-0 h-[56px] sm:h-[56px] rounded-full
        transition-all duration-300 pointer-events-none
        ${
          showLogout
            ? "shadow-[0_8px_32px_0_rgba(30,41,59,0.45)] bg-[#23272e]"
            : ""
        }
      `}
            style={{
              zIndex: 1,
              // The shadow ends just before the logout button
              width: "100%",
            }}
          ></div>
          {/* User Avatar */}
          <img
            src="https://ui-avatars.com/api/?name=John+Doe&background=1d1f1f&color=fff"
            alt="User Avatar"
            className="w-8 h-8 rounded-full border-2 border-gray-700 relative z-10"
            onClick={() => setShowLogout((prev) => !prev)}
            style={{ cursor: "pointer" }}
          />
          {/* Username (clickable) */}
          <button
            className="font-semibold hidden sm:block bg-transparent border-none outline-none cursor-pointer relative z-10 px-2 py-1"
            onClick={() => setShowLogout((prev) => !prev)}
            style={{
              borderRadius: "9999px",
              background: showLogout ? "#23272e" : "transparent",
              boxShadow: showLogout
                ? "0 8px 32px 0 rgba(30,41,59,0.45)"
                : "none",
              transition: "background 0.3s, box-shadow 0.3s",
            }}
          >
            John Doe
          </button>
          {/* Logout Dropdown */}
          {showLogout && (
            <div className="absolute right-2 top-full mt-5 w-32 bg-white rounded-b shadow-lg z-20">
              <button
                className="block w-full rounded-md text-center text-left px-4 py-2 text-sm text-white bg-black hover:bg-black hover:text-white"
                // onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Top Navigation Bar (with main links) */}
      <header className="bg-white text-gray-900 p-2 sm:p-2 flex items-center justify-start border-b border-gray-200 overflow-x-auto whitespace-nowrap">
        <nav className="flex space-x-3 sm:space-x-6 px-2 sm:px-4">
          <button
            onClick={() => handleTopNavClick("customer", "customer")}
            className={`py-1 px-3 rounded-sm hover:bg-gray-100 transition-colors duration-200 focus:outline-none font-bold text-sm ${
              topNavActiveItem === "customer"
                ? "text-black-700 border-b-2 border-red-700"
                : "text-gray-700"
            }`}
          >
            Customer
          </button>
          <button
            onClick={() =>
              handleTopNavClick("sales", "sales-transaction-entry")
            }
            className={`py-1 px-3 rounded-sm hover:bg-gray-100 transition-colors duration-200 focus:outline-none font-bold text-sm ${
              topNavActiveItem === "sales"
                ? "text-black-700 border-b-2 border-red-700"
                : "text-gray-700"
            }`}
          >
            Invoice
          </button>
          <button
            onClick={() => handleTopNavClick("profile", "my-profile")}
            className={`py-1 px-3 rounded-sm  hover:bg-gray-100 transition-colors duration-200 focus:outline-none font-bold text-sm ${
              topNavActiveItem === "profile"
                ? "text-black-700 border-b-2 border-red-700"
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
          invoiceHeaderData={filteredData}
        />
      )}
    </div>
  );
};

export default App;
