import React from "react";
import { useLab } from "../../../context/LabContext";
import { Eye, FlaskRound } from "lucide-react";
import { Card } from "../../../ui/Card";

export const LabTestList = ({ tests = [], onSelect }) => {
  return (
    <Card title="Conducted Tests">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-300 border-b border-gray-700">
            <th className="py-2">Test Name</th>
            <th>Conducted By</th>
            <th>Result</th>
            <th>Cost</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tests.length > 0 ? (
            tests.map((t) => (
              <tr key={t.id} className="border-b border-gray-700">
                <td>{t.name}</td>
                <td>{t.conductedBy}</td>
                <td>{t.result}</td>
                <td>₹{t.cost}</td>
                <td>
                  <button
                    onClick={() => onSelect?.(t)}
                    className="text-cyan-400 hover:text-cyan-200"
                  >
                    <Eye className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center text-gray-400 py-4">
                No tests available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
};
