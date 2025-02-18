import { useState, useEffect } from "react";
import axios from "axios";

const useMachineListTable = () => {
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [data, setData] = useState([]); // Holds fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const itemsPerPage = 6; // Items per page
  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem("authToken");
  const roleName = localStorage.getItem("roleName"); // Get role from localStorage

  // Define API URL based on role
  const apiUrl =
    roleName === "ROLE_OWNER"
      ? `${API_HOST}/api/machines/owner/current`
      : `${API_HOST}/api/machines`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before request
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        });
        setData(response.data); // Update data after fetching
      } catch (err) {
        // Set error with detailed message if available
        setError(
          err.response ? err.response.data.message : "Failed to fetch data"
        );
      } finally {
        setLoading(false); // Set loading to false after request
      }
    };

    fetchData();
  }, [apiUrl, token]); // Dependency array includes apiUrl to trigger refetching on role change

  // Calculate the current items based on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  // Total number of pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Handler for page change
  const handlePageChange = (page) => setCurrentPage(page);

  return {
    data,
    currentItems,
    currentPage,
    totalPages,
    loading,
    error,
    handlePageChange,
  };
};

export default useMachineListTable;
