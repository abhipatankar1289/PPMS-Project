import PPMSDashboard from "./PPMSDashboard";

function AdminDashboard() {
  return (
    <div>
      <PPMSDashboard isAdmin={true} />
    </div>
  );
}

export default AdminDashboard;