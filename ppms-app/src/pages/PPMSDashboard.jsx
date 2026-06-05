import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BACKEND_URL}/api`;

// Simple reusable modal component used across the dashboard
function Modal({ title, onSave, onCancel, children }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{title}</h2>
        <div className="form-grid">{children}</div>
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={onSave}>Save</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function EditPickerModal({ type, title, items = [], selectedItem, onSelectItem, onConfirm, onDelete, onCancel, getLabel, getSubLabel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: "500px" }}>
        <h2>Select {title}</h2>
        <p style={{ color: "#666", fontSize: "13px", marginBottom: "12px" }}>
          Click an item to select it, then choose an action below.
        </p>
        <div style={{ maxHeight: "350px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "6px" }}>
          {items.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>No items found in database.</div>
          ) : (
            items.map((item, idx) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={idx}
                  onClick={() => onSelectItem(item)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                    background: isSelected ? "#e3f2fd" : idx % 2 === 0 ? "#fafafa" : "#fff",
                    borderLeft: isSelected ? "4px solid #1976d2" : "4px solid transparent",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontWeight: isSelected ? "bold" : "normal", color: isSelected ? "#1976d2" : "#333" }}>
                    {getLabel ? getLabel(item) : (item.name || item.model || item.service_name)}
                  </div>
                  {getSubLabel && (
                    <div style={{ fontSize: "12px", color: "#888", marginTop: "3px" }}>
                      {getSubLabel(item)}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div style={{ borderTop: "1px solid #e0e0e0", marginTop: "16px", paddingTop: "14px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={onConfirm}
            disabled={!selectedItem}
            style={{
              background: selectedItem ? "#1976d2" : "#477bca",
              color: "white", border: "none", padding: "10px 18px",
              borderRadius: "5px", cursor: selectedItem ? "pointer" : "not-allowed",
              fontWeight: "600",
            }}
          >
            ✏️ Edit Selected
          </button>

          <button
            onClick={onDelete}
            disabled={!selectedItem}
            style={{
              background: selectedItem ? "#d32f2f" : "#be5151",
              color: "white", border: "none", padding: "10px 18px",
              borderRadius: "5px", cursor: selectedItem ? "pointer" : "not-allowed",
              fontWeight: "600",
            }}
          >
            🗑️ Delete Selected
          </button>

          <button
            onClick={onCancel}
            style={{
              background: "#4f8ce7", color: "#fdfeff", border: "1px solid #020913",
              padding: "10px 18px", borderRadius: "5px", cursor: "pointer",
              fontWeight: "600", marginLeft: "auto",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PPMSDashboard({ isAdmin = false }) {

  /* ======== Processor State ========== */
  const [showProcessorForm, setShowProcessorForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [processorForm, setProcessorForm] = useState({
    id: null, manufacturer: "", model: "", architecture: "",
    cpus_per_node: "", cores_per_cpu: "", total_cores: "",
    base_ghz: "", l3Cache: "", memoryType: "", pcie_gen: "",
    tdp_watt: "", price: "", rpeak: "", FLOPSPerCycle: "",
  });

  /* ============== Memory State ============= */
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [isMemoryEditMode, setIsMemoryEditMode] = useState(false);
  const [memoryForm, setMemoryForm] = useState({
    id: null, memory_type: "", module_capacity_gb: "",
    memory_speed_mts: "", memory_channels: "", dimms_per_channel: "",
    total_memory_per_node_gb: "", price: "",
  });

  /* ================= GPU State ================= */
  const [showGpuForm, setShowGpuForm] = useState(false);
  const [isGpuEditMode, setIsGpuEditMode] = useState(false);
  const [gpuForm, setGpuForm] = useState({
    id: null, name: "", component_category: "", architecture: "",
    gpusPerNode: "", fp64: "", gpuMemory: "", interconnect: "",
    rpeak: "", manufacturer: "", price: "",
  });

  /* =============== Interconnect State =============== */
  const [showInterconnectForm, setShowInterconnectForm] = useState(false);
  const [isInterconnectEditMode, setIsInterconnectEditMode] = useState(false);
  const [interconnectForm, setInterconnectForm] = useState({
    id: null, product_name: "", technology: "", port_speed_gbps: "",
    number_of_ports: "", aggregate_bandwidth_tbps: "", latency_ns: "",
    vendor: "", price: "",
  });

  /* =============== KVM Switch State =============== */
  const [showKvmForm, setShowKvmForm] = useState(false);
  const [isKvmEditMode, setIsKvmEditMode] = useState(false);
  const [kvmForm, setKvmForm] = useState({
    id: null, name: "", specification: "", ports: "", formFactor: "", price: "",
  });

  /* =============== PFS Storage State =============== */
  const [showPfsForm, setShowPfsForm] = useState(false);
  const [isPfsEditMode, setIsPfsEditMode] = useState(false);
  const [pfsForm, setPfsForm] = useState({
    id: null, name: "", total_capacity_pb: "", manufacturer: "",
    software_model: "", price: "",
  });

  /* =============== Secondary Interconnect State =============== */
  const [showSecondaryForm, setShowSecondaryForm] = useState(false);
  const [isSecondaryEditMode, setIsSecondaryEditMode] = useState(false);
  const [secondaryForm, setSecondaryForm] = useState({
    id: null, component_category: "", vendor: "", product_name: "",
    technology: "", port_speed_gbps: "", number_of_ports: "",
    typical_use: "", price: "",
  });

  /* =============== Management Network State =============== */
  const [showMgmtForm, setShowMgmtForm] = useState(false);
  const [isMgmtEditMode, setIsMgmtEditMode] = useState(false);
  const [mgmtForm, setMgmtForm] = useState({
    id: null, component_category: "", vendor: "", technology: "",
    product_name: "", port_speed_gbps: "", number_of_ports: "",
    use: "", price: "",
  });

  /* =============== OCP Rack State =============== */
  const [showOcpForm, setShowOcpForm] = useState(false);
  const [isOcpEditMode, setIsOcpEditMode] = useState(false);
  const [ocpForm, setOcpForm] = useState({ id: null, name: "", price: "" });

  /* =============== Standard Rack State =============== */
  const [showRackForm, setShowRackForm] = useState(false);
  const [isRackEditMode, setIsRackEditMode] = useState(false);
  const [rackForm, setRackForm] = useState({ id: null, name: "", price: "" });

  /* =============== Table B – Software Service State =============== */
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [isServiceEditMode, setIsServiceEditMode] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    id: null, service_name: "", unit: "", price: "",
  });

  /* =============== Table C – Workshop / Add-on Service State =============== */
  const [showWorkshopForm, setShowWorkshopForm] = useState(false);
  const [isWorkshopEditMode, setIsWorkshopEditMode] = useState(false);
  const [workshopForm, setWorkshopForm] = useState({
    id: null, service_name: "", unit: "", price: "",
  });

  /* ===============================================================
     EDIT PICKER STATE
  =============================================================== */
  const [editPicker, setEditPicker] = useState(null);
  const [editPickerSelected, setEditPickerSelected] = useState(null);

  /* ================= DATABASE DROPDOWN DATA ================= */
  const [processors, setProcessors] = useState([]);
  const [memoryList, setMemoryList] = useState([]);
  const [interconnects, setInterconnects] = useState([]);
  const [gpuOptions, setGpuOptions] = useState([]);
  const [simpleDropdownComponents, setSimpleDropdownComponents] = useState([]);
  const [usdRate, setUsdRate] = useState(90);

  /* ================= TABLE B & C PRICE MAPS + RAW LISTS ================= */
  const [serviceList, setServiceList] = useState([]);   // raw list for picker
  const [workshopList, setWorkshopList] = useState([]); // raw list for picker

  /* ================= FETCH DATA WITH POLLING ================= */
  const fetchData = async () => {
    try {
      console.log(`[API] Fetching from: ${BASE_URL}`);
      const results = await Promise.allSettled([
        axios.get(`${BASE_URL}/processor`),
        axios.get(`${BASE_URL}/memory`),
        axios.get(`${BASE_URL}/interconnect`),
        axios.get(`${BASE_URL}/gpu`),
        axios.get(`${BASE_URL}/kvm`),
        axios.get(`${BASE_URL}/pfs`),
        axios.get(`${BASE_URL}/secondary-interconnect`),
        axios.get(`${BASE_URL}/management-network`),
        axios.get(`${BASE_URL}/ocp-rack`),
        axios.get(`${BASE_URL}/standard-rack`),
        axios.get(`${BASE_URL}/software-service`),
        axios.get(`${BASE_URL}/addon_service`),
        axios.get(`${BASE_URL}/currency`),
      ]);

      const getData = (index) => {
        if (results[index].status === "fulfilled") {
          return results[index].value.data;
        } else if (results[index].status === "rejected") {
          console.error(`[API Error at index ${index}]:`, results[index].reason?.message || results[index].reason);
        }
        return [];
      };

      const p = getData(0); const m = getData(1); const i = getData(2);
      const g = getData(3); const kvm = getData(4); const pfs = getData(5);
      const secondary = getData(6); const management = getData(7);
      const ocp = getData(8); const rack = getData(9);
      const services = getData(10); const workshop = getData(11);
      const currency = getData(12);

      setProcessors(p || []);
      setMemoryList(m || []);
      setInterconnects(i || []);
      setGpuOptions((g || []).filter((item) => item.name !== null));

      console.log(`[API] Data loaded - Processors: ${p?.length || 0}, Memory: ${m?.length || 0}, Services: ${services?.length || 0}, Workshops: ${workshop?.length || 0}`);

      if (currency && currency.length > 0) {
        const rateObj = currency.find((c) => c.currency_name === "USD");
        if (rateObj) setUsdRate(rateObj.value);
      }

      const simpleComponents = [
        {
          name: "KVM Switch", options: kvm || [], apiKey: "kvm",
          getHover: (o) => `Spec: ${o.specification}\nPorts: ${o.ports}\nForm Factor: ${o.formFactor}`,
          pickerType: "kvm",
          getLabel: (o) => o.name,
        },
        {
          name: "PFS Storage", options: pfs || [], apiKey: "pfs",
          getHover: (o) => `Capacity: ${o.total_capacity_pb} PB\nSoftware Model: ${o.software_model}\nManufacturer: ${o.manufacturer}`,
          pickerType: "pfs",
          getLabel: (o) => o.name,
        },
        {
          name: "Secondary Interconnect", options: secondary || [], apiKey: "secondary-interconnect",
          getHover: (o) => `Vendor: ${o.vendor}\nProduct: ${o.product_name}\nSpeed: ${o.port_speed_gbps}Gbps\nPorts: ${o.number_of_ports}\nTech: ${o.technology}`,
          pickerType: "secondary",
          getLabel: (o) => o.product_name,
        },
        {
          name: "Management Network", options: management || [], apiKey: "management-network",
          getHover: (o) => `Vendor: ${o.vendor}\nProduct: ${o.product_name}\nTech: ${o.technology}\nSpeed: ${o.port_speed_gbps}Gbps\nPorts: ${o.number_of_ports}`,
          pickerType: "mgmt",
          getLabel: (o) => o.product_name,
        },
        {
          name: "OCP Rack", options: ocp || [], apiKey: "ocp-rack", getHover: null,
          pickerType: "ocp",
          getLabel: (o) => o.name,
        },
        {
          name: "Standard Rack", options: rack || [], apiKey: "standard-rack", getHover: null,
          pickerType: "rack",
          getLabel: (o) => o.name,
        },
      ];
      setSimpleDropdownComponents(simpleComponents);
      setSimpleState((prev) => {
        if (prev.length === simpleComponents.length) return prev;
        const next = prev.slice(0, simpleComponents.length);
        for (let i = next.length; i < simpleComponents.length; i++) {
          next.push({ selected: null, qty: 1 });
        }
        return next;
      });

      // Store raw lists for pickers
      setServiceList(services || []);
      setWorkshopList(workshop || []);
    } catch (err) {
      console.error("Polling API Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const pollingInterval = setInterval(() => { fetchData(); }, 5000);
    return () => clearInterval(pollingInterval);
  }, []);

  /* ================= NODE STATE ================= */
  const nodeTemplate = {
    processor: null, memory: null, interconnect: null,
    gpu: null, qty: 1, configured: false,
  };

  const [nodes, setNodes] = useState({
    master: { ...nodeTemplate }, compute: { ...nodeTemplate },
    hm: { ...nodeTemplate }, gpuNode: { ...nodeTemplate },
  });

  const [activeNode, setActiveNode] = useState(null);
  const [simpleState, setSimpleState] = useState([]);

  /* ================= CALCULATIONS ================= */
  const calculateNodeCost = (node) => {
    if (!node.configured) return 0;
    return (
      ((node.processor?.price || 0) + (node.memory?.price || 0) +
        (node.interconnect?.price || 0) + (node.gpu?.price || 0)) * node.qty
    );
  };

  const calculateSimpleCost = () =>
    simpleState.reduce((sum, state) => sum + (state?.selected?.price || 0) * state.qty, 0);

  const hardwareTotal_INR =
    calculateNodeCost(nodes.master) + calculateNodeCost(nodes.compute) +
    calculateNodeCost(nodes.hm) + calculateNodeCost(nodes.gpuNode) +
    calculateSimpleCost();

  /* ================= TABLE B & C QTY MAPS ================= */
  // tableB and tableC rows are derived live from serviceList / workshopList.
  // We only store the user-editable qty per item id so new DB entries appear immediately.
  const [tableBQty, setTableBQty] = useState({});  // { [id]: qty }
  const [tableCQty, setTableCQty] = useState({});  // { [id]: qty }

  // Derived rows — always in sync with the latest fetch
  const tableB = serviceList.map((s) => ({
    id: s.id,
    name: s.service_name,
    price: s.price || 0,
    unit: s.unit || s.unit_type || s.service_unit || "",
    qty: tableBQty[s.id] ?? 1,
  }));

  const tableC = workshopList.map((w) => ({
    id: w.id,
    name: w.service_name,
    unit: w.unit || w.unit_type || w.service_unit || "",
    price: w.price || 0,
    qty: tableCQty[w.id] ?? 1,
  }));

  const totalB_INR = tableB.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalC_INR = tableC.reduce((sum, item) => sum + item.price * item.qty, 0);
  const grandTotal_INR = hardwareTotal_INR + totalB_INR + totalC_INR;
  const grandTotal_USD = Math.round(grandTotal_INR / usdRate);

  /* ================= RPEAK LOGIC ================= */
  const getDynamicRpeakData = () => {
    const categories = [
      { id: "master", label: "Master/Service Nodes/Login" },
      { id: "compute", label: "Compute Node" },
      { id: "hm", label: "High Memory Node" },
      { id: "gpuNode", label: "GPU Node" },
    ];
    return categories.map((cat) => {
      const node = nodes[cat.id];
      const p = node.processor; const g = node.gpu;
      let cpuRpeakVal = 0; let gpuRpeakVal = 0;
      let formulaText = "Select Processor";
      if (p) {
        const base = p.base_ghz || 0; const cores = p.cores_per_cpu || 0;
        const fpc = p.FLOPSPerCycle || 0; const cpucount = p.cpus_per_node || 1;
        cpuRpeakVal = (base * cores * fpc * cpucount) / 1000;
        formulaText = `CPU: (${base} * ${cores} * ${fpc} * ${cpucount}) / 1000 = ${cpuRpeakVal.toFixed(2)} TF`;
      }
      if (g) {
        const fp64 = g.fp64 || 0; const gpuCount = g.gpusPerNode || 1;
        gpuRpeakVal = fp64 * gpuCount;
        const gpuFormula = `<br />GPU: (${fp64} * ${gpuCount}) = ${gpuRpeakVal.toFixed(2)} TF`;
        formulaText = p ? formulaText + gpuFormula : gpuFormula;
      }
      return { label: cat.label, qty: node.qty, val: cpuRpeakVal + gpuRpeakVal, formula: formulaText };
    });
  };
  const dynamicRpeak = getDynamicRpeakData();

  /* ================= NODE SAVE HANDLER ================= */
  const handleSave = () => {
    const node = nodes[activeNode];
    const isGpuNode = activeNode === "gpuNode";
    if (node.processor && node.memory && node.interconnect && (!isGpuNode || node.gpu)) {
      setNodes((prev) => ({ ...prev, [activeNode]: { ...node, configured: true } }));
      setActiveNode(null);
    } else {
      alert("Please complete selections for: Processor, Memory, Interconnect" + (isGpuNode ? " and GPU" : ""));
    }
  };

  /* ================= DELETE FROM PICKER ================= */
  const pickerApiKeyMap = {
    processor: "processor", memory: "memory", gpu: "gpu",
    interconnect: "interconnect", kvm: "kvm", pfs: "pfs",
    secondary: "secondary-interconnect", mgmt: "management-network",
    ocp: "ocp-rack", rack: "standard-rack",
    service: "software-service", workshop: "addon_service",
  };

  const handlePickerDelete = async () => {
    if (!editPickerSelected) { alert("Please select an item to delete"); return; }
    const item = editPickerSelected;
    const apiKey = pickerApiKeyMap[editPicker];
    const label = item.model || item.name || item.product_name || item.memory_type || item.service_name || "this item";
    const confirmed = window.confirm(`Do you want to Delete "${label}"?\n`);
    if (!confirmed) return;
    try {
      await axios.delete(`${BASE_URL}/${apiKey}/${item.id}`);
      alert(`"${label}" deleted successfully`);
      closeEditPicker();
      fetchData();
    } catch (err) {
      console.error(err);
      alert(`Error deleting "${label}". It may be in use.`);
    }
  };

  const openEditPicker = (type) => {
    setEditPickerSelected(null);
    setEditPicker(type);
  };

  const closeEditPicker = () => {
    setEditPicker(null);
    setEditPickerSelected(null);
  };

  /* ================= EDIT PICKER CONFIRM ================= */
  const handlePickerConfirm = () => {
    if (!editPickerSelected) { alert("Please select an item to edit"); return; }
    const item = editPickerSelected;

    if (editPicker === "processor") {
      setProcessorForm({
        id: item.id, manufacturer: item.manufacturer || "", model: item.model || "",
        architecture: item.architecture || "", cpus_per_node: item.cpus_per_node || "",
        cores_per_cpu: item.cores_per_cpu || "", total_cores: item.total_cores || "",
        base_ghz: item.base_ghz || "", l3Cache: item.l3Cache || "",
        memoryType: item.memoryType || "", pcie_gen: item.pcie_gen || "",
        tdp_watt: item.tdp_watt || "", price: item.price || "",
        rpeak: item.rpeak || "", FLOPSPerCycle: item.FLOPSPerCycle || "",
      });
      setIsEditMode(true);
      setShowProcessorForm(true);
    } else if (editPicker === "memory") {
      setMemoryForm({
        id: item.id, memory_type: item.memory_type || "",
        component_category: item.component_category || "",
        module_capacity_gb: item.module_capacity_gb || "",
        memory_speed_mts: item.memory_speed_mts || "",
        memory_channels: item.memory_channels || "",
        dimms_per_channel: item.dimms_per_channel || "",
        total_memory_per_node_gb: item.total_memory_per_node_gb || "",
        price: item.price || "",
      });
      setIsMemoryEditMode(true);
      setShowMemoryForm(true);
    } else if (editPicker === "gpu") {
      setGpuForm({
        id: item.id, name: item.name || "", component_category: item.component_category || "",
        architecture: item.architecture || "", gpusPerNode: item.gpusPerNode || "",
        fp64: item.fp64 || "", gpuMemory: item.gpuMemory || "",
        interconnect: item.interconnect || "", rpeak: item.rpeak || "",
        manufacturer: item.manufacturer || "", price: item.price || "",
      });
      setIsGpuEditMode(true);
      setShowGpuForm(true);
    } else if (editPicker === "interconnect") {
      setInterconnectForm({
        id: item.id, product_name: item.product_name || "",
        component_category: item.component_category || "",
        technology: item.technology || "", port_speed_gbps: item.port_speed_gbps || "",
        number_of_ports: item.number_of_ports || "",
        aggregate_bandwidth_tbps: item.aggregate_bandwidth_tbps || "",
        latency_ns: item.latency_ns || "", vendor: item.vendor || "",
        price: item.price || "",
      });
      setIsInterconnectEditMode(true);
      setShowInterconnectForm(true);
    } else if (editPicker === "kvm") {
      setKvmForm({
        id: item.id, name: item.name || "", specification: item.specification || "",
        ports: item.ports || "", formFactor: item.formFactor || "", price: item.price || "",
      });
      setIsKvmEditMode(true);
      setShowKvmForm(true);
    } else if (editPicker === "pfs") {
      setPfsForm({
        id: item.id, name: item.name || "", total_capacity_pb: item.total_capacity_pb || "",
        manufacturer: item.manufacturer || "", software_model: item.software_model || "",
        price: item.price || "",
      });
      setIsPfsEditMode(true);
      setShowPfsForm(true);
    } else if (editPicker === "secondary") {
      setSecondaryForm({
        id: item.id, component_category: item.component_category || "",
        vendor: item.vendor || "", product_name: item.product_name || "",
        technology: item.technology || "", port_speed_gbps: item.port_speed_gbps || "",
        number_of_ports: item.number_of_ports || "", typical_use: item.typical_use || "",
        price: item.price || "",
      });
      setIsSecondaryEditMode(true);
      setShowSecondaryForm(true);
    } else if (editPicker === "mgmt") {
      setMgmtForm({
        id: item.id, component_category: item.component_category || "",
        vendor: item.vendor || "", technology: item.technology || "",
        product_name: item.product_name || "", port_speed_gbps: item.port_speed_gbps || "",
        number_of_ports: item.number_of_ports || "", use: item.use || "",
        price: item.price || "",
      });
      setIsMgmtEditMode(true);
      setShowMgmtForm(true);
    } else if (editPicker === "ocp") {
      setOcpForm({ id: item.id, name: item.name || "", price: item.price || "" });
      setIsOcpEditMode(true);
      setShowOcpForm(true);
    } else if (editPicker === "rack") {
      setRackForm({ id: item.id, name: item.name || "", price: item.price || "" });
      setIsRackEditMode(true);
      setShowRackForm(true);
    }
    /* ---- TABLE B: Software Service ---- */
    else if (editPicker === "service") {
      setServiceForm({
        id: item.id,
        service_name: item.service_name || "",
        unit: item.unit || "",
        price: item.price || "",
      });
      setIsServiceEditMode(true);
      setShowServiceForm(true);
    }
    /* ---- TABLE C: Workshop / Add-on Service ---- */
    else if (editPicker === "workshop") {
      setWorkshopForm({
        id: item.id,
        service_name: item.service_name || "",
        unit: item.unit || "",
        price: item.price || "",
      });
      setIsWorkshopEditMode(true);
      setShowWorkshopForm(true);
    }

    closeEditPicker();
  };

  /* ================= PROCESSOR CRUD ================= */
  const saveProcessor = async () => {
    const { manufacturer, model, architecture, cpus_per_node, cores_per_cpu, total_cores, base_ghz, l3Cache, memoryType, pcie_gen, tdp_watt, price, rpeak, FLOPSPerCycle } = processorForm;
    if (!manufacturer || !model || !architecture || !cpus_per_node || !cores_per_cpu || !total_cores || !base_ghz || !l3Cache || !memoryType || !pcie_gen || !tdp_watt || !price || !rpeak || !FLOPSPerCycle) {
      alert("Please fill all fields before saving."); return;
    }
    try {
      if (isEditMode) {
        await axios.put(`${BASE_URL}/processor/${processorForm.id}`, processorForm);
        alert("Processor Updated Successfully");
      } else {
        await axios.post(`${BASE_URL}/processor`, processorForm);
        alert("Processor Added Successfully");
      }
      fetchData(); setShowProcessorForm(false); resetProcessorForm();
    } catch (err) { console.error(err); alert("Error Saving Processor"); }
  };
  const resetProcessorForm = () => {
    setProcessorForm({ id: null, manufacturer: "", model: "", architecture: "", cpus_per_node: "", cores_per_cpu: "", total_cores: "", base_ghz: "", l3Cache: "", memoryType: "", tdp_watt: "", price: "", rpeak: "", FLOPSPerCycle: "" });
    setIsEditMode(false);
  };

  /* ================= MEMORY CRUD ================= */
  const saveMemory = async () => {
    const { memory_type, module_capacity_gb, memory_speed_mts, memory_channels, total_memory_per_node_gb, price } = memoryForm;
    if (!memory_type || !module_capacity_gb || !memory_speed_mts || !memory_channels || !total_memory_per_node_gb || !price) {
      alert("Please fill all fields before saving."); return;
    }
    try {
      if (isMemoryEditMode) {
        await axios.put(`${BASE_URL}/memory/${memoryForm.id}`, memoryForm);
        alert("Memory Updated Successfully");
      } else {
        await axios.post(`${BASE_URL}/memory`, memoryForm);
        alert("Memory Added Successfully");
      }
      fetchData(); setShowMemoryForm(false); resetMemoryForm();
    } catch (err) { console.error(err); alert("Error Saving Memory"); }
  };
  const resetMemoryForm = () => {
    setMemoryForm({ id: null, memory_type: "", module_capacity_gb: "", memory_speed_mts: "", memory_channels: "", dimms_per_channel: "", total_memory_per_node_gb: "", price: "" });
    setIsMemoryEditMode(false);
  };

  /* ================= GPU CRUD ================= */
  const saveGpu = async () => {
    const { name, component_category, architecture, gpusPerNode, fp64, gpuMemory, interconnect, rpeak, manufacturer, price } = gpuForm;
    if (!name || !component_category || !architecture || !gpusPerNode || !fp64 || !gpuMemory || !interconnect || !rpeak || !manufacturer || !price) {
      alert("Please fill all fields before saving."); return;
    }
    try {
      if (isGpuEditMode) {
        await axios.put(`${BASE_URL}/gpu/${gpuForm.id}`, gpuForm);
        alert("GPU Updated Successfully");
      } else {
        await axios.post(`${BASE_URL}/gpu`, gpuForm);
        alert("GPU Added Successfully");
      }
      fetchData(); setShowGpuForm(false); resetGpuForm();
    } catch (err) { console.error(err); alert("Error Saving GPU"); }
  };
  const resetGpuForm = () => {
    setGpuForm({ id: null, name: "", component_category: "", architecture: "", gpusPerNode: "", fp64: "", gpuMemory: "", interconnect: "", rpeak: "", manufacturer: "", price: "" });
    setIsGpuEditMode(false);
  };

  /* ================= INTERCONNECT CRUD ================= */
  const saveInterconnect = async () => {
    const { product_name, technology, port_speed_gbps, number_of_ports, aggregate_bandwidth_tbps, latency_ns, vendor, price } = interconnectForm;
    if (!product_name || !technology || !port_speed_gbps || !number_of_ports || !aggregate_bandwidth_tbps || !latency_ns || !vendor || !price) {
      alert("Please fill all fields before saving."); return;
    }
    try {
      if (isInterconnectEditMode) {
        await axios.put(`${BASE_URL}/interconnect/${interconnectForm.id}`, interconnectForm);
        alert("Interconnect Updated Successfully");
      } else {
        await axios.post(`${BASE_URL}/interconnect`, interconnectForm);
        alert("Interconnect Added Successfully");
      }
      fetchData(); setShowInterconnectForm(false); resetInterconnectForm();
    } catch (err) { console.error(err); alert("Error Saving Interconnect"); }
  };
  const resetInterconnectForm = () => {
    setInterconnectForm({ id: null, product_name: "", technology: "", port_speed_gbps: "", number_of_ports: "", aggregate_bandwidth_tbps: "", latency_ns: "", vendor: "", price: "" });
    setIsInterconnectEditMode(false);
  };

  /* ================= KVM SWITCH CRUD ================= */
  const saveKvm = async () => {
    const { name, specification, ports, formFactor, price } = kvmForm;
    if (!name || !specification || !ports || !formFactor || !price) {
      alert("Please fill all fields before saving."); return;
    }
    try {
      if (isKvmEditMode) {
        await axios.put(`${BASE_URL}/kvm/${kvmForm.id}`, kvmForm);
        alert("KVM Switch Updated Successfully");
      } else {
        await axios.post(`${BASE_URL}/kvm`, kvmForm);
        alert("KVM Switch Added Successfully");
      }
      fetchData(); setShowKvmForm(false); resetKvmForm();
    } catch (err) { console.error(err); alert("Error Saving KVM Switch"); }
  };
  const resetKvmForm = () => {
    setKvmForm({ id: null, name: "", specification: "", ports: "", formFactor: "", price: "" });
    setIsKvmEditMode(false);
  };

  /* ================= PFS STORAGE CRUD ================= */
  const savePfs = async () => {
    const { name, total_capacity_pb, manufacturer, software_model, price } = pfsForm;
    if (!name || !total_capacity_pb || !manufacturer || !software_model || !price) {
      alert("Please fill all fields before saving."); return;
    }
    try {
      if (isPfsEditMode) {
        await axios.put(`${BASE_URL}/pfs/${pfsForm.id}`, pfsForm);
        alert("PFS Storage Updated Successfully");
      } else {
        await axios.post(`${BASE_URL}/pfs`, pfsForm);
        alert("PFS Storage Added Successfully");
      }
      fetchData(); setShowPfsForm(false); resetPfsForm();
    } catch (err) { console.error(err); alert("Error Saving PFS Storage"); }
  };
  const resetPfsForm = () => {
    setPfsForm({ id: null, name: "", total_capacity_pb: "", manufacturer: "", software_model: "", price: "" });
    setIsPfsEditMode(false);
  };

  /* ================= SECONDARY INTERCONNECT CRUD ================= */
  const saveSecondary = async () => {
    const { component_category, vendor, product_name, technology, port_speed_gbps, number_of_ports, typical_use, price } = secondaryForm;
    if (!component_category || !vendor || !product_name || !technology || !port_speed_gbps || !number_of_ports || !typical_use || !price) {
      alert("Please fill all fields before saving."); return;
    }
    try {
      if (isSecondaryEditMode) {
        await axios.put(`${BASE_URL}/secondary-interconnect/${secondaryForm.id}`, secondaryForm);
        alert("Secondary Interconnect Updated Successfully");
      } else {
        await axios.post(`${BASE_URL}/secondary-interconnect`, secondaryForm);
        alert("Secondary Interconnect Added Successfully");
      }
      fetchData(); setShowSecondaryForm(false); resetSecondaryForm();
    } catch (err) { console.error(err); alert("Error Saving Secondary Interconnect"); }
  };
  const resetSecondaryForm = () => {
    setSecondaryForm({ id: null, component_category: "", vendor: "", product_name: "", technology: "", port_speed_gbps: "", number_of_ports: "", typical_use: "", price: "" });
    setIsSecondaryEditMode(false);
  };

  /* ================= MANAGEMENT NETWORK CRUD ================= */
  const saveMgmt = async () => {
    const { component_category, vendor, technology, product_name, port_speed_gbps, number_of_ports, price } = mgmtForm;
    if (!component_category || !vendor || !technology || !product_name || !port_speed_gbps || !number_of_ports || !price) {
      alert("Please fill all fields before saving."); return;
    }
    try {
      if (isMgmtEditMode) {
        await axios.put(`${BASE_URL}/management-network/${mgmtForm.id}`, mgmtForm);
        alert("Management Network Updated Successfully");
      } else {
        await axios.post(`${BASE_URL}/management-network`, mgmtForm);
        alert("Management Network Added Successfully");
      }
      fetchData(); setShowMgmtForm(false); resetMgmtForm();
    } catch (err) { console.error(err); alert("Error Saving Management Network"); }
  };
  const resetMgmtForm = () => {
    setMgmtForm({ id: null, component_category: "", vendor: "", technology: "", product_name: "", port_speed_gbps: "", number_of_ports: "", use: "", price: "" });
    setIsMgmtEditMode(false);
  };

  /* ================= OCP RACK CRUD ================= */
  const saveOcp = async () => {
    const { name, price } = ocpForm;
    if (!name || !price) { alert("Please fill all fields before saving."); return; }
    try {
      if (isOcpEditMode) {
        await axios.put(`${BASE_URL}/ocp-rack/${ocpForm.id}`, ocpForm);
        alert("OCP Rack Updated Successfully");
      } else {
        await axios.post(`${BASE_URL}/ocp-rack`, ocpForm);
        alert("OCP Rack Added Successfully");
      }
      fetchData(); setShowOcpForm(false); resetOcpForm();
    } catch (err) { console.error(err); alert("Error Saving OCP Rack"); }
  };
  const resetOcpForm = () => {
    setOcpForm({ id: null, name: "", price: "" });
    setIsOcpEditMode(false);
  };

  /* ================= STANDARD RACK CRUD ================= */
  const saveRack = async () => {
    const { name, price } = rackForm;
    if (!name || !price) { alert("Please fill all fields before saving."); return; }
    try {
      if (isRackEditMode) {
        await axios.put(`${BASE_URL}/standard-rack/${rackForm.id}`, rackForm);
        alert("Standard Rack Updated Successfully");
      } else {
        await axios.post(`${BASE_URL}/standard-rack`, rackForm);
        alert("Standard Rack Added Successfully");
      }
      fetchData(); setShowRackForm(false); resetRackForm();
    } catch (err) { console.error(err); alert("Error Saving Standard Rack"); }
  };
  const resetRackForm = () => {
    setRackForm({ id: null, name: "", price: "" });
    setIsRackEditMode(false);
  };

  /* =================================================================
     TABLE B – SOFTWARE SERVICE CRUD
     Backend: POST /api/software-service   → add
              PUT  /api/software-service/{id} → update  (add this to SoftwareService_Controller)
              DELETE /api/software-service/{id} → delete
  ================================================================= */
  const saveService = async () => {
    const { service_name, unit, price } = serviceForm;
    if (!service_name || !unit || !price) {
      alert("Please fill all fields before saving."); return;
    }
    try {
      if (isServiceEditMode) {
        await axios.put(`${BASE_URL}/software-service/${serviceForm.id}`, serviceForm);
        alert("Software Service Updated Successfully");
      } else {
        await axios.post(`${BASE_URL}/software-service`, serviceForm);
        alert("Software Service Added Successfully");
      }
      fetchData(); setShowServiceForm(false); resetServiceForm();
    } catch (err) { console.error(err); alert("Error Saving Software Service"); }
  };
  const resetServiceForm = () => {
    setServiceForm({ id: null, service_name: "", unit: "", price: "" });
    setIsServiceEditMode(false);
  };

  /* =================================================================
     TABLE C – WORKSHOP / ADD-ON SERVICE CRUD
     Backend: POST /api/addon_service        → add
              PUT  /api/addon_service/{id}   → update  (add this to Workshop_Controller)
              DELETE /api/addon_service/{id} → delete
  ================================================================= */
  const saveWorkshop = async () => {
    const { service_name, unit, price } = workshopForm;
    if (!service_name || !unit || !price) {
      alert("Please fill all fields before saving."); return;
    }
    try {
      if (isWorkshopEditMode) {
        await axios.put(`${BASE_URL}/addon_service/${workshopForm.id}`, workshopForm);
        alert("Add-on Service Updated Successfully");
      } else {
        await axios.post(`${BASE_URL}/addon_service`, workshopForm);
        alert("Add-on Service Added Successfully");
      }
      fetchData(); setShowWorkshopForm(false); resetWorkshopForm();
    } catch (err) { console.error(err); alert("Error Saving Add-on Service"); }
  };
  const resetWorkshopForm = () => {
    setWorkshopForm({ id: null, service_name: "", unit: "", price: "" });
    setIsWorkshopEditMode(false);
  };

  /* ================= HELPER: open add form for simple component ================= */
  const openAddForm = (compName) => {
    if (compName === "KVM Switch") { resetKvmForm(); setShowKvmForm(true); }
    else if (compName === "PFS Storage") { resetPfsForm(); setShowPfsForm(true); }
    else if (compName === "Secondary Interconnect") { resetSecondaryForm(); setShowSecondaryForm(true); }
    else if (compName === "Management Network") { resetMgmtForm(); setShowMgmtForm(true); }
    else if (compName === "OCP Rack") { resetOcpForm(); setShowOcpForm(true); }
    else if (compName === "Standard Rack") { resetRackForm(); setShowRackForm(true); }
  };

  /* ================= PDF GENERATION ================= */
  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const callAutoTable = (d, cfg) => {
        if (typeof autoTable === "function") autoTable(d, cfg);
        else if (d.autoTable) d.autoTable(cfg);
        else throw new Error("autoTable plugin not found");
      };
      doc.setFontSize(20);
      doc.text("HPC System Configuration Quote", 14, 20);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
      doc.text(`Conversion Rate: 1 USD = Rs. ${usdRate}`, 14, 33);
      const nodeRows = [
        ["Master Node", nodes.master.configured ? `${nodes.master.processor?.model || ""}` : "Not Configured", nodes.master.qty],
        ["Compute Node", nodes.compute.configured ? `${nodes.compute.processor?.model || ""}` : "Not Configured", nodes.compute.qty],
        ["High Memory Node", nodes.hm.configured ? `${nodes.hm.processor?.model || ""}` : "Not Configured", nodes.hm.qty],
        ["GPU Node", nodes.gpuNode.configured ? `${nodes.gpuNode.processor?.model || ""} + ${nodes.gpuNode.gpu?.name || ""}` : "Not Configured", nodes.gpuNode.qty],
      ];
      simpleDropdownComponents.forEach((comp, i) => {
        nodeRows.push([comp.name, simpleState[i]?.selected?.product_name || simpleState[i]?.selected?.name || "None Selected", simpleState[i]?.qty || 0]);
      });
      callAutoTable(doc, { startY: 40, head: [["Component", "Selected Model", "Qty"]], body: nodeRows, theme: "striped", headStyles: { fillColor: [44, 62, 80] } });
      const serviceRows = [...tableB, ...tableC].map((item) => {
        return [item.name, "-", item.qty, item.price.toLocaleString("en-IN"), (item.price * item.qty).toLocaleString("en-IN")];
      });
      callAutoTable(doc, { startY: doc.lastAutoTable.finalY + 10, head: [["Service Details", "Unit", "Qty", "Unit Price", "Total (INR)"]], body: serviceRows, theme: "grid", headStyles: { fillColor: [52, 73, 94] } });
      const summaryRows = [
        ["Hardware Total", `Rs. ${hardwareTotal_INR.toLocaleString("en-IN")}`],
        ["Software & Services Total", `Rs. ${totalB_INR.toLocaleString("en-IN")}`],
        ["Add-on Services Total", `Rs. ${totalC_INR.toLocaleString("en-IN")}`],
        ["GRAND TOTAL (INR)", `Rs. ${grandTotal_INR.toLocaleString("en-IN")}`],
        ["GRAND TOTAL (USD)", `$ ${grandTotal_USD.toLocaleString("en-US")}`],
      ];
      callAutoTable(doc, { startY: doc.lastAutoTable.finalY + 10, head: [["Summary", "Value"]], body: summaryRows, theme: "plain", styles: { fontStyle: "bold", fontSize: 11 } });
      doc.save("HPC_Configuration_Report.pdf");
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("Error generating PDF. Please ensure jspdf-autotable is installed.");
    }
  };

  /* ================= ADMIN BUTTON STYLES ================= */
  const btnStyle = (color) => ({
    background: color, color: "white", border: "none",
    padding: "8px 12px", borderRadius: "5px", cursor: "pointer", marginRight: "5px",
  });

  /* ===================== RENDER ===================== */
  return (
    <div className="container">

      {/* ========================================================= */}
      {/* ================= TABLE A =============================== */}
      {/* ========================================================= */}
      <h2>Table A – System Configuration</h2>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Selection</th>
            <th>Quantity</th>
            <th>Action</th>
            {isAdmin && <th>Admin Controls</th>}
          </tr>
        </thead>
        <tbody>
          {/* ================= NODE CONFIG ROWS ================= */}
          {["master", "compute", "hm", "gpuNode"].map((key, i) => (
            <tr key={key}>
              <td>{["Master/Service Nodes", "Compute Node", "High Memory Node", "GPU Node"][i]}</td>
              <td>{nodes[key].configured ? "✅ Configured" : "❌ Not Configured"}</td>
              <td>{nodes[key].qty}</td>
              <td>
                <button onClick={() => setActiveNode(key)}>
                  {nodes[key].configured ? "Edit" : "Configure"}
                </button>
              </td>
              {isAdmin && <td>-</td>}
            </tr>
          ))}

          {/* ================= SIMPLE COMPONENTS ================= */}
          {simpleDropdownComponents.length > 0 &&
            simpleDropdownComponents.map((comp, i) => (
              <tr key={i}>
                <td>{comp.name}</td>
                <td>
                  <select
                    value={
                      simpleState[i]?.selected
                        ? simpleState[i].selected.product_name || simpleState[i].selected.name
                        : ""
                    }
                    onChange={(e) => {
                      const opt = comp.options.find((o) => (o.product_name || o.name) === e.target.value);
                      const updated = [...simpleState];
                      if (!updated[i]) updated[i] = { selected: null, qty: 1 };
                      updated[i].selected = opt;
                      setSimpleState(updated);
                    }}
                  >
                    <option value="">Select Option</option>
                    {comp.options.map((o, idx) => (
                      <option key={idx} value={o.product_name || o.name} title={comp.getHover ? comp.getHover(o) : ""}>
                        {o.product_name || o.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number" min="1" value={simpleState[i]?.qty || 1}
                    onChange={(e) => {
                      const updated = [...simpleState];
                      if (!updated[i]) updated[i] = { selected: null, qty: 1 };
                      updated[i].qty = Number(e.target.value);
                      setSimpleState(updated);
                    }}
                  />
                </td>
                <td>-</td>
                {isAdmin && (
                  <td>
                    <button style={btnStyle("green")} onClick={() => openAddForm(comp.name)}>Add</button>
                    <button style={btnStyle("orange")} onClick={() => openEditPicker(comp.pickerType)}>Edit</button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      {/* ========================================================= */}
      {/* ================= CONFIG PANEL ========================== */}
      {/* ========================================================= */}
      {activeNode && (
        <div className="config-panel">
          <h3>Configuring {activeNode.toUpperCase()} Node</h3>
          <div className="panel-grid">

            {/* PROCESSOR */}
            <label>Processor:</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select
                value={processors.findIndex((p) => p.model === nodes[activeNode].processor?.model)}
                onChange={(e) => setNodes({ ...nodes, [activeNode]: { ...nodes[activeNode], processor: processors[e.target.value] } })}
                style={{ flex: 1 }}
              >
                <option value="-1">Select Processor</option>
                {processors.map((p, i) => (
                  <option key={i} value={i} title={`Model: ${p.model}\nBase GHz: ${p.base_ghz}\nCPUs Per Node: ${p.cpus_per_node}\nArchitecture: ${p.architecture}\nrpeak: ${p.rpeak}\nFLOPSPerCycle: ${p.FLOPSPerCycle}\nCores Per CPU: ${p.cores_per_cpu}`}>
                    {p.model}
                  </option>
                ))}
              </select>
              {isAdmin && (
                <>
                  <button style={btnStyle("green")} onClick={() => { resetProcessorForm(); setIsEditMode(false); setShowProcessorForm(true); }}>Add</button>
                  <button style={btnStyle("orange")} onClick={() => openEditPicker("processor")}>Edit</button>
                </>
              )}
            </div>

            {/* MEMORY */}
            <label>Memory:</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select
                value={memoryList.findIndex((m) => m.memory_type === nodes[activeNode].memory?.memory_type)}
                onChange={(e) => setNodes({ ...nodes, [activeNode]: { ...nodes[activeNode], memory: memoryList[e.target.value] } })}
                style={{ flex: 1 }}
              >
                <option value="-1">Select Memory</option>
                {memoryList.map((m, i) => (
                  <option key={i} value={i} title={`Memory Type: ${m.memory_type}\nModule Capacity: ${m.module_capacity_gb} GB\nMemory Speed: ${m.memory_speed_mts} MT/s\nMemory Channels: ${m.memory_channels}\nTotal Memory Per Node: ${m.total_memory_per_node_gb} GB`}>
                    {m.memory_type} ({m.total_memory_per_node_gb}GB/Node)
                  </option>
                ))}
              </select>
              {isAdmin && (
                <>
                  <button style={btnStyle("green")} onClick={() => { resetMemoryForm(); setIsMemoryEditMode(false); setShowMemoryForm(true); }}>Add</button>
                  <button style={btnStyle("orange")} onClick={() => openEditPicker("memory")}>Edit</button>
                </>
              )}
            </div>

            {/* INTERCONNECT */}
            <label>Interconnect:</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select
                value={interconnects.findIndex((inter) => inter.product_name === nodes[activeNode].interconnect?.product_name)}
                onChange={(e) => setNodes({ ...nodes, [activeNode]: { ...nodes[activeNode], interconnect: interconnects[e.target.value] } })}
                style={{ flex: 1 }}
              >
                <option value="-1">Select Interconnect</option>
                {interconnects.map((inter, idx) => (
                  <option key={idx} value={idx} title={`Product: ${inter.product_name}\nTechnology: ${inter.technology}\nPort Speed: ${inter.port_speed_gbps} Gbps\nPorts: ${inter.number_of_ports}\nAggregate BW: ${inter.aggregate_bandwidth_tbps} Tbps\nLatency: ${inter.latency_ns} ns\nVendor: ${inter.vendor}`}>
                    {inter.product_name}
                  </option>
                ))}
              </select>
              {isAdmin && (
                <>
                  <button style={btnStyle("green")} onClick={() => { resetInterconnectForm(); setIsInterconnectEditMode(false); setShowInterconnectForm(true); }}>Add</button>
                  <button style={btnStyle("orange")} onClick={() => openEditPicker("interconnect")}>Edit</button>
                </>
              )}
            </div>

            {/* GPU */}
            {activeNode === "gpuNode" && (
              <>
                <label>GPU:</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <select
                    value={gpuOptions.findIndex((g) => g.name === nodes[activeNode].gpu?.name)}
                    onChange={(e) => setNodes({ ...nodes, [activeNode]: { ...nodes[activeNode], gpu: gpuOptions[e.target.value] } })}
                    style={{ flex: 1 }}
                  >
                    <option value="-1">Select GPU</option>
                    {gpuOptions.map((g, idx) => (
                      <option key={idx} value={idx} title={`GPU: ${g.name}\nArchitecture: ${g.architecture}\nGPUs Per Node: ${g.gpusPerNode}\nFP64: ${g.fp64}\nGPU Memory: ${g.gpuMemory}\nInterconnect: ${g.interconnect}\nRPeak: ${g.rpeak}\nManufacturer: ${g.manufacturer}`}>
                        {g.name || g.model}
                      </option>
                    ))}
                  </select>
                  {isAdmin && (
                    <>
                      <button style={btnStyle("green")} onClick={() => { resetGpuForm(); setIsGpuEditMode(false); setShowGpuForm(true); }}>Add</button>
                      <button style={btnStyle("orange")} onClick={() => openEditPicker("gpu")}>Edit</button>
                    </>
                  )}
                </div>
              </>
            )}

            {/* QUANTITY */}
            <label>Quantity:</label>
            <input type="number" min="1" value={nodes[activeNode].qty} onChange={(e) => setNodes({ ...nodes, [activeNode]: { ...nodes[activeNode], qty: Number(e.target.value) } })} />
          </div>
          <button className="save-btn" onClick={handleSave}>Save Configuration</button>
        </div>
      )}

      {/* ================================================================
          EDIT PICKER MODALS
      ================================================================ */}
      {editPicker === "processor" && (
        <EditPickerModal type="processor" title="Processor" items={processors}
          selectedItem={editPickerSelected}
          onSelectItem={setEditPickerSelected}
          onConfirm={handlePickerConfirm}
          onDelete={handlePickerDelete}
          onCancel={closeEditPicker}
          getLabel={(p) => p.model}
          getSubLabel={(p) => `${p.manufacturer} | ${p.architecture} | ${p.cores_per_cpu} cores | ₹${Number(p.price || 0).toLocaleString("en-IN")}`}
        />
      )}
      {editPicker === "memory" && (
        <EditPickerModal type="memory" title="Memory" items={memoryList}
          selectedItem={editPickerSelected}
          onSelectItem={setEditPickerSelected}
          onConfirm={handlePickerConfirm}
          onDelete={handlePickerDelete}
          onCancel={closeEditPicker}
          getLabel={(m) => `${m.memory_type} (${m.total_memory_per_node_gb} GB/Node)`}
          getSubLabel={(m) => `${m.memory_speed_mts} MT/s | ${m.memory_channels} channels | ₹${Number(m.price || 0).toLocaleString("en-IN")}`}
        />
      )}
      {editPicker === "gpu" && (
        <EditPickerModal type="gpu" title="GPU" items={gpuOptions}
          selectedItem={editPickerSelected}
          onSelectItem={setEditPickerSelected}
          onConfirm={handlePickerConfirm}
          onDelete={handlePickerDelete}
          onCancel={closeEditPicker}
          getLabel={(g) => g.name || g.model}
          getSubLabel={(g) => `${g.manufacturer} | ${g.architecture} | FP64: ${g.fp64} | ₹${Number(g.price || 0).toLocaleString("en-IN")}`}
        />
      )}
      {editPicker === "interconnect" && (
        <EditPickerModal type="interconnect" title="Interconnect" items={interconnects}
          selectedItem={editPickerSelected}
          onSelectItem={setEditPickerSelected}
          onConfirm={handlePickerConfirm}
          onDelete={handlePickerDelete}
          onCancel={closeEditPicker}
          getLabel={(i) => i.product_name}
          getSubLabel={(i) => `${i.vendor} | ${i.technology} | ${i.port_speed_gbps} Gbps | ₹${Number(i.price || 0).toLocaleString("en-IN")}`}
        />
      )}
      {editPicker === "kvm" && (
        <EditPickerModal type="kvm" title="KVM Switch"
          items={simpleDropdownComponents.find(c => c.pickerType === "kvm")?.options || []}
          selectedItem={editPickerSelected}
          onSelectItem={setEditPickerSelected}
          onConfirm={handlePickerConfirm}
          onDelete={handlePickerDelete}
          onCancel={closeEditPicker}
          getLabel={(k) => k.name}
          getSubLabel={(k) => `${k.specification} | ${k.ports} ports | ${k.formFactor} | ₹${Number(k.price || 0).toLocaleString("en-IN")}`}
        />
      )}
      {editPicker === "pfs" && (
        <EditPickerModal type="pfs" title="PFS Storage"
          items={simpleDropdownComponents.find(c => c.pickerType === "pfs")?.options || []}
          selectedItem={editPickerSelected}
          onSelectItem={setEditPickerSelected}
          onConfirm={handlePickerConfirm}
          onDelete={handlePickerDelete}
          onCancel={closeEditPicker}
          getLabel={(p) => p.name}
          getSubLabel={(p) => `${p.manufacturer} | ${p.total_capacity_pb} PB | ${p.software_model} | ₹${Number(p.price || 0).toLocaleString("en-IN")}`}
        />
      )}
      {editPicker === "secondary" && (
        <EditPickerModal type="secondary" title="Secondary Interconnect"
          items={simpleDropdownComponents.find(c => c.pickerType === "secondary")?.options || []}
          selectedItem={editPickerSelected}
          onSelectItem={setEditPickerSelected}
          onConfirm={handlePickerConfirm}
          onDelete={handlePickerDelete}
          onCancel={closeEditPicker}
          getLabel={(s) => s.product_name}
          getSubLabel={(s) => `${s.vendor} | ${s.technology} | ${s.port_speed_gbps} Gbps | ₹${Number(s.price || 0).toLocaleString("en-IN")}`}
        />
      )}
      {editPicker === "mgmt" && (
        <EditPickerModal type="mgmt" title="Management Network"
          items={simpleDropdownComponents.find(c => c.pickerType === "mgmt")?.options || []}
          selectedItem={editPickerSelected}
          onSelectItem={setEditPickerSelected}
          onConfirm={handlePickerConfirm}
          onDelete={handlePickerDelete}
          onCancel={closeEditPicker}
          getLabel={(m) => m.product_name}
          getSubLabel={(m) => `${m.vendor} | ${m.technology} | ${m.port_speed_gbps} Gbps | ₹${Number(m.price || 0).toLocaleString("en-IN")}`}
        />
      )}
      {editPicker === "ocp" && (
        <EditPickerModal type="ocp" title="OCP Rack"
          items={simpleDropdownComponents.find(c => c.pickerType === "ocp")?.options || []}
          selectedItem={editPickerSelected}
          onSelectItem={setEditPickerSelected}
          onConfirm={handlePickerConfirm}
          onDelete={handlePickerDelete}
          onCancel={closeEditPicker}
          getLabel={(o) => o.name}
          getSubLabel={(o) => `₹${Number(o.price || 0).toLocaleString("en-IN")}`}
        />
      )}
      {editPicker === "rack" && (
        <EditPickerModal type="rack" title="Standard Rack"
          items={simpleDropdownComponents.find(c => c.pickerType === "rack")?.options || []}
          selectedItem={editPickerSelected}
          onSelectItem={setEditPickerSelected}
          onConfirm={handlePickerConfirm}
          onDelete={handlePickerDelete}
          onCancel={closeEditPicker}
          getLabel={(r) => r.name}
          getSubLabel={(r) => `₹${Number(r.price || 0).toLocaleString("en-IN")}`}
        />
      )}
      {/* ---- Table B picker ---- */}
      {editPicker === "service" && (
        <EditPickerModal type="service" title="Software Service" items={serviceList}
          selectedItem={editPickerSelected}
          onSelectItem={setEditPickerSelected}
          onConfirm={handlePickerConfirm}
          onDelete={handlePickerDelete}
          onCancel={closeEditPicker}
          getLabel={(s) => s.service_name}
          getSubLabel={(s) => `₹${Number(s.price || 0).toLocaleString("en-IN")}`}
        />
      )}
      {/* ---- Table C picker ---- */}
      {editPicker === "workshop" && (
        <EditPickerModal type="workshop" title="Add-on Service" items={workshopList}
          selectedItem={editPickerSelected}
          onSelectItem={setEditPickerSelected}
          onConfirm={handlePickerConfirm}
          onDelete={handlePickerDelete}
          onCancel={closeEditPicker}
          getLabel={(w) => w.service_name}
          getSubLabel={(w) => `₹${Number(w.price || 0).toLocaleString("en-IN")}`}
        />
      )}

      {/* ========================================================= */}
      {/* ================= PROCESSOR FORM ======================== */}
      {/* ========================================================= */}
      {showProcessorForm && (
        <Modal title={isEditMode ? "Edit Processor" : "Add Processor"} onSave={saveProcessor} onCancel={() => { setShowProcessorForm(false); resetProcessorForm(); }}>
          <input placeholder="Manufacturer" value={processorForm.manufacturer} onChange={(e) => setProcessorForm({ ...processorForm, manufacturer: e.target.value })} />
          <input placeholder="Model" value={processorForm.model} onChange={(e) => setProcessorForm({ ...processorForm, model: e.target.value })} />
          <input placeholder="Architecture" value={processorForm.architecture} onChange={(e) => setProcessorForm({ ...processorForm, architecture: e.target.value })} />
          <input type="number" placeholder="CPUs Per Node" value={processorForm.cpus_per_node} onChange={(e) => setProcessorForm({ ...processorForm, cpus_per_node: e.target.value })} />
          <input type="number" placeholder="Cores Per CPU" value={processorForm.cores_per_cpu} onChange={(e) => setProcessorForm({ ...processorForm, cores_per_cpu: e.target.value })} />
          <input type="number" placeholder="Total Cores" value={processorForm.total_cores} onChange={(e) => setProcessorForm({ ...processorForm, total_cores: e.target.value })} />
          <input type="number" step="0.1" placeholder="Base GHz" value={processorForm.base_ghz} onChange={(e) => setProcessorForm({ ...processorForm, base_ghz: e.target.value })} />
          <input placeholder="L3 Cache" value={processorForm.l3Cache} onChange={(e) => setProcessorForm({ ...processorForm, l3Cache: e.target.value })} />
          <input placeholder="Memory Type" value={processorForm.memoryType} onChange={(e) => setProcessorForm({ ...processorForm, memoryType: e.target.value })} />
          <input placeholder="PCIe Gen" value={processorForm.pcie_gen} onChange={(e) => setProcessorForm({ ...processorForm, pcie_gen: e.target.value })} />
          <input placeholder="TDP Watt" value={processorForm.tdp_watt} onChange={(e) => setProcessorForm({ ...processorForm, tdp_watt: e.target.value })} />
          <input type="number" placeholder="Price" value={processorForm.price} onChange={(e) => setProcessorForm({ ...processorForm, price: e.target.value })} />
          <input type="number" step="0.1" placeholder="RPeak" value={processorForm.rpeak} onChange={(e) => setProcessorForm({ ...processorForm, rpeak: e.target.value })} />
          <input type="number" step="0.1" placeholder="FLOPS Per Cycle" value={processorForm.FLOPSPerCycle || ""} onChange={(e) => setProcessorForm({ ...processorForm, FLOPSPerCycle: e.target.value })} />
        </Modal>
      )}

      {/* ================= MEMORY FORM ================= */}
      {showMemoryForm && (
        <Modal title={isMemoryEditMode ? "Edit Memory" : "Add Memory"} onSave={saveMemory} onCancel={() => { setShowMemoryForm(false); resetMemoryForm(); }}>
          <input placeholder="Category" value={memoryForm.component_category || ""} onChange={(e) => setMemoryForm({ ...memoryForm, component_category: e.target.value })} />
          <input placeholder="Memory Type" value={memoryForm.memory_type} onChange={(e) => setMemoryForm({ ...memoryForm, memory_type: e.target.value })} />
          <input placeholder="Module Capacity GB" value={memoryForm.module_capacity_gb} onChange={(e) => setMemoryForm({ ...memoryForm, module_capacity_gb: e.target.value })} />
          <input placeholder="Memory Speed (MT/s)" value={memoryForm.memory_speed_mts} onChange={(e) => setMemoryForm({ ...memoryForm, memory_speed_mts: e.target.value })} />
          <input placeholder="Memory Channels" value={memoryForm.memory_channels} onChange={(e) => setMemoryForm({ ...memoryForm, memory_channels: e.target.value })} />
          <input placeholder="Total Memory Per Node GB" value={memoryForm.total_memory_per_node_gb} onChange={(e) => setMemoryForm({ ...memoryForm, total_memory_per_node_gb: e.target.value })} />
          <input type="number" placeholder="Price" value={memoryForm.price} onChange={(e) => setMemoryForm({ ...memoryForm, price: e.target.value })} />
        </Modal>
      )}

      {/* ================= GPU FORM ================= */}
      {showGpuForm && (
        <Modal title={isGpuEditMode ? "Edit GPU" : "Add GPU"} onSave={saveGpu} onCancel={() => { setShowGpuForm(false); resetGpuForm(); }}>
          <input placeholder="Component Category" value={gpuForm.component_category} onChange={(e) => setGpuForm({ ...gpuForm, component_category: e.target.value })} />
          <input placeholder="GPU Name" value={gpuForm.name} onChange={(e) => setGpuForm({ ...gpuForm, name: e.target.value })} />
          <input placeholder="Architecture" value={gpuForm.architecture} onChange={(e) => setGpuForm({ ...gpuForm, architecture: e.target.value })} />
          <input type="number" placeholder="GPUs Per Node" value={gpuForm.gpusPerNode} onChange={(e) => setGpuForm({ ...gpuForm, gpusPerNode: e.target.value })} />
          <input type="number" step="0.1" placeholder="FP64 Performance" value={gpuForm.fp64} onChange={(e) => setGpuForm({ ...gpuForm, fp64: e.target.value })} />
          <input placeholder="GPU Memory" value={gpuForm.gpuMemory} onChange={(e) => setGpuForm({ ...gpuForm, gpuMemory: e.target.value })} />
          <input placeholder="GPU Interconnect" value={gpuForm.interconnect} onChange={(e) => setGpuForm({ ...gpuForm, interconnect: e.target.value })} />
          <input type="number" step="0.1" placeholder="RPeak" value={gpuForm.rpeak} onChange={(e) => setGpuForm({ ...gpuForm, rpeak: e.target.value })} />
          <input placeholder="Manufacturer" value={gpuForm.manufacturer} onChange={(e) => setGpuForm({ ...gpuForm, manufacturer: e.target.value })} />
          <input type="number" placeholder="Price" value={gpuForm.price} onChange={(e) => setGpuForm({ ...gpuForm, price: e.target.value })} />
        </Modal>
      )}

      {/* ================= INTERCONNECT FORM ================= */}
      {showInterconnectForm && (
        <Modal title={isInterconnectEditMode ? "Edit Interconnect" : "Add Interconnect"} onSave={saveInterconnect} onCancel={() => { setShowInterconnectForm(false); resetInterconnectForm(); }}>
          <input placeholder="Category" value={interconnectForm.component_category || ""} onChange={(e) => setInterconnectForm({ ...interconnectForm, component_category: e.target.value })} />
          <input placeholder="Vendor" value={interconnectForm.vendor} onChange={(e) => setInterconnectForm({ ...interconnectForm, vendor: e.target.value })} />
          <input placeholder="Product Name" value={interconnectForm.product_name} onChange={(e) => setInterconnectForm({ ...interconnectForm, product_name: e.target.value })} />
          <input placeholder="Technology" value={interconnectForm.technology} onChange={(e) => setInterconnectForm({ ...interconnectForm, technology: e.target.value })} />
          <input type="number" placeholder="Port Speed Gbps" value={interconnectForm.port_speed_gbps} onChange={(e) => setInterconnectForm({ ...interconnectForm, port_speed_gbps: e.target.value })} />
          <input type="number" step="0.1" placeholder="Aggregate Bandwidth TBPS" value={interconnectForm.aggregate_bandwidth_tbps} onChange={(e) => setInterconnectForm({ ...interconnectForm, aggregate_bandwidth_tbps: e.target.value })} />
          <input type="number" step="0.1" placeholder="Latency NS" value={interconnectForm.latency_ns} onChange={(e) => setInterconnectForm({ ...interconnectForm, latency_ns: e.target.value })} />
          <input type="number" placeholder="Number of Ports" value={interconnectForm.number_of_ports} onChange={(e) => setInterconnectForm({ ...interconnectForm, number_of_ports: e.target.value })} />
          <input type="number" placeholder="Price" value={interconnectForm.price} onChange={(e) => setInterconnectForm({ ...interconnectForm, price: e.target.value })} />
        </Modal>
      )}

      {/* ================= KVM SWITCH FORM ================= */}
      {showKvmForm && (
        <Modal title={isKvmEditMode ? "Edit KVM Switch" : "Add KVM Switch"} onSave={saveKvm} onCancel={() => { setShowKvmForm(false); resetKvmForm(); }}>
          <input placeholder="Name" value={kvmForm.name} onChange={(e) => setKvmForm({ ...kvmForm, name: e.target.value })} />
          <input placeholder="Specification" value={kvmForm.specification} onChange={(e) => setKvmForm({ ...kvmForm, specification: e.target.value })} />
          <input type="number" placeholder="Ports" value={kvmForm.ports} onChange={(e) => setKvmForm({ ...kvmForm, ports: e.target.value })} />
          <input placeholder="Form Factor (e.g. 1U)" value={kvmForm.formFactor} onChange={(e) => setKvmForm({ ...kvmForm, formFactor: e.target.value })} />
          <input type="number" placeholder="Price" value={kvmForm.price} onChange={(e) => setKvmForm({ ...kvmForm, price: e.target.value })} />
        </Modal>
      )}

      {/* ================= PFS STORAGE FORM ================= */}
      {showPfsForm && (
        <Modal title={isPfsEditMode ? "Edit PFS Storage" : "Add PFS Storage"} onSave={savePfs} onCancel={() => { setShowPfsForm(false); resetPfsForm(); }}>
          <input placeholder="Name (e.g. Lustre 1PB)" value={pfsForm.name} onChange={(e) => setPfsForm({ ...pfsForm, name: e.target.value })} />
          <input placeholder="Total Capacity (PB)" value={pfsForm.total_capacity_pb} onChange={(e) => setPfsForm({ ...pfsForm, total_capacity_pb: e.target.value })} />
          <input placeholder="Manufacturer" value={pfsForm.manufacturer} onChange={(e) => setPfsForm({ ...pfsForm, manufacturer: e.target.value })} />
          <input placeholder="Software Model" value={pfsForm.software_model} onChange={(e) => setPfsForm({ ...pfsForm, software_model: e.target.value })} />
          <input type="number" placeholder="Price" value={pfsForm.price} onChange={(e) => setPfsForm({ ...pfsForm, price: e.target.value })} />
        </Modal>
      )}

      {/* ================= SECONDARY INTERCONNECT FORM ================= */}
      {showSecondaryForm && (
        <Modal title={isSecondaryEditMode ? "Edit Secondary Interconnect" : "Add Secondary Interconnect"} onSave={saveSecondary} onCancel={() => { setShowSecondaryForm(false); resetSecondaryForm(); }}>
          <input placeholder="Component Category" value={secondaryForm.component_category} onChange={(e) => setSecondaryForm({ ...secondaryForm, component_category: e.target.value })} />
          <input placeholder="Vendor" value={secondaryForm.vendor} onChange={(e) => setSecondaryForm({ ...secondaryForm, vendor: e.target.value })} />
          <input placeholder="Product Name" value={secondaryForm.product_name} onChange={(e) => setSecondaryForm({ ...secondaryForm, product_name: e.target.value })} />
          <input placeholder="Technology" value={secondaryForm.technology} onChange={(e) => setSecondaryForm({ ...secondaryForm, technology: e.target.value })} />
          <input placeholder="Port Speed (Gbps)" value={secondaryForm.port_speed_gbps} onChange={(e) => setSecondaryForm({ ...secondaryForm, port_speed_gbps: e.target.value })} />
          <input type="number" placeholder="Number of Ports" value={secondaryForm.number_of_ports} onChange={(e) => setSecondaryForm({ ...secondaryForm, number_of_ports: e.target.value })} />
          <input placeholder="Typical Use" value={secondaryForm.typical_use} onChange={(e) => setSecondaryForm({ ...secondaryForm, typical_use: e.target.value })} />
          <input type="number" placeholder="Price" value={secondaryForm.price} onChange={(e) => setSecondaryForm({ ...secondaryForm, price: e.target.value })} />
        </Modal>
      )}

      {/* ================= MANAGEMENT NETWORK FORM ================= */}
      {showMgmtForm && (
        <Modal title={isMgmtEditMode ? "Edit Management Network" : "Add Management Network"} onSave={saveMgmt} onCancel={() => { setShowMgmtForm(false); resetMgmtForm(); }}>
          <input placeholder="Component Category" value={mgmtForm.component_category} onChange={(e) => setMgmtForm({ ...mgmtForm, component_category: e.target.value })} />
          <input placeholder="Vendor" value={mgmtForm.vendor} onChange={(e) => setMgmtForm({ ...mgmtForm, vendor: e.target.value })} />
          <input placeholder="Technology" value={mgmtForm.technology} onChange={(e) => setMgmtForm({ ...mgmtForm, technology: e.target.value })} />
          <input placeholder="Product Name" value={mgmtForm.product_name} onChange={(e) => setMgmtForm({ ...mgmtForm, product_name: e.target.value })} />
          <input placeholder="Port Speed (Gbps)" value={mgmtForm.port_speed_gbps} onChange={(e) => setMgmtForm({ ...mgmtForm, port_speed_gbps: e.target.value })} />
          <input type="number" placeholder="Number of Ports" value={mgmtForm.number_of_ports} onChange={(e) => setMgmtForm({ ...mgmtForm, number_of_ports: e.target.value })} />
          <input type="number" placeholder="Price" value={mgmtForm.price} onChange={(e) => setMgmtForm({ ...mgmtForm, price: e.target.value })} />
        </Modal>
      )}

      {/* ================= OCP RACK FORM ================= */}
      {showOcpForm && (
        <Modal title={isOcpEditMode ? "Edit OCP Rack" : "Add OCP Rack"} onSave={saveOcp} onCancel={() => { setShowOcpForm(false); resetOcpForm(); }}>
          <input placeholder="Name" value={ocpForm.name} onChange={(e) => setOcpForm({ ...ocpForm, name: e.target.value })} />
          <input type="number" placeholder="Price" value={ocpForm.price} onChange={(e) => setOcpForm({ ...ocpForm, price: e.target.value })} />
        </Modal>
      )}

      {/* ================= STANDARD RACK FORM ================= */}
      {showRackForm && (
        <Modal title={isRackEditMode ? "Edit Standard Rack" : "Add Standard Rack"} onSave={saveRack} onCancel={() => { setShowRackForm(false); resetRackForm(); }}>
          <input placeholder="Name" value={rackForm.name} onChange={(e) => setRackForm({ ...rackForm, name: e.target.value })} />
          <input type="number" placeholder="Price" value={rackForm.price} onChange={(e) => setRackForm({ ...rackForm, price: e.target.value })} />
        </Modal>
      )}

      {/* ================= TABLE B SOFTWARE SERVICE FORM ================= */}
      {showServiceForm && (
        <Modal
          title={isServiceEditMode ? "Edit Software Service" : "Add Software Service"}
          onSave={saveService}
          onCancel={() => { setShowServiceForm(false); resetServiceForm(); }}
        >
          <input
            placeholder="Service Name"
            value={serviceForm.service_name}
            onChange={(e) => setServiceForm({ ...serviceForm, service_name: e.target.value })}
          />
          <input
            placeholder="Unit"
            value={serviceForm.unit}
            onChange={(e) => setServiceForm({ ...serviceForm, unit: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price (₹)"
            value={serviceForm.price}
            onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
          />
        </Modal>
      )}

      {/* ================= TABLE C WORKSHOP / ADD-ON SERVICE FORM ================= */}
      {showWorkshopForm && (
        <Modal
          title={isWorkshopEditMode ? "Edit Add-on Service" : "Add Add-on Service"}
          onSave={saveWorkshop}
          onCancel={() => { setShowWorkshopForm(false); resetWorkshopForm(); }}
        >
          <input
            placeholder="Service Name"
            value={workshopForm.service_name}
            onChange={(e) => setWorkshopForm({ ...workshopForm, service_name: e.target.value })}
          />
          <input
            placeholder="Unit"
            value={workshopForm.unit}
            onChange={(e) => setWorkshopForm({ ...workshopForm, unit: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price (₹)"
            value={workshopForm.price}
            onChange={(e) => setWorkshopForm({ ...workshopForm, price: e.target.value })}
          />
        </Modal>
      )}

      {/* ========================================================= */}
      {/* ================= TABLE RPEAK =========================== */}
      {/* ========================================================= */}
      <h2>Table – RPeak Performance Summary</h2>
      <table className="rpeak-table">
        <thead>
          <tr>
            <th>Node Type</th><th>Quantity</th><th>RPeak (TFLOPS)</th>
            <th>Formula Used <br />(base * cores * fpc * cpucount) / 1000</th><th>Total FLOPS</th>
          </tr>
        </thead>
        <tbody>
          {dynamicRpeak.map((row, idx) => (
            <tr key={idx}>
              <td>{row.label}</td>
              <td>{row.qty}</td>
              <td>{row.val.toFixed(2)}</td>
              <td style={{ fontSize: "12px", maxWidth: "500px", wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: row.formula }} />
              <td>{(row.val * row.qty).toFixed(2)}</td>
            </tr>
          ))}
          <tr style={{ background: "#dff0d8", fontWeight: "bold" }}>
          <td colSpan="4">Total FLOPS</td>
          <td>
            {(() => {
              const totalTflops = dynamicRpeak.reduce((sum, row) => sum + row.val * row.qty, 0);
              if (totalTflops >= 1000) {
                return `${(totalTflops / 1000).toFixed(2)} PFLOPS`;
              }
              return `${totalTflops.toFixed(2)} TFLOPS`;
            })()}
          </td>
        </tr>
        </tbody>
      </table>

      {/* ========================================================= */}
      {/* ================= TABLE B =============================== */}
      {/* ========================================================= */}
      <h2>Table B – Software Solutions &amp; Services</h2>
      <table>
        <thead>
          <tr>
            <th>Service Details</th>
            <th>Unit</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
            {isAdmin && <th>Admin Controls</th>}
          </tr>
        </thead>
        <tbody>
          {tableB.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.unit || "-"}</td>
                <td>
                  <input
                    type="number" min="1" value={item.qty}
                    onChange={(e) =>
                      setTableBQty((prev) => ({ ...prev, [item.id]: Number(e.target.value) }))
                    }
                  />
                </td>
                <td>{item.price.toLocaleString("en-IN")}</td>
                <td>{(item.price * item.qty).toLocaleString("en-IN")}</td>
                {/* No per-row buttons — single Add/Edit row below */}
                {isAdmin && <td>-</td>}
              </tr>
            );
          })}
        </tbody>

        {/* ── Single Admin Controls row at the bottom of Table B ── */}
        {isAdmin && (
          <tfoot>
            <tr>
              <td colSpan="4" style={{ textAlign: "right", paddingRight: "12px", fontWeight: "600", color: "#555" }}>
                Manage Software Services:
              </td>
              <td colSpan="2">
                <button
                  style={btnStyle("green")}
                  onClick={() => { resetServiceForm(); setIsServiceEditMode(false); setShowServiceForm(true); }}
                >
                  ➕ Add
                </button>
                <button
                  style={btnStyle("orange")}
                  onClick={() => openEditPicker("service")}
                >
                  ✏️ Edit / Delete
                </button>
              </td>
            </tr>
          </tfoot>
        )}
      </table>

      {/* ========================================================= */}
      {/* ================= TABLE C =============================== */}
      {/* ========================================================= */}
      <h2>Table C – CDAC Add-on Services</h2>
      <table>
        <thead>
          <tr>
            <th>Service Details</th>
            <th>Unit</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
            {isAdmin && <th>Admin Controls</th>}
          </tr>
        </thead>
        <tbody>
          {tableC.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.unit || "-"}</td>
                <td>
                  <input
                    type="number" min="1" value={item.qty}
                    onChange={(e) =>
                      setTableCQty((prev) => ({ ...prev, [item.id]: Number(e.target.value) }))
                    }
                  />
                </td>
                <td>{item.price.toLocaleString("en-IN")}</td>
                <td>{(item.price * item.qty).toLocaleString("en-IN")}</td>
                {/* No per-row buttons — single Add/Edit row below */}
                {isAdmin && <td>-</td>}
              </tr>
            );
          })}
        </tbody>

        {/* ── Single Admin Controls row at the bottom of Table C ── */}
        {isAdmin && (
          <tfoot>
            <tr>
              <td colSpan="4" style={{ textAlign: "right", paddingRight: "12px", fontWeight: "600", color: "#555" }}>
                Manage Add-on Services:
              </td>
              <td colSpan="2">
                <button
                  style={btnStyle("green")}
                  onClick={() => { resetWorkshopForm(); setIsWorkshopEditMode(false); setShowWorkshopForm(true); }}
                >
                  ➕ Add
                </button>
                <button
                  style={btnStyle("orange")}
                  onClick={() => openEditPicker("workshop")}
                >
                  ✏️ Edit / Delete
                </button>
              </td>
            </tr>
          </tfoot>
        )}
      </table>

      {/* ========================================================= */}
      {/* ================= TABLE D =============================== */}
      {/* ========================================================= */}
      <h2>Table D – Grand Total Summary</h2>
      <table className="summary-table">
        <tbody>
          <tr><td>Hardware Total</td><td>₹ {hardwareTotal_INR.toLocaleString("en-IN")}</td></tr>
          <tr><td>Software &amp; Services Total</td><td>₹ {totalB_INR.toLocaleString("en-IN")}</td></tr>
          <tr><td>Add-on Services Total</td><td>₹ {totalC_INR.toLocaleString("en-IN")}</td></tr>
          <tr className="grand-total-highlight">
            <td><strong>Grand Total (INR)</strong></td>
            <td><strong>₹ {grandTotal_INR.toLocaleString("en-IN")}</strong></td>
          </tr>
          <tr>
            <td>Grand Total (USD)<i> @ ₹{usdRate}</i></td>
            <td>$ {grandTotal_USD.toLocaleString("en-US")}</td>
          </tr>
        </tbody>
      </table>

      {/* ========================================================= */}
      {/* ================= PDF BUTTON ============================ */}
      {/* ========================================================= */}
      <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "50px",  }}>
        <button style = {{backgroundColor: "#5fc468"}}className="pdf-btn" onClick={generatePDF}>Download PDF Report</button>
      </div>

    </div>
  );
}