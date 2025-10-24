import React from "react";
import { useParams, Link } from "react-router-dom";
import { useLab } from "../../context/LabContext";
import { LabOverview } from "../../components/lab/LabOverview/LabOverview";
import { LabTests } from "../../components/lab/LabTests/LabTests";
import { ArrowLeft } from "lucide-react";

export default function AdminLabDetailPage() {
  const { labId } = useParams();
  const { labs } = useLab();
  const lab = labs.find((l) => l.id === labId);

    if (!lab) return <p className="text-white p-6">Lab not found</p>;
  console.log(labId)
  return (
    <div className="min-h-screen  text-gray-600 p-6 space-y-6">
      <Link to="/lab" className="text-cyan-300 flex items-center gap-1 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Labs
      </Link>
      <h1 className="text-3xl font-bold text-cyan-300 mb-4">{lab.name}</h1>

      <div className="space-y-6">
        <LabOverview lab={lab} />
        <LabTests tests={lab.tests} />
      </div>
    </div>
  );
}
