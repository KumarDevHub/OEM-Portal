import React, { useState } from "react";

const AddCustomer = ({ onClose, onSave, customerData, id }) => {
  // State to hold all form data
  const [formData, setFormData] = useState(
    customerData || {
      customerId: id,
      contact: "", // to be removed once table updated
      email1: "",
      email2: "", // to be removed once table updated
      paymentTerms: "",
      Customer: "",
      phone1: "",
      company: "",
      phone2: "",
      shortName: "",
      shippingMethod: "",
      statementName: "",
      territoryID: "",
      classID: "",
      streetAddress1: "",
      state: "",
      streetAddress2: "",
      country: "",
      streetAddress3: "",
      zip: "",
      city: "",
      status: "Active", // Default status
    }
  );

  // Handle input changes for text fields
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
                    margin-left: 5px
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
                  max-width: 75vw;
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

                .form-item {
                  display: flex;
                  align-items: center;
                  flex-basis: calc(50% - 3rem); /* Half width for two columns per row */
                  min-width: 280px; /* Minimum width for each column item */
                  gap: 8px; /* Space between label and its input */
                }

                .form-item label {
                  flex-shrink: 0;
                  min-width: 20%; /* Consistent width for labels */
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
          <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
          {/* <div className="modal-header">
            {customerData ? <h2>Edit Customer</h2> : <h2>Add New Customer</h2>}
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </div> */}

          <div className="modal-body">
            <div className="section">
              <h1 className="section-header">Customer Info</h1>
              <div className="form-row">
                <div className="form-item">
                  <label htmlFor="customerId">Customer ID</label>
                  <input
                    type="text"
                    id="customerId"
                    value={formData.customerId}
                    readOnly
                    style={{ pointerEvents: "none" }}
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="phone 1">Phone 1</label>
                  <input
                    type="text"
                    id="phone 1"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-item">
                  <label htmlFor="Customer">Customer Name *</label>
                  <input
                    type="text"
                    id="Customer"
                    value={formData.Customer}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="phone">Phone 2</label>
                  <input
                    type="text"
                    id="phone 2"
                    value={formData.phone2}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-item">
                  <label htmlFor="shortName">Short Name</label>
                  <input
                    type="text"
                    id="shortName"
                    value={formData.shortName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="email 1">Email 1</label>
                  <input
                    type="text"
                    id="email 1"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-item">
                  <label htmlFor="statementName">Statement Name</label>
                  <input
                    type="text"
                    id="statementName"
                    value={formData.statementName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="email 2">Email 2</label>
                  <input
                    type="text"
                    id="email 2"
                    F
                    value={formData.email2}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-item">
                  <label htmlFor="classID">Class ID</label>
                  <input
                    type="text"
                    id="classID"
                    value={formData.classID}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="shippingMethod">Shipping Method</label>
                  <input
                    type="text"
                    id="shippingMethod"
                    value={formData.shippingMethod}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-item">
                  <label htmlFor="paymentTerms">Payment Terms</label>
                  <input
                    type="text"
                    id="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="territoryID">Territory ID</label>
                  <input
                    type="text"
                    id="territoryID"
                    value={formData.territoryID}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <h1 className="section-header">Address & Contact</h1>
              <div className="form-row">
                <div className="form-item">
                  <label htmlFor="streetAddress1">Street Address 1 *</label>
                  <input
                    type="text"
                    id="streetAddress1"
                    value={formData.streetAddress1}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-item">
                  <label htmlFor="streetAddress2">Street Address 2</label>
                  <input
                    type="text"
                    id="streetAddress2"
                    value={formData.streetAddress2}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="country">Country *</label>
                  <input
                    type="text"
                    id="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-item">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="zip">ZIP *</label>
                  <input
                    type="text"
                    id="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-item">
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
                <div className="form-item"></div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              // style={{ borderRadius: "40px" }}
              className="bg-gray-300 text-gray-800 rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-400 transition-colors duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              
              className="bg-black text-white rounded-md px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-800 transition-colors duration-200"
              // style={{ borderRadius: "40px", backgroundColor: "black" }}
              onClick={() => onSave(formData)}
            >
              {customerData ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCustomer;
