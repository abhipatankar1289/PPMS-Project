package com.substring.app.ppms.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "processor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Processor_Entity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String manufacturer;

    private String model;

    private String architecture;

    private Integer cpus_per_node;

    private Integer cores_per_cpu;

    private Integer total_cores;

    private Double base_ghz;

    @Column(name = "l3_cache")
    private String l3Cache;

    @Column(name = "memory_type")
    private String memoryType;

    @Column(name = "pcie_gen")
    private String pcie_gen;

    private String tdp_watt;

    private Double price;

    private Double rpeak;

    @JsonProperty("FLOPSPerCycle")
    @Column(name = "`FLOPS/Cycle(DP)`")
    private Double FLOPSPerCycle;
}