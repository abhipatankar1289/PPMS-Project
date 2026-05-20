import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BASE_URL = "http://localhost:8080/api";

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

  /* ================= DATABASE DROPDOWN DATA ================= */
  const [processors, setProcessors] = useState([]);
  const [memoryList, setMemoryList] = useState([]);
  const [interconnects, setInterconnects] = useState([]);
  const [gpuOptions, setGpuOptions] = useState([]);
  const [simpleDropdownComponents, setSimpleDropdownComponents] = useState([]);
  const [usdRate, setUsdRate] = useState(90);

  /* ================= TABLE B & C PRICE MAPS ================= */
  const [servicePrices, setServicePrices] = useState({});
  const [workshopPrices, setWorkshopPrices] = useState({});

  /* ================= FETCH DATA WITH POLLING ================= */
  useEffect(() => {
    fetchData();
    const pollingInterval = setInterval(() => { fetchData(); }, 5000);
    return () => clearInterval(pollingInterval);
  }, []);

  const fetchData = async () => {
    try {
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

      const getData = (index) =>
        results[index].status === "fulfilled" ? results[index].value.data : [];

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

      if (currency && currency.length > 0) {
        const rateObj = currency.find((c) => c.currency_name === "USD");
        if (rateObj) setUsdRate(rateObj.value);
      }

      setSimpleDropdownComponents([
        {
          name: "KVM Switch", options: kvm || [], apiKey: "kvm",
          getHover: (o) => `Spec: ${o.specification}\nPorts: ${o.ports}\nForm Factor: ${o.formFactor}`,
        },
        {
          name: "PFS Storage", options: pfs || [], apiKey: "pfs",
          getHover: (o) => `Capacity: ${o.total_capacity_pb} PB\n Software Model: ${o.software_model}\n Manufacturer: ${o.manufacturer} \n Software Model:${o.software_model}`,
        },
        {
          name: "Secondary Interconnect", options: secondary || [], apiKey: "secondary-interconnect",
          getHover: (o) => `Vendor: ${o.vendor}\n product_name: ${o.product_name}\n Speed: ${o.port_speed_gbps}Gbps\n Ports: ${o.number_of_ports}\n technology: ${o.technology} `,
        },
        {
          name: "Management Network", options: management || [], apiKey: "management-network",
          getHover: (o) => `Vendor: ${o.vendor}\n Product Name: ${o.product_name}\n Tech: ${o.technology}\n Speed: ${o.port_speed_gbps}Gbps\n No. of Ports: ${o.number_of_ports}`,
        },
        {
          name: "OCP Rack", options: ocp || [], apiKey: "ocp-rack", getHover: null,
        },
        {
          name: "Standard Rack", options: rack || [], apiKey: "standard-rack", getHover: null,
        },
      ]);

      const serviceMap = {};
      (services || []).forEach((s) => { serviceMap[s.service_name || s.name] = s.price; });
      setServicePrices(serviceMap);

      const workshopMap = {};
      (workshop || []).forEach((w) => { workshopMap[w.service_name || w.name] = w.price; });
      setWorkshopPrices(workshopMap);
    } catch (err) {
      console.error("Polling API Error:", err);
    }
  };

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

  useEffect(() => {
    setSimpleState(simpleDropdownComponents.map(() => ({ selected: null, qty: 1 })));
  }, [simpleDropdownComponents]);

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

  /* ================= TABLE B & C STATE ================= */
  const [tableB, setTableB] = useState([
    { name: "C-DAC HPC System software and tools", unit: "Year", qty: 1 },
    { name: "Installation & Configuration", unit: "One time", qty: 1 },
    { name: "Onsite Resident HPC System Engineer per year", unit: "Year", qty: 1 },
    { name: "Onsite Resident HPC Application Engineer per year", unit: "Year", qty: 1 },
  ]);

  const [tableC, setTableC] = useState([
    { name: "Workshop for 7 days Per Year", unit: "Nos", qty: 1 },
    { name: "Scientific exchange program ", unit: "Nos", qty: 1 },
  ]);

  const totalB_INR = tableB.reduce((sum, item) => sum + (servicePrices[item.name] || 0) * item.qty, 0);
  const totalC_INR = tableC.reduce((sum, item) => sum + (workshopPrices[item.name] || 0) * item.qty, 0);
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

  /* ================= GENERIC DELETE HELPER ================= */
  const handleDelete = async (apiKey, id, label) => {
    if (!window.confirm(`Delete this ${label}?`)) return;
    try {
      await axios.delete(`${BASE_URL}/${apiKey}/${id}`);
      alert(`${label} deleted successfully`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(`Error deleting ${label}`);
    }
  };

  /* ================= PROCESSOR CRUD ================= */
  const saveProcessor = async () => {
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

  /* ================= HELPER: open edit form for simple component ================= */
  const openEditForm = (compName, selectedOption) => {
    if (!selectedOption) { alert(`Select a ${compName} first`); return; }
    if (compName === "KVM Switch") { setKvmForm({ id: selectedOption.id, name: selectedOption.name || "", specification: selectedOption.specification || "", ports: selectedOption.ports || "", formFactor: selectedOption.formFactor || "", price: selectedOption.price || "" }); setIsKvmEditMode(true); setShowKvmForm(true); }
    else if (compName === "PFS Storage") { setPfsForm({ id: selectedOption.id, name: selectedOption.name || "", total_capacity_pb: selectedOption.total_capacity_pb || "", manufacturer: selectedOption.manufacturer || "", software_model: selectedOption.software_model || "", price: selectedOption.price || "" }); setIsPfsEditMode(true); setShowPfsForm(true); }
    else if (compName === "Secondary Interconnect") { setSecondaryForm({ id: selectedOption.id, component_category: selectedOption.component_category || "", vendor: selectedOption.vendor || "", product_name: selectedOption.product_name || "", technology: selectedOption.technology || "", port_speed_gbps: selectedOption.port_speed_gbps || "", number_of_ports: selectedOption.number_of_ports || "", typical_use: selectedOption.typical_use || "", price: selectedOption.price || "" }); setIsSecondaryEditMode(true); setShowSecondaryForm(true); }
    else if (compName === "Management Network") { setMgmtForm({ id: selectedOption.id, component_category: selectedOption.component_category || "", vendor: selectedOption.vendor || "", technology: selectedOption.technology || "", product_name: selectedOption.product_name || "", port_speed_gbps: selectedOption.port_speed_gbps || "", number_of_ports: selectedOption.number_of_ports || "", use: selectedOption.use || "", price: selectedOption.price || "" }); setIsMgmtEditMode(true); setShowMgmtForm(true); }
    else if (compName === "OCP Rack") { setOcpForm({ id: selectedOption.id, name: selectedOption.name || "", price: selectedOption.price || "" }); setIsOcpEditMode(true); setShowOcpForm(true); }
    else if (compName === "Standard Rack") { setRackForm({ id: selectedOption.id, name: selectedOption.name || "", price: selectedOption.price || "" }); setIsRackEditMode(true); setShowRackForm(true); }
  };

  const openAddForm = (compName) => {
    if (compName === "KVM Switch") { resetKvmForm(); setShowKvmForm(true); }
    else if (compName === "PFS Storage") { resetPfsForm(); setShowPfsForm(true); }
    else if (compName === "Secondary Interconnect") { resetSecondaryForm(); setShowSecondaryForm(true); }
    else if (compName === "Management Network") { resetMgmtForm(); setShowMgmtForm(true); }
    else if (compName === "OCP Rack") { resetOcpForm(); setShowOcpForm(true); }
    else if (compName === "Standard Rack") { resetRackForm(); setShowRackForm(true); }
  };

  const getApiKey = (compName) => {
    const map = { "KVM Switch": "kvm", "PFS Storage": "pfs", "Secondary Interconnect": "secondary-interconnect", "Management Network": "management-network", "OCP Rack": "ocp-rack", "Standard Rack": "standard-rack" };
    return map[compName];
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
        const price = servicePrices[item.name] || workshopPrices[item.name] || 0;
        return [item.name, item.unit, item.qty, price.toLocaleString("en-IN"), (price * item.qty).toLocaleString("en-IN")];
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

  /* ================= REUSABLE MODAL WRAPPER ================= */
  const Modal = ({ title, onSave, onCancel, children }) => (
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
                    {/* ADD */}
                    <button style={btnStyle("green")} onClick={() => openAddForm(comp.name)}>Add</button>
                    {/* EDIT */}
                    <button style={btnStyle("orange")} onClick={() => openEditForm(comp.name, simpleState[i]?.selected)}>Edit</button>
                    {/* DELETE */}
                    <button
                      style={btnStyle("red")}
                      onClick={() => {
                        const sel = simpleState[i]?.selected;
                        if (!sel) { alert(`Select a ${comp.name} first`); return; }
                        handleDelete(getApiKey(comp.name), sel.id, comp.name);
                      }}
                    >
                      Delete
                    </button>
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
              <select value={processors.findIndex((p) => p.model === nodes[activeNode].processor?.model)} onChange={(e) => setNodes({ ...nodes, [activeNode]: { ...nodes[activeNode], processor: processors[e.target.value] } })} style={{ flex: 1 }}>
                <option value="-1">Select Processor</option>
                {processors.map((p, i) => (<option key={i} value={i} title={`Model: ${p.model}\nBase GHz: ${p.base_ghz}\nCPUs Per Node: ${p.cpus_per_node}\n Architecture: ${p.architecture}\n rpeak: ${p.rpeak}\n FLOPSPerCycle: ${p.FLOPSPerCycle}\n Cores Per CPU: ${p.cores_per_cpu}`}>{p.model}</option>))}
              </select>
              {isAdmin && (
                <>
                  <button style={btnStyle("green")} onClick={() => { resetProcessorForm(); setIsEditMode(false); setShowProcessorForm(true); }}>Add</button>
                  <button style={btnStyle("orange")} onClick={() => { if (!nodes[activeNode].processor) { alert("Select Processor First"); return; } setProcessorForm(nodes[activeNode].processor); setIsEditMode(true); setShowProcessorForm(true); }}>Edit</button>
                </>
              )}
            </div>

            {/* MEMORY */}
            <label>Memory:</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select value={memoryList.findIndex((m) => m.memory_type === nodes[activeNode].memory?.memory_type)} onChange={(e) => setNodes({ ...nodes, [activeNode]: { ...nodes[activeNode], memory: memoryList[e.target.value] } })} style={{ flex: 1 }}>
                <option value="-1">Select Memory</option>
                {memoryList.map((m, i) => (
                            <option
                              key={i}
                              value={i}
                              title={`Memory Type: ${m.memory_type}
                              Category: ${m.component_category}
                              Module Capacity: ${m.module_capacity_gb} GB
                              Memory Speed: ${m.memory_speed_mts} MT/s
                              Memory Channels: ${m.memory_channels}                         
                              Total Memory Per Node: ${m.total_memory_per_node_gb} GB`}
                            >
                              {m.memory_type} ({m.total_memory_per_node_gb}GB/Node)
                            </option>
                          ))}
              </select>
              {isAdmin && (
                <>
                  <button style={btnStyle("green")} onClick={() => { resetMemoryForm(); setIsMemoryEditMode(false); setShowMemoryForm(true); }}>Add</button>
                  <button style={btnStyle("orange")} onClick={() => { if (!nodes[activeNode].memory) { alert("Select Memory First"); return; } setMemoryForm(nodes[activeNode].memory); setIsMemoryEditMode(true); setShowMemoryForm(true); }}>Edit</button>
                </>
              )}
            </div>

            {/* INTERCONNECT */}
            <label>Interconnect:</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select value={interconnects.findIndex((inter) => inter.product_name === nodes[activeNode].interconnect?.product_name)} onChange={(e) => setNodes({ ...nodes, [activeNode]: { ...nodes[activeNode], interconnect: interconnects[e.target.value] } })} style={{ flex: 1 }}>
                <option value="-1">Select Interconnect</option>
                {interconnects.map((inter, idx) => (
                      <option
                        key={idx}
                        value={idx}
                        title={`Product: ${inter.product_name}
                    Technology: ${inter.technology}
                    Port Speed: ${inter.port_speed_gbps} Gbps
                    Ports: ${inter.number_of_ports}
                    Aggregate Bandwidth: ${inter.aggregate_bandwidth_tbps} Tbps
                    Latency: ${inter.latency_ns} ns
                    Vendor: ${inter.vendor}`}
                      >
                        {inter.product_name}
                      </option>
                    ))}
              </select>
              {isAdmin && (
                <>
                  <button style={btnStyle("green")} onClick={() => { resetInterconnectForm(); setIsInterconnectEditMode(false); setShowInterconnectForm(true); }}>Add</button>
                  <button style={btnStyle("orange")} onClick={() => { if (!nodes[activeNode].interconnect) { alert("Select Interconnect First"); return; } setInterconnectForm(nodes[activeNode].interconnect); setIsInterconnectEditMode(true); setShowInterconnectForm(true); }}>Edit</button>
                </>
              )}
            </div>

            {/* GPU */}
            {activeNode === "gpuNode" && (
              <>
                <label>GPU:</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <select value={gpuOptions.findIndex((g) => g.name === nodes[activeNode].gpu?.name)} onChange={(e) => setNodes({ ...nodes, [activeNode]: { ...nodes[activeNode], gpu: gpuOptions[e.target.value] } })} style={{ flex: 1 }}>
                    <option value="-1">Select GPU</option>
                    {gpuOptions.map((g, idx) => (
                          <option
                            key={idx}
                            value={idx}
                            title={`GPU: ${g.name || g.model}
                        Architecture: ${g.architecture}
                        GPUs Per Node: ${g.gpusPerNode}
                        FP64 Performance: ${g.fp64}
                        GPU Memory: ${g.gpuMemory}
                        Interconnect: ${g.interconnect}
                        RPeak: ${g.rpeak}
                        Manufacturer: ${g.manufacturer}`}
                          >
                            {g.name || g.model}
                          </option>
                        ))}
                  </select>
                  {isAdmin && (
                    <>
                      <button style={btnStyle("green")} onClick={() => { resetGpuForm(); setIsGpuEditMode(false); setShowGpuForm(true); }}>Add</button>
                      <button style={btnStyle("orange")} onClick={() => { if (!nodes[activeNode].gpu) { alert("Select GPU First"); return; } setGpuForm(nodes[activeNode].gpu); setIsGpuEditMode(true); setShowGpuForm(true); }}>Edit</button>
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

      {/* ========================================================= */}
      {/* ================= PROCESSOR FORM ======================== */}
      {/* ========================================================= */}
      {showProcessorForm && (
        <Modal title={isEditMode ? "Edit Processor" : "Add Processor"} onSave={saveProcessor} onCancel={() => setShowProcessorForm(false)}>
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
          
          <input placeholder="Category " value={memoryForm.component_category} onChange={(e) => setMemoryForm({ ...memoryForm, component_category: e.target.value })} />
          <input placeholder="Memory Type" value={memoryForm.memory_type} onChange={(e) => setMemoryForm({ ...memoryForm, memory_type: e.target.value })} />
          <input placeholder="Module Capacity GB" value={memoryForm.module_capacity_gb} onChange={(e) => setMemoryForm({ ...memoryForm, module_capacity_gb: e.target.value })} />
          <input placeholder="Memory Speed (MT/s)" value={memoryForm.memory_speed_mts} onChange={(e) => setMemoryForm({ ...memoryForm, memory_speed_mts: e.target.value })} />
          <input placeholder="Memory Channels" value={memoryForm.memory_channels} onChange={(e) => setMemoryForm({ ...memoryForm, memory_channels: e.target.value })} />
          {/* <input placeholder="DIMMs Per Channel" value={memoryForm.dimms_per_channel} onChange={(e) => setMemoryForm({ ...memoryForm, dimms_per_channel: e.target.value })} /> */}
          <input placeholder="Total Memory Per Node GB" value={memoryForm.total_memory_per_node_gb} onChange={(e) => setMemoryForm({ ...memoryForm, total_memory_per_node_gb: e.target.value })} />
          <input type="number" placeholder="Price" value={memoryForm.price} onChange={(e) => setMemoryForm({ ...memoryForm, price: e.target.value })} />
        </Modal>
      )}

      {/* ================= GPU FORM ================= */}
      {showGpuForm && (
        <Modal title={isGpuEditMode ? "Edit GPU" : "Add GPU"} onSave={saveGpu} onCancel={() => setShowGpuForm(false)}>
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
        <Modal title={isInterconnectEditMode ? "Edit Interconnect" : "Add Interconnect"} onSave={saveInterconnect} onCancel={() => setShowInterconnectForm(false)}>
          <input placeholder="Category " value={interconnectForm.component_category} onChange={(e) => setInterconnectForm({ ...interconnectForm, component_category: e.target.value })} />
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
          <input placeholder="Component Category" value={rackForm.component_category} onChange={(e) => setRackForm({ ...rackForm, component_category: e.target.value })} />
          <input placeholder="Name" value={rackForm.name} onChange={(e) => setRackForm({ ...rackForm, name: e.target.value })} />
          <input type="number" placeholder="Price" value={rackForm.price} onChange={(e) => setRackForm({ ...rackForm, price: e.target.value })} />
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
            <th>Formula Used <br/> (base * cores * fpc * cpucount) / 1000</th><th>Total TFLOPS</th>
          </tr>
        </thead>
        <tbody>
          {dynamicRpeak.map((row, idx) => (
            <tr key={idx}>
              <td>{row.label}</td>
              <td>{row.qty}</td>
              <td>{row.val.toFixed(2)}</td>
              <td
                  style={{ fontSize: "12px", maxWidth: "500px", wordBreak: "break-word" }}
                  dangerouslySetInnerHTML={{ __html: row.formula }}
                />
              <td>{(row.val * row.qty).toFixed(2)}</td>
            </tr>
          ))}
          <tr style={{ background: "#dff0d8", fontWeight: "bold" }}>
            <td colSpan="4">Total System RPeak</td>
            <td>{dynamicRpeak.reduce((sum, row) => sum + row.val * row.qty, 0).toFixed(2)} TFLOPS</td>
          </tr>
        </tbody>
      </table>

      {/* ========================================================= */}
      {/* ================= TABLE B =============================== */}
      {/* ========================================================= */}
      <h2>Table B – Software Solutions & Services</h2>
      <table>
        <thead>
          <tr>
            <th>Service Details</th><th>Unit</th><th>Qty</th>
            <th>Price</th><th>Total</th>
            {isAdmin && <th>Admin Controls</th>}
          </tr>
        </thead>
        <tbody>
          {tableB.map((item, idx) => {
            const price = servicePrices[item.name] || 0;
            return (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.unit}</td>
                <td>
                  <input type="number" min="1" value={item.qty} onChange={(e) => { const updated = [...tableB]; updated[idx].qty = Number(e.target.value); setTableB(updated); }} />
                </td>
                <td>{price.toLocaleString("en-IN")}</td>
                <td>{(price * item.qty).toLocaleString("en-IN")}</td>
                {isAdmin && (
                  <td>
                    <button style={btnStyle("green")} onClick={() => alert(`Add ${item.name}`)}>Add</button>
                    <button style={btnStyle("orange")} onClick={() => alert(`Edit ${item.name}`)}>Edit</button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ========================================================= */}
      {/* ================= TABLE C =============================== */}
      {/* ========================================================= */}
      <h2>Table C – CDAC Add-on Services</h2>
      <table>
        <thead>
          <tr>
            <th>Service Details</th><th>Unit</th><th>Qty</th>
            <th>Price</th><th>Total</th>
            {isAdmin && <th>Admin Controls</th>}
          </tr>
        </thead>
        <tbody>
          {tableC.map((item, idx) => {
            const price = workshopPrices[item.name] || 0;
            return (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.unit}</td>
                <td>
                  <input type="number" min="1" value={item.qty} onChange={(e) => { const updated = [...tableC]; updated[idx].qty = Number(e.target.value); setTableC(updated); }} />
                </td>
                <td>{price.toLocaleString("en-IN")}</td>
                <td>{(price * item.qty).toLocaleString("en-IN")}</td>
                {isAdmin && (
                  <td>
                    <button style={btnStyle("green")} onClick={() => alert(`Add ${item.name}`)}>Add</button>
                    <button style={btnStyle("orange")} onClick={() => alert(`Edit ${item.name}`)}>Edit</button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ========================================================= */}
      {/* ================= TABLE D =============================== */}
      {/* ========================================================= */}
      <h2>Table D – Grand Total Summary</h2>
      <table className="summary-table">
        <tbody>
          <tr><td>Hardware Total</td><td>₹ {hardwareTotal_INR.toLocaleString("en-IN")}</td></tr>
          <tr><td>Software & Services Total</td><td>₹ {totalB_INR.toLocaleString("en-IN")}</td></tr>
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
      <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "50px" }}>
        <button className="pdf-btn" onClick={generatePDF}>Download PDF Report</button>
      </div>

    </div>
  );
}