import React, { useState, useEffect } from "react";
import DesktopTable from "./DesktopTable";
import MobileTable from "./MobileTable";
import "./ResponsiveTable.css";

const ResponsiveTable = ({ data, columns, pagination, onSearch, onFilter }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if viewport is mobile width
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    // Check initially
    checkIfMobile();

    // Add listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className="responsive-table-container">
      {/* Common search and filter controls */}
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => onSearch(e.target.value)}
          className="search-input"
        />
        {/* Add your filter controls here */}
      </div>

      {/* Conditional rendering based on screen size */}
      {isMobile ? (
        <div className="mobile-table-wrapper">
          {/* Additional div on top for mobile view */}
          <div className="mobile-header">
            <h3>Data Table</h3>
            {/* Any additional mobile-specific controls */}
          </div>
          <MobileTable data={data} columns={columns} pagination={pagination} />
        </div>
      ) : (
        <DesktopTable data={data} columns={columns} pagination={pagination} />
      )}

      {/* Pagination controls */}
      <div className="pagination-controls">
        <button
          onClick={() => pagination.prev()}
          disabled={pagination.currentPage === 1}
        >
          Poprzednie
        </button>
        <span>
          Strona {pagination.currentPage} z {pagination.totalPages}
        </span>
        <button
          onClick={() => pagination.next()}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Następne
        </button>
      </div>
    </div>
  );
};

export default ResponsiveTable;
