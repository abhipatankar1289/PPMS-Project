package com.substring.app.ppms.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "gpu")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GPU_Entity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @JsonProperty("component_category")
    @Column(name = "component_category")
    private String componentCategory;

    private String manufacturer;

    private String architecture;

    @JsonProperty("gpusPerNode")
    private Integer gpusPerNode;

    @JsonProperty("gpuMemory")
    private String gpuMemory;

    private String interconnect;

    private Double price;

    private Double rpeak;

    @JsonProperty("fp64")
    @Column(name = "`FP64Performance/GPU`")
    private Double fp64;
}