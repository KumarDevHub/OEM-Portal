import React, { useState } from "react";

const AddCustomer = ({ onClose, onSave, customerData, id }) => {
  // State to hold all form data
  console.log("AddCustomer component rendered with customerData:", id);
  const [formData, setFormData] = useState(
    customerData || {
      customerId: id,
      customerName: "",
      escalationContact: "",
      escalationEmail: "",
      customerContactName: "",
      customerContactEmail: "",
      accountPayableName: "",
      accountPayableEmail: "",
      attention: "",
      contact: "", // to be removed once table updated
      email1: "",
      email2: "", // to be removed once table updated
      paymentTerms: "",
      customer: "",
      phone1: "",
      company: "",
      phone2: "",
      shortName: "",
      shippingMethod: "",
      statementName: "",
      territoryID: "",
      classID: "",
      // Initialize phone3, phone4, and email3 for explicit placement
      // phone3: "",
      // phone4: "",
      // email3: "",
      // email
      streetAddress1: "",
      state: "",
      streetAddress2: "",
      country: "",
      streetAddress3: "",
      zip: "",
      city: "",
      Contact: "",
      status: "Active", // Default status
    }
  );

  const [showAdditionalContactModal, setShowAdditionalContactModal] = useState(
    false
  );
  const [additionalContactType, setAdditionalContactType] = useState("");
  const [additionalContactValue, setAdditionalContactValue] = useState("");

  const additionalContactOptions = [
    { label: "Phone", value: "phone" },
    { label: "Email", value: "email" },
  ];

  // Handle input changes for text fields for existing fields
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle radio button changes
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle adding new additional phone/email fields dynamically
  const handleAddAdditionalContact = () => {
    if (!additionalContactType || !additionalContactValue) return;

    setFormData((prevData) => {
      const existingKeys = Object.keys(prevData);
      const base = additionalContactType.toLowerCase(); // "phone" or "email"

      // Determine the next available index for phone or email
      let nextIndex = 1;
      while (existingKeys.includes(`${base}${nextIndex}`)) {
        nextIndex++;
      }

      return {
        ...prevData,
        [`${base}${nextIndex}`]: additionalContactValue,
      };
    });

    setShowAdditionalContactModal(false);
    setAdditionalContactType("");
    setAdditionalContactValue("");
  };

  return (
    <>
      <style>
        {`
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  background-color: #f4f4f4;
                }
                .radio-group .radio-item label {
                    margin-left: 5px;
                    margin-right: 2rem;
                }
                .radio-item input[type="radio"]:checked {
                    accent-color: black; /* Blue color for the selected radio button */
                }

                .modal-overlay {
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background-color: rgba(0, 0, 0, 0.5);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  z-index: 1000;
                }

                .modal-content {
                  background-color: #fefefe;
                  border-radius: 8px;
                  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                  width: 90%;
                  max-width: 95vw;
                  max-height: 95vh;
                  overflow: hidden;
                  display: flex;
                  flex-direction: column;
                }

                .modal-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding-bottom: 5px;
                  border-bottom: 1px solid #eee;
                  margin-bottom: 5px;
                }

                .modal-header h2 {
                  margin: 0;
                  font-size: 22px;
                  color: #333;
                }

                .close-button {
                  background: none;
                  border: none;
                  font-size: 26px;
                  font-weight: bold;
                  color: #aaa;
                  cursor: pointer;
                  padding: 0 5px;
                }

                .close-button:hover,
                .close-button:focus {
                  color: #000;
                }

                .modal-body {
                  flex-grow: 1;
                  display: flex;
                  flex-direction: column;
                  overflow-y: auto; /* Allow scroll for the main content area if it overflows */
                  padding: 10px; /* Space for scrollbar */
                }

                .section {
                  padding: 12px;
                  padding-left: 12px;
                  padding-right: 12px;
                  border: 1px solid #e0e0e0;
                  border-radius: 6px;
                  background-color: #f9f9f9;
                }

                .section .section-header {
                  margin-top: 0;
                  margin-bottom: 10px;
                  color: #000;
                  font-size: 18px;
                  font-weight: bold;
                }

                .form-row {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 3rem; /* Horizontal gap between form-items in a row */
                  margin-bottom: 5px; /* Vertical gap between form-rows */
                  align-items: center;
                }

                tr {
                  margin-top: 0.5rem
                }

                .form-item {
                  display: flex;
                  align-items: center;
                  flex-basis: calc(50% - 3rem); /* Half width for two columns per row */
                  min-width: 280px; /* Minimum width for each column item */
                  gap: 8px; /* Space between label and its input */
                }

                .form-item label {
                  flex-shrink: 0;
                  min-width: 25%; /* Consistent width for labels */
                  text-align: left; /* Align text to the right */
                  font-weight: bold;
                  color: #666;
                  font-size: 12px;
                }

                .form-item input[type="text"] {
                  flex-grow: 1; /* Input fills remaining space */
                  border-radius: 0 !important; /* Square edges */
                  border-width: 1px !important; /* Thicker border */
                  padding: 6px 10px;
                  border: 1px solid #ccc;
                  border-radius: 4px;
                  font-size: 12px;
                  box-sizing: border-box;
                }

                .form-item input[readonly] {
                  background-color: #e9e9e9;
                  cursor: not-allowed;
                }

                .td-form-item {
                  display: flex;
                  align-items: center;
                  padding-top: 0.5rem;
                  padding-left: 1rem;
                  padding-right: 1rem;
                  /*flex-basis: calc(50% - 3rem);  Half width for two columns per row */
                  /*min-width: 280px;  Minimum width for each column item */
                  /*gap: 8px; Space between label and its input */
                }

                .td-form-item label {
                  flex-shrink: 0;
                  width: 35%; /* Consistent width for labels */
                  text-align: left; /* Align text to the right */
                  font-weight: bold;
                  color: #666;
                  font-size: 12px;
                }

                .td-form-item input[type="text"] {
                  flex-grow: 1; /* Input fills remaining space */
                  border-radius: 0 !important; /* Square edges */
                  border-width: 1px !important; /* Thicker border */
                  padding: 6px 10px;
                  border: 1px solid #ccc;
                  border-radius: 4px;
                  font-size: 12px;
                  box-sizing: border-box;
                }

                .td-form-item input[readonly] {
                  background-color: #e9e9e9;
                  cursor: not-allowed;
                }

                /* STYLES FOR INLINED STATUS RADIO BUTTONS (matching image_e176fc.png) */
                .form-item.status-field {
                  /* Inherit flex-basis and min-width from .form-item */
                  /* Remove justify-content specific to status-field to use default flex behavior */
                }

                .status-field label {
                  flex-shrink: 0;
                  min-width: 110px; /* Consistent width as other labels */
                  text-align: right; /* Align to the right like other labels */
                  font-weight: normal; /* Keep as normal based on original request/screenshot */
                  color: #666; /* Consistent color */
                  font-size: 12px;
                  margin-right: 0; /* Remove specific margin, rely on parent gap */
                }

                .status-field .radio-group {
                  display: flex;
                  gap: 12px; /* Changed gap to 12px as requested */
                  flex-wrap: wrap;
                  align-items: center;
                  flex-grow: 1; /* Make it fill remaining space like an input */
                  justify-content: flex-start; /* Ensure items start from the left of their available space */
                }

                .status-field .radio-item {
                  display: flex;
                  align-items: center;
                  font-size: 12px; /* Consistent font size for radio button labels */
                }

                .status-field .radio-item input[type="radio"] {
                  margin-right: 5px;
                }

                .status-field .radio-item label {
                  font-weight: normal; /* Radio button labels are not bold */
                  color: #333; /* Consistent color for radio button labels */
                  cursor: pointer;
                }

                /* MODAL FOOTER */
                .modal-footer {
                  display: flex;
                  justify-content: flex-end;
                  padding: 15px;
                  border-top: 1px solid #eee;
                  margin-top: 15px;
                  gap: 8px;
                }

                .modal-footer button {
                  padding: 8px 18px;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 14px;
                  transition: background-color 0.3s ease;
                }

                .cancel-button {
                  background-color: #f0f0f0;
                  color: #555;
                }

                .cancel-button:hover {
                  background-color: #e0e0e0;
                }

                .save-button {
                  background-color: #4caf50;
                  color: white;
                }

                .save-button:hover {
                  background-color: #45a049;
                }

                /* Responsive adjustments for smaller screens */
                @media (max-width: 768px) {
                  .modal-content {
                    width: 95%;
                    padding: 12px;
                  }
                  .modal-body {
                    padding-right: 0; /* Remove scrollbar space on small screens */
                  }
                  .form-row {
                    flex-direction: column;
                    gap: 5px;
                  }
                  .form-item {
                    flex-basis: 100%;
                    justify-content: space-between;
                    min-width: unset; /* Allow items to take full width and wrap */
                    flex-wrap: wrap;
                  }
                  .form-item label {
                    text-align: left;
                    min-width: unset;
                    flex-basis: 40%;
                    font-size: 11px;
                  }
                  .form-item input {
                    flex-basis: 55%;
                    font-size: 11px;
                  }
                  .modal-header h2 {
                    font-size: 20px;
                  }
                  .section h3 {
                    font-size: 15px;
                  }
                  .status-field {
                    /* Adjust for stacked layout on mobile */
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px; /* Space between "Status" label and radio buttons when stacked */
                    flex-basis: 100%; /* Take full width on mobile */
                  }
                  .status-field label {
                    flex-basis: 40%;
                    /*margin-right: 0; /* No margin right when stacked vertically */
                  }
                  .status-field .radio-group {
                    flex-basis: 55%;
                    flex-direction: column; /* Stack radio buttons vertically */
                    gap: 8px;
                  }
                  .status-field label,
                  .radio-item label {
                    font-size: 11px;
                    margin-left: 5px;

                  }
                  .modal-footer button {
                    font-size: 13px;
                    padding: 6px 15px;
                  }
                }
                `}
      </style>
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="bg-black text-white p-4 rounded-t-lg flex justify-between items-center font-medium">
            {customerData ? <h2>Edit Customer</h2> : <h2>Add New Customer</h2>}
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>

          <div className="modal-body">
            <div className="section">
              <table style={{ width: "100%" }}>
                <tr>
                  <td colSpan="3">
                    <div
                      style={{
                        direction: "row",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h1 className="section-header">Customer Info</h1>
                      <button
                        className="bg-gray-300 text-gray-800 rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-400 transition-colors duration-200"
                        onClick={() => setShowAdditionalContactModal(true)}
                      >
                        Add Additional Contact
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="customer">Customer Name *</label>
                      <input
                        type="text"
                        id="customer"
                        value={formData.Customer}
                        style={{ pointerEvents: "none" }}
                        required
                      />
                    </div>
                  </td>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="escalationContact">
                        Escalation Contact Name
                      </label>
                      <input
                        type="text"
                        id="escalationContact"
                        value={formData.escalationContact}
                        onChange={handleInputChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="phone1">Phone 1*</label>
                      <input
                        type="text"
                        id="phone1"
                        value={formData.phone1}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="shortName">Short Name</label>
                      <input
                        type="text"
                        id="shortName"
                        value={formData.shortName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="escalationEmail">Escalation Email</label>
                      <input
                        type="text"
                        id="escalationEmail"
                        value={formData.escalationEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="phone2">Phone 2</label>
                      <input
                        type="text"
                        id="phone2"
                        value={formData.phone2}
                        onChange={handleInputChange}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="customerContactName">
                        Customer Contact Name*
                      </label>
                      <input
                        type="text"
                        id="customerContactName"
                        value={formData.customerContactName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </td>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="accountPayableName">
                        Account Payable Name
                      </label>
                      <input
                        type="text"
                        id="accountPayableName"
                        value={formData.accountPayableName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="email1">Email 1 *</label>
                      <input
                        type="text"
                        id="email1"
                        value={formData.email1}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="customerContactEmail">
                        Customer Contact Email *
                      </label>
                      <input
                        type="text"
                        id="customerContactEmail"
                        value={formData.customerContactEmail}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </td>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="accountPayableEmail">
                        Account Payable Email
                      </label>
                      <input
                        type="text"
                        id="accountPayableEmail"
                        value={formData.accountPayableEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="email2">Email 2</label>
                      <input
                        type="text"
                        id="email2"
                        value={formData.email2}
                        onChange={handleInputChange}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="territoryID">Territory ID</label>
                      <input
                        type="text"
                        id="territoryID"
                        value={formData.territoryID}
                        onChange={handleInputChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="classID">Class ID *</label>
                      <input
                        type="text"
                        id="classID"
                        value={formData.classID}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </td>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="paymentTerms">Payment Terms</label>
                      <input
                        type="text"
                        id="paymentTerms"
                        value={formData.paymentTerms}
                        onChange={handleInputChange}
                      />
                    </div>
                  </td>
                </tr>

                {/* New row for Phone 3, Phone 4, and Email 3 */}
                {/* <tr>
                  <td>
                    {formData.phone3 && (
                      <div className="td-form-item">
                        <label htmlFor="phone3">Phone 3</label>
                        <input
                          type="text"
                          id="phone3"
                          value={formData.phone3}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </td>
                  <td>
                    {formData.phone4 && (
                      <div className="td-form-item">
                        <label htmlFor="phone4">Phone 4</label>
                        <input
                          type="text"
                          id="phone4"
                          value={formData.phone4}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </td>
                  <td>
                    {formData.email3 && (
                      <div className="td-form-item">
                        <label htmlFor="email3">Email 3</label>
                        <input
                          type="text"
                          id="email3"
                          value={formData.email3}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </td>
                </tr> */}

                {/* Dynamically added phone/email fields for phone5 and beyond, and email4 and beyond */}
                {Object.keys(formData)
                  .filter(
                    (key) =>
                      (key.startsWith("phone") && parseInt(key.slice(5)) > 2) || // For phone5 and beyond
                      (key.startsWith("email") && parseInt(key.slice(5)) > 2) // For email4 and beyond
                  )
                  .reduce((acc, key, index) => {
                    // Group 3 items per row
                    if (index % 3 === 0) {
                      acc.push([]);
                    }
                    acc[acc.length - 1].push(
                      <td key={key}>
                        <div className="td-form-item">
                          <label htmlFor={key}>
                            {key.startsWith("phone") ? "Phone" : "Email"}{" "}
                            {key.slice(5)}
                          </label>
                          <input
                            type="text"
                            id={key}
                            value={formData[key]}
                            onChange={handleInputChange}
                          />
                        </div>
                      </td>
                    );
                    return acc;
                  }, [])
                  .map((rowCells, rowIndex) => (
                    <tr key={`dynamic-row-${rowIndex}`}>
                      {rowCells}
                      {/* Fill remaining cells in the row if less than 3 */}
                      {rowCells.length < 3 &&
                        [...Array(3 - rowCells.length)].map((_, i) => (
                          <td key={`empty-${rowIndex}-${i}`}></td>
                        ))}
                    </tr>
                  ))}
                <tr>
                  <td colSpan="3">
                    <h1
                      style={{ marginTop: "2rem" }}
                      className="section-header"
                    >
                      Address Info
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="attention">Attention</label>
                      <input
                        type="text"
                        id="attention"
                        value={formData.attention}
                        onChange={handleInputChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="streetAddress1">Street Address1 *</label>
                      <input
                        type="text"
                        id="streetAddress1"
                        value={formData.streetAddress1}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </td>

                  <td>
                    <div className="td-form-item">
                      <label htmlFor="streetAddress2">Street Address 2</label>
                      <input
                        type="text"
                        id="streetAddress2"
                        value={formData.streetAddress2}
                        onChange={handleInputChange}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="city">City *</label>
                      <input
                        type="text"
                        id="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </td>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="state">State *</label>
                      <input
                        type="text"
                        id="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </td>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="zip">ZIP *</label>
                      <input
                        type="text"
                        id="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="td-form-item">
                      <label htmlFor="country">Country</label>
                      <input
                        type="text"
                        id="country"
                        value={formData.country}
                        onChange={handleInputChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="td-form-item">
                      <label>Status</label>
                      <div
                        className="radio-group"
                        style={{ display: "contents" }}
                        id="status"
                      >
                        <div className="radio-item">
                          <input
                            type="radio"
                            id="statusHold"
                            name="status"
                            value="Hold"
                            checked={formData.status === "Hold"}
                            onChange={handleRadioChange}
                          />
                          <label htmlFor="statusHold">Hold</label>
                        </div>
                        <div className="radio-item">
                          <input
                            type="radio"
                            id="statusActive"
                            name="status"
                            value="Active"
                            checked={formData.status === "Active"}
                            onChange={handleRadioChange}
                          />
                          <label htmlFor="statusActive">Active</label>
                        </div>
                        <div className="radio-item">
                          <input
                            type="radio"
                            id="statusInactive"
                            name="status"
                            value="Inactive"
                            checked={formData.status === "Inactive"}
                            onChange={handleRadioChange}
                          />
                          <label htmlFor="statusInactive">Inactive</label>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td></td>
                </tr>
              </table>
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="bg-gray-300 text-gray-800 rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-400 transition-colors duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-black text-white rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-800 transition-colors duration-200"
              onClick={() => onSave(formData)}
            >
              {customerData ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
      {showAdditionalContactModal && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
          <div className="modal-content" style={{ maxWidth: 400, padding: 0 }}>
            <div className="bg-black text-white p-4 rounded-t-lg flex justify-between items-center font-medium">
              <h2>Add Additional Contact</h2>
              <button
                onClick={() => setShowAdditionalContactModal(false)}
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
            <div className="modal-body" style={{ padding: 20 }}>
              <div
                className="form-item"
                style={{
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: 16,
                }}
              >
                <label
                  htmlFor="additionalContactType"
                  style={{ fontWeight: "bold", color: "#666", fontSize: 13 }}
                >
                  Contact Type
                </label>
                <select
                  id="additionalContactType"
                  value={additionalContactType}
                  onChange={(e) => setAdditionalContactType(e.target.value)}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 0,
                    padding: "8px",
                    fontSize: 13,
                    fontFamily: "Segoe UI",
                    marginBottom: 10,
                  }}
                >
                  <option value="">Select type...</option>
                  {additionalContactOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <label
                  htmlFor="additionalContactValue"
                  style={{ fontWeight: "bold", color: "#666", fontSize: 13 }}
                >
                  Contact Value
                </label>
                <input
                  type="text"
                  id="additionalContactValue"
                  value={additionalContactValue}
                  onChange={(e) => setAdditionalContactValue(e.target.value)}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 0,
                    padding: "8px",
                    fontSize: 13,
                    fontFamily: "Segoe UI",
                  }}
                  placeholder={
                    additionalContactType.startsWith("phone")
                      ? "Enter phone number"
                      : "Enter email address"
                  }
                />
              </div>
            </div>
            <div
              className="modal-footer"
              style={{ justifyContent: "flex-end", padding: 12 }}
            >
              <button
                className="bg-gray-300 text-gray-800 rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-400 transition-colors duration-200"
                onClick={() => setShowAdditionalContactModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-black text-white rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-800 transition-colors duration-200"
                onClick={handleAddAdditionalContact}
                disabled={!additionalContactType || !additionalContactValue}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCustomer;
