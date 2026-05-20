import PPMSDashboard from "./PPMSDashboard";

function AdminDashboard() {
  return (
    <div>

      {/* Existing dashboard */}
      <PPMSDashboard isAdmin={true} />
    </div>
  );
}

export default AdminDashboard;