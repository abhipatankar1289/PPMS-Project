package com.substring.app.ppms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "memory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Memory_Entity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String component_category;

    private String memory_type;
    private String module_capacity_gb;
    private String total_memory_per_node_gb;
    private Integer memory_speed_mts;
    private Integer memory_channels;
    private Double price;

}