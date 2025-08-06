import React, { useState, useContext, useEffect } from "react";
import ResultContext from "../../Context/Resultcontext/ResultContext";
const TestHistory = () => {
  const { getMyResults, results } = useContext(ResultContext);
  const [search, setSearch] = useState("");
  useEffect(() => {
    getMyResults();
    // eslint-disable-next-line
  }, []);
  const filteredResults = results.filter(
    (test) =>
      test.title.toLowerCase().includes(search.toLowerCase()) ||
      test.quizId.toLowerCase().includes(search.toLowerCase())
  );
  const token = localStorage.getItem("token");

  // 🔒 Unauthorized access
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-100">
        <h2 className="text-2xl font-bold text-red-600">Unauthorized Access</h2>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-purple-100 p-6">
      <div className="flex justify-between mt-14 items-center max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Your Test History</h1>
        <input
          type="text"
          placeholder="Search by ID or Title"
          className="px-4 py-2 border border-gray-300 rounded-3xl shadow-sm w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredResults.length === 0 ? (
        <p className="text-center text-gray-600 text-lg font-medium mt-16">
          You have not taken any quiz yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredResults.map((test) => {
            const percentage = test.percentage;
            return (
              <div
                key={test.id}
                className="rounded-2xl shadow-md p-6 bg-purple-50 hover:shadow-lg transition relative"
              >
                {/* ID at top-right */}
                <div className="absolute top-4 right-4 text-xs text-gray-500 font-medium">
                  ID: {test.quizId}
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold mt-4 text-gray-800 mb-2">
                  {test.title}
                </h2>

                {/* Details */}
                <div className="text-gray-700 mt-4 space-y-1">
                  <p>
                    <strong>Score:</strong> {test.score}
                  </p>
                  <p>
                    <strong>Percentage:</strong> {percentage}
                  </p>
                  <p className="flex items-center">
                    <strong className="mr-1">Stars Earned:</strong>
                    {"⭐"}
                    <span className="ml-2 text-sm text-gray-500">
                      {test.stars}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TestHistory;
